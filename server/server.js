// server/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'budget_app'
}).promise();

// User signup
app.post('/api/auth/signup', async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { name, email, password, phone } = req.body;

    // Check if user exists
    const [existing] = await connection.query(
      'SELECT USE_ID FROM T_USER_USE WHERE USE_EMAIL = ?',
      [email]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user
    const [result] = await connection.query(
      `INSERT INTO T_USER_USE 
       (USE_NAME, USE_EMAIL, USE_PASSWORD, USE_PHONE, USE_MONTHLY_INCOME, USE_MONTHLY_BUDGET, USE_SAVINGS_GOAL) 
       VALUES (?, ?, ?, ?, 0, 0, 0)`,
      [name, email, password, phone]
    );

    const userId = result.insertId;

    // Initialize transaction
    await connection.query(
      'INSERT INTO T_TRANSACTION_TRA (TRA_USER_ID, TRA_AMOUNT, TRA_TYPE, TRA_CATEGORY) VALUES (?, 0, "income", "Initial")',
      [userId]
    );

    await connection.commit();

    const [user] = await connection.query(
      'SELECT * FROM T_USER_USE WHERE USE_ID = ?',
      [userId]
    );

    res.status(201).json({ user: user[0] });
  } catch (error) {
    await connection.rollback();
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    connection.release();
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      'SELECT * FROM T_USER_USE WHERE USE_EMAIL = ? AND USE_PASSWORD = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update settings
app.post('/api/auth/settings/:userId', async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.params.userId;
    const { monthlyIncome, monthlyBudget, savingsGoal } = req.body;

    await connection.query(
      `UPDATE T_USER_USE 
       SET USE_MONTHLY_INCOME = ?,
           USE_MONTHLY_BUDGET = ?,
           USE_SAVINGS_GOAL = ?
       WHERE USE_ID = ?`,
      [monthlyIncome, monthlyBudget, savingsGoal, userId]
    );

    const [users] = await connection.query(
      'SELECT * FROM T_USER_USE WHERE USE_ID = ?',
      [userId]
    );

    if (users.length === 0) {
      throw new Error('User not found');
    }

    await connection.commit();
    res.json({ user: users[0] });
  } catch (error) {
    await connection.rollback();
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    connection.release();
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});