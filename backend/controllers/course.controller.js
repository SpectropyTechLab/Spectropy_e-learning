// backend/controllers/course.controller.js
import pool from '../config/db.js';

// Get all published courses for student
export const getStudentCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.title, c.description
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = $1 AND c.published = true
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get course content tree (recursive)
export const getCourseContent = async (req, res) => {
  const { courseId } = req.params;
  
  try {
    // Simple flat list (for MVP); in production, use recursive CTE
    const result = await pool.query(`
      SELECT id, parent_id, item_type, title, content_url, order_index
      FROM content_items
      WHERE course_id = $1
      ORDER BY parent_id NULLS FIRST, order_index
    `, [courseId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};