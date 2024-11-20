// src/api/auth.js
const express = require('express');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const router = express.Router();
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'budget_app'
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    // Check if email exists
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    await pool.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, hashedPassword]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = users[0].id;
    res.json({ success: true, user: { id: users[0].id, name: users[0].name } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;