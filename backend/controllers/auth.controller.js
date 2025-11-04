// backend/controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { email, full_name, password, role } = req.body;
  console.log(req.body);
  if (!['admin', 'student'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
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

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log(user);
    if (!user.rows[0]) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await comparePassword(password, user.rows[0].password_hash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.rows[0].id]);

    const token = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};