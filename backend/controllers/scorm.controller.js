import pool from '../config/db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Simple disk storage (for dev only!)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads'); 

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Optional: add file filter for security
// In scorm.controller.js
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Videos
    'video/mp4',
    'video/webm',
    'video/ogg',
    // Audios
    'audio/mpeg',
    'audio/ogg',
    'audio/wav',
    'audio/webm',
    // PDF
    'application/pdf',
    // ZIP (for SCORM)
    'application/zip',
    'application/x-zip-compressed',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, WebM, OGG, MP3, WAV, PDF, and ZIP files allowed.'), false);
  }
};
const upload = multer({ storage, fileFilter });

// Export this so you can use it in routes
export { upload };

// New controller: handle uploaded file + metadata
export const uploadContentFile = async (req, res) => {
  const { courseId } = req.params;
  const { item_type, title, parent_id = null } = req.body;

  // Validate file
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const validTypes = ['video', 'audio', 'pdf', 'scorm'];
  if (!validTypes.includes(item_type)) {
    return res.status(400).json({ error: 'Uploaded items must be video, audio, pdf, or scorm' });
  }

  // Construct public URL (adjust based on your static file serving)
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const content_url = `${baseUrl}/uploads/${req.file.filename}`;

  try {
    const result = await pool.query(
      `INSERT INTO content_items (course_id, parent_id, item_type, title, content_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [courseId, parent_id, item_type, title?.trim() || req.file.originalname, content_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('File upload + DB save error:', err);
    // Optionally delete uploaded file on DB failure
    fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to save uploaded content' });
  }
};