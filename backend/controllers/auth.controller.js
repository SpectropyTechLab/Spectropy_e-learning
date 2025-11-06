// backend/controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Updated registration: allow role, but restrict to safe ones
export const register = async (req, res) => {
  const { email, full_name, password, role } = req.body;

  // 🔒 Only allow self-registration for these roles
  const ALLOWED_ROLES_FOR_REGISTRATION = ['student', 'teacher']; // ← customize as needed

  if (!ALLOWED_ROLES_FOR_REGISTRATION.includes(role)) {
    return res.status(400).json({ error: 'This role cannot be registered publicly.' });
  }

  try {
    const hashed = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO users (email, full_name, password_hash, role) 
       VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role`,
      [email, full_name, hashed, role]
    );

    const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// ✅ Login (supports all roles)
export const login = async (req, res) => {
  console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
  const { email, password } = req.body;
  
  try {
    const userQueryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userQueryResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userQueryResult.rows[0];
    const isValid = await comparePassword(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ✅ Super Admin registers admins
export const registerAdmin = async (req, res) => {
  // Super Admin check is done in middleware (see Step 2)
  const { email, full_name, password } = req.body;
  const role = 'admin'; // 🔒 Hardcoded — only admins can be created this way

  try {
    const hashed = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO users (email, full_name, password_hash, role) 
       VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role`,
      [email, full_name, hashed, role]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Admin registration failed' });
  }
};