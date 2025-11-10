import pool from "../config/db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import supabase from "../config/supabaseClient.js"; // ✅ Supabase client
import AdmZip from "adm-zip";
import { parseStringPromise } from "xml2js";


// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Temporary upload directory (local buffer before uploading to Supabase)
const uploadDir = path.join(__dirname, "../../uploads/temp");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Allow only videos, pdfs, and zip (SCORM)
const fileFilter = (req, file, cb) => {
  const allowed = ["video", "audio", "pdf", "zip", "application/zip"];
  const typeOk = allowed.some((t) => file.mimetype.includes(t));
  typeOk ? cb(null, true) : cb(new Error("Invalid file type"));
};

export const upload = multer({ storage, fileFilter });

/**
 * Upload content file (video/pdf/scorm) to Supabase Storage
 * and store metadata in PostgreSQL
 */
export const uploadContentFile = async (req, res) => {
  const { courseId } = req.params;
  const { item_type, title, parent_id = null } = req.body;

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const filePath = req.file.path;
    const bucket = process.env.SUPABASE_BUCKET || "course-files";
    let publicUrl = "";

    // ---------- SCORM ZIP Handling ----------
    if (item_type === "scorm") {
      // 1️⃣ Unzip SCORM package
      const zip = new AdmZip(filePath);
      const tempFolder = filePath.replace(".zip", "_unzipped");
      zip.extractAllTo(tempFolder, true);

      // 2️⃣ Parse imsmanifest.xml to find launch file
      const manifestPath = path.join(tempFolder, "imsmanifest.xml");
      if (!fs.existsSync(manifestPath)) throw new Error("imsmanifest.xml not found");

      const xmlData = fs.readFileSync(manifestPath, "utf8");
      const parsedManifest = await parseStringPromise(xmlData);
      const launchFile = parsedManifest.manifest.resources[0].resource[0].$.href;

      // 3️⃣ Upload all files recursively to Supabase
      const uploadFolder = `${courseId}/${Date.now()}`;
      const uploadRecursively = async (dirPath, relativePath = "") => {
        for (const file of fs.readdirSync(dirPath, { withFileTypes: true })) {
          const fullPath = path.join(dirPath, file.name);
          const relPath = relativePath ? `${relativePath}/${file.name}` : file.name;

          if (file.isDirectory()) {
            await uploadRecursively(fullPath, relPath);
          } else {
            const buffer = fs.readFileSync(fullPath);
            await supabase.storage.from(bucket).upload(
              `${uploadFolder}/${relPath}`,
              buffer,
              { contentType: "application/octet-stream", upsert: true }
            );
          }
        }
      };
      await uploadRecursively(tempFolder);

      // 4️⃣ Construct public launch URL for iframe
      const supabaseUrl = process.env.SUPABASE_URL;
      publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${uploadFolder}/${launchFile}`;
     
      // 5️⃣ Cleanup temp files
      fs.rmSync(tempFolder, { recursive: true, force: true });
      fs.unlinkSync(filePath);
    }
    // ---------- Non-SCORM files ----------
    else {
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = `${courseId}/${Date.now()}_${req.file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileBuffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      publicUrl = publicUrlData.publicUrl;

      fs.unlinkSync(filePath);
    }

    // ---------- Save metadata in DB ----------
    const result = await pool.query(
      `INSERT INTO content_items (course_id, parent_id, item_type, title, content_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [courseId, parent_id, item_type, title?.trim() || req.file.originalname, publicUrl]
    );

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: result.rows[0],
    });
  } catch (err) {
    console.error("File upload + DB error:", err);
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ error: "Failed to upload and save content" });
  }
};


// backend/controllers/scorm.controller.js
export const saveScormProgress = async (req, res) => {
  const { userId, contentId, data, attemptNo = 1 } = req.body;

  const score = parseFloat(data["cmi.core.score.raw"] || 0);
  const status = data["cmi.core.lesson_status"] || "incomplete";
  const suspendData = data["cmi.suspend_data"] || null;
  const totalTime = data["cmi.core.total_time"] || null;

  try {
    await pool.query(
      `
      INSERT INTO scorm_attempts (
        user_id, content_item_id, attempt_no, score_raw, completion_status, suspend_data, total_time, finished_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (user_id, content_item_id, attempt_no)
      DO UPDATE
        SET score_raw = EXCLUDED.score_raw,
            completion_status = EXCLUDED.completion_status,
            suspend_data = EXCLUDED.suspend_data,
            total_time = EXCLUDED.total_time,
            finished_at = NOW();
      `,
      [userId, contentId, attemptNo, score, status, suspendData, totalTime]
    );

    res.status(200).json({ success: true, message: "SCORM progress saved." });
  } catch (err) {
    console.error("❌ Error saving SCORM progress:", err);
    res.status(500).json({ success: false, message: "Error saving SCORM progress" });
  }
};


export const getScormProgress = async (req, res) => {
  const { userId, contentId } = req.params;

  try {
    const result = await pool.query(
      `SELECT suspend_data FROM scorm_attempts
       WHERE user_id = $1 AND content_item_id = $2
       ORDER BY attempt_no DESC LIMIT 1`,
      [userId, contentId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "No progress found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching SCORM progress:", err);
    res.status(500).json({ message: "Error fetching progress" });
  }
};
