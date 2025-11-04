// backend/controllers/course.controller.js
import pool from '../config/db.js';

// Create new course
export const createCourse = async (req, res) => {
  const { title, description, created_by } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO courses (title, description, created_by, published)
       VALUES ($1, $2, $3, FALSE)
       RETURNING *`,
      [title, description, created_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create course" });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Get single course
export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Course not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, published } = req.body;

  try {
    const result = await pool.query(
      `UPDATE courses
       SET title = $1, description = $2, published = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [title, description, published, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update course" });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM courses WHERE id = $1", [id]);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete course" });
  }
};




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