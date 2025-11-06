import pool from '../config/db.js';

// GET /teacher/courses
export const getTeacherCourses = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const result = await pool.query(`
      SELECT c.id, c.title, c.description, c.published,
             (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id AND role = 'student') AS student_count
      FROM courses c
      JOIN enrollments e ON c.id = e.course_id
      WHERE e.user_id = $1 AND e.role = 'teacher'
      ORDER BY c.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// POST /teacher/courses
export const createCourse = async (req, res) => {
  const { title, description, published = false } = req.body;
  const userId = req.user.id;

  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    // Create course
    const course = await pool.query(`
      INSERT INTO courses (title, description, created_by, published)
      VALUES ($1, $2, $3, $4) RETURNING id, title, description, published
    `, [title.trim(), description || null, userId, published]);

    // Auto-enroll creator as teacher
    await pool.query(`
      INSERT INTO enrollments (user_id, course_id, role)
      VALUES ($1, $2, 'teacher')
    `, [userId, course.rows[0].id]);

    res.status(201).json(course.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create course' });
  }
};



// GET /student/courses
export const getStudentCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(`
      SELECT c.id, c.title, c.description
      FROM courses c
      JOIN enrollments e ON c.id = e.course_id
      WHERE e.user_id = $1 AND e.role = 'student' AND c.published = true
      ORDER BY c.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// GET /student/courses/:id/content
export const getCourseContent = async (req, res) => {
  const { id: courseId } = req.params;
  const userId = req.user.id;

  try {
    // Verify enrollment
    const enrollment = await pool.query(`
      SELECT 1 FROM enrollments
      WHERE user_id = $1 AND course_id = $2 AND role = 'student'
    `, [userId, courseId]);

    if (enrollment.rows.length === 0) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Fetch content hierarchy
    const content = await pool.query(`
      SELECT id, parent_id, item_type, title, content_url, order_index
      FROM content_items
      WHERE course_id = $1
      ORDER BY order_index, id
    `, [courseId]);

    res.json(content.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load content' });
  }
};