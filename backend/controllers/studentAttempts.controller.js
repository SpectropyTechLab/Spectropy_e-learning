// controllers/studentAttempts.controller.js
import pool from "../config/db.js";

export const recordItemAttempt = async (req, res) => {
    const userId = req.user.id;
    console.log("req.body:", req.body);
    const {
        content_item_id,
        score_raw = null,
        completion_status = "completed",
        suspend_data = null,
        total_time = null
    } = req.body;
    console.log("content_item_id:", content_item_id);
    console.log("userId:", userId);
    // ===== Validation =====
    if (!content_item_id) {
        return res.status(400).json({ error: "content_item_id is required" });
    }

    try {
        // ============================================================
        // 1️⃣ CHECK MOST RECENT ATTEMPT NUMBER FOR THIS USER + ITEM
        // ============================================================
        const attemptCheck = await pool.query(
            `
        SELECT attempt_no
        FROM Student_attempts
        WHERE user_id = $1 AND content_item_id = $2
        ORDER BY attempt_no DESC
        LIMIT 1
      `,
            [userId, content_item_id]
        );

        let attemptNo = 1;

        if (attemptCheck.rows.length > 0) {
            attemptNo = attemptCheck.rows[0].attempt_no + 1;
        }

        // ============================================================
        // 2️⃣ INSERT ATTEMPT RECORD
        // ============================================================
        const attempt = await pool.query(
            `
        INSERT INTO Student_attempts
        (user_id, content_item_id, attempt_no, score_raw, completion_status, suspend_data, total_time)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
            [
                userId,
                content_item_id,
                attemptNo,
                score_raw,
                completion_status,
                suspend_data,
                total_time
            ]
        );

        return res.json({
            success: true,
            message: "Attempt recorded successfully",
            attempt: attempt.rows[0]
        });

    } catch (err) {
        console.error("❌ recordItemAttempt ERROR:", err);
        return res.status(500).json({
            error: "Internal server error while recording item attempt"
        });
    }
};
