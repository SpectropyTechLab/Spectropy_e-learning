// backend/controllers/scorm.controller.js
import pool from '../config/db.js';

// Save SCORM attempt
export const saveScormAttempt = async (req, res) => {
  const { contentItemId } = req.params;
  const { score_raw, completion_status, total_time, suspend_data } = req.body;
  
  try {
    // Check if content item is SCORM
    const content = await pool.query(
      'SELECT id FROM content_items WHERE id = $1 AND item_type = $2',
      [contentItemId, 'scorm']
    );
    if (!content.rows[0]) {
      return res.status(400).json({ error: 'Invalid SCORM content' });
    }

    // Get or increment attempt_no
    const lastAttempt = await pool.query(`
      SELECT attempt_no FROM scorm_attempts 
      WHERE user_id = $1 AND content_item_id = $2 
      ORDER BY attempt_no DESC LIMIT 1
    `, [req.user.id, contentItemId]);

    const attemptNo = lastAttempt.rows.length ? lastAttempt.rows[0].attempt_no + 1 : 1;

    const result = await pool.query(`
      INSERT INTO scorm_attempts 
        (user_id, content_item_id, attempt_no, score_raw, completion_status, total_time, suspend_data, finished_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id
    `, [
      req.user.id, 
      contentItemId, 
      attemptNo, 
      score_raw, 
      completion_status, 
      total_time, 
      suspend_data
    ]);

    // TODO: Check if course is complete → issue certificate

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save SCORM data' });
  }
};