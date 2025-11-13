import pool from "../config/db.js"; // or your db connection

export const enrollUserByEmail = async (req, res) => {
  const { courseId } = req.params;
  const { email, role } = req.body;

  // Validate input
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!role || !['student', 'teacher'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "student" or "teacher"' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Find user by email (case-insensitive)
    const userResult = await client.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found. Please ensure the user exists.');
    }
    const userId = userResult.rows[0].id;

    // 2. Check if already enrolled in this course
    const existingEnrollment = await client.query(
      'SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    if (existingEnrollment.rows.length > 0) {
      throw new Error('User is already enrolled in this course.');
    }

    // 3. Insert into enrollments
    await client.query(
      `
        INSERT INTO enrollments (user_id, course_id, role)
        VALUES ($1, $2, $3)
      `,
      [userId, courseId, role]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: `${role === 'student' ? 'Student' : 'Teacher'} enrolled successfully`,
      data: { userId, courseId, role }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Enrollment error:', err);

    // Return user-friendly error
    if (err.message.includes('User not found') || err.message.includes('already enrolled')) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Failed to enroll user. Please try again.' });
  } finally {
    client.release();
  }
};

/**
 * GET /admin/courses/:courseId/enrollments
 * (Optional) Get list of enrolled students/teachers for a course
 */
export const getCourseEnrollments = async (req, res) => {
  const { courseId } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT 
          u.id AS user_id,
          u.name,
          u.email,
          e.role,
          e.enrolled_at
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        WHERE e.course_id = $1
        ORDER BY e.role, u.name
      `,
      [courseId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching enrollments:', err);
    res.status(500).json({ error: 'Failed to load enrollments' });
  }
};

// For students: only published courses & enrolled users
export const getStudentCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    // 1. Verify enrollment + course published
    const enrollment = await pool.query(
      `
        SELECT e.role, c.published, c.title, c.description
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = $1 AND e.course_id = $2 AND e.role = 'student' AND c.published = true
      `,
      [userId, courseId]
    );

    if (enrollment.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied or course not published' });
    }

    const course = enrollment.rows[0];

    // 2. Fetch top-level folders (chapters) for the course
    const folders = await pool.query(
      `
        SELECT 
          id, 
          title, 
          item_type,
          order_index
        FROM content_items
        WHERE course_id = $1 AND parent_id IS NULL
        ORDER BY order_index, id
      `,
      [courseId]
    );

    // 3. For each folder, fetch its children
    const chaptersWithContent = [];
    for (const folder of folders.rows) {
      const children = await pool.query(
        `
          SELECT 
            id,
            title,
            item_type AS type,
            content_url,
            order_index
          FROM content_items
          WHERE parent_id = $1
          ORDER BY order_index, id
        `,
        [folder.id]
      );

      chaptersWithContent.push({
        id: folder.id,
        title: folder.title,
        position: folder.order_index || 0,
        content_items: children.rows.map(child => ({
          id: child.id,
          title: child.title,
          type: child.type,
          content_url: child.content_url,
        })),
      });
    }

    // 4. Also handle orphaned (non-folder) top-level items if needed
    // (Optional: only if you allow direct course-level content)
    const orphanedItems = await pool.query(
      `
        SELECT 
          id,
          title,
          item_type AS type,
          content_url,
          order_index
        FROM content_items
        WHERE course_id = $1 AND parent_id IS NULL AND item_type != 'folder'
        ORDER BY order_index, id
      `,
      [courseId]
    );

    if (orphanedItems.rows.length > 0) {
      chaptersWithContent.push({
        id: -1,
        title: 'General Content',
        position: -1,
        content_items: orphanedItems.rows.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          content_url: item.content_url,
        })),
      });
    }

    res.json({
      id: parseInt(courseId, 10),
      title: course.title,
      description: course.description,
      chapters: chaptersWithContent,
    });
  } catch (err) {
    console.error('Error loading student course:', err);
    res.status(500).json({ error: 'Failed to load course content' });
  }
};

// ✅ ADD THIS FUNCTION — you don't have it yet!
export const getStudentEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id; // Make sure your auth middleware sets req.user

    const result = await pool.query(
      `
        SELECT 
          c.id,
          c.title,
          c.description,
          e.enrolled_at
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = $1 
          AND e.role = 'student'
          AND c.published = true
        ORDER BY e.enrolled_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ error: 'Failed to load your courses' });
  }
};

// For teachers: can view even unpublished courses
export const getTeacherCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const enrollment = await pool.query(
      `
        SELECT e.role, c.title, c.description
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = $1 AND e.course_id = $2 AND e.role = 'teacher'
      `,
      [userId, courseId]
    );

    if (enrollment.rows.length === 0) {
      return res.status(403).json({ error: 'You are not teaching this course' });
    }

    const course = enrollment.rows[0];

    // Same chapter/content loading logic
    const chapters = await pool.query(
      `SELECT id, title, position FROM chapters WHERE course_id = $1 ORDER BY position`,
      [courseId]
    );

    const chaptersWithContent = [];
    for (const chapter of chapters.rows) {
      const contentItems = await pool.query(
        `SELECT id, title, type, content_url, position FROM content_items WHERE chapter_id = $1 ORDER BY position`,
        [chapter.id]
      );
      chaptersWithContent.push({
        ...chapter,
        content_items: contentItems.rows,
      });
    }

    res.json({
      id: courseId,
      title: course.title,
      description: course.description,
      chapters: chaptersWithContent,
    });
  } catch (err) {
    console.error('Error loading teacher course:', err);
    res.status(500).json({ error: 'Failed to load course' });
  }
};