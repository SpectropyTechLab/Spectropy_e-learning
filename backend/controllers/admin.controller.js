import pool from '../config/db.js';
// GET /admin/courses/:id/students (list enrolled students)
export const getCourseStudents = async (req, res) => {
  const { id: courseId } = req.params;
  try {
    const result = await pool.query(`
      SELECT u.id, u.full_name, u.email, e.enrolled_at
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      WHERE e.course_id = $1 AND e.role = 'student'
      ORDER BY e.enrolled_at DESC
    `, [courseId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// GET /admin/students (list all students)
export const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, full_name, email
      FROM users
      WHERE role = 'student' AND is_active = true
      ORDER BY full_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// POST /admin/courses/:id/enroll-student
export const enrollStudentInCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    // Verify course exists
    const course = await pool.query('SELECT id FROM courses WHERE id = $1', [courseId]);
    if (course.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Verify student exists
    const student = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND role = $2 AND is_active = true',
      [studentId, 'student']
    );
    if (student.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if already enrolled
    const existing = await pool.query(
      'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [studentId, courseId]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Student already enrolled' });
    }

    // Enroll student
    await pool.query(
      'INSERT INTO enrollments (user_id, course_id, role) VALUES ($1, $2, $3)',
      [studentId, courseId, 'student']
    );

    res.status(201).json({ message: 'Student enrolled successfully' });
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ error: 'Failed to enroll student' });
  }
};

// DELETE /admin/courses/:id/unenroll-student/:studentId
export const unenrollStudentFromCourse = async (req, res) => {
  const { id: courseId, studentId } = req.params;
  try {
    await pool.query(
      'DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2 AND role = $3',
      [studentId, courseId, 'student']
    );
    res.json({ message: 'Student unenrolled successfully' });
  } catch (err) {
    console.error('Unenroll error:', err);
    res.status(500).json({ error: 'Failed to unenroll student' });
  }
};

// GET /admin/courses (list all courses)
export const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title
      FROM courses
      ORDER BY title
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};