import pool from '../config/db.js';
// In your backend (e.g., routes/admin/courses.js or .ts)

export const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, description, published, created_at
      FROM courses
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const createCourse = async (req, res) => {
  const { title, description, published = false } = req.body;
  const createdBy = req.user?.id; // assuming auth middleware attaches user

  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO courses (title, description, published, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, description, published, created_at
      `,
      [title.trim(), description?.trim() || null, published, createdBy]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Course creation error:', err);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// GET /admin/courses/:courseId/content
export const getCourseContent = async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, course_id, parent_id, item_type, title, content_url, order_index, created_at
       FROM content_items
       WHERE course_id = $1
       ORDER BY parent_id NULLS FIRST, order_index ASC, created_at ASC`,
      [courseId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch content:', err);
    res.status(500).json({ error: 'Failed to fetch course content' });
  }
};

// POST /admin/courses/:courseId/content
export const createContentItem = async (req, res) => {
  const { courseId } = req.params;
  const { item_type, title, parent_id = null, content_url = null } = req.body;

  const validTypes = ['folder', 'video', 'text', 'pdf', 'scorm', 'audio']; // added 'audio'
  if (!validTypes.includes(item_type)) {
    return res.status(400).json({ error: 'Invalid item type' });
  }

  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  // Optional: validate URL if provided
  if (content_url !== null && typeof content_url !== 'string') {
    return res.status(400).json({ error: 'content_url must be a string or null' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO content_items (course_id, parent_id, item_type, title, content_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [courseId, parent_id, item_type, title.trim(), content_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Content creation error:', err);
    res.status(500).json({ error: 'Failed to create content item' });
  }
};