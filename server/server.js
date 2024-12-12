// server/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'budget_app'
}).promise();

// Debug database connection
db.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });

// AUTH ENDPOINTS
app.post('/api/auth/signup', async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { name, email, password, phone } = req.body;

    // Check existing user
    const [existingUser] = await connection.query(
      'SELECT * FROM T_USER_USE WHERE USE_EMAIL = ?',
      [email]
    );

    if (existingUser.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    const [userResult] = await connection.query(
      `INSERT INTO T_USER_USE 
       (USE_NAME, USE_EMAIL, USE_PASSWORD, USE_PHONE, USE_MONTHLY_INCOME, USE_MONTHLY_BUDGET, USE_SAVINGS_GOAL) 
       VALUES (?, ?, ?, ?, 0, 0, 0)`,
      [name, email, password, phone]
    );

    const userId = userResult.insertId;

    // Initialize transaction with 0
    await connection.query(
      'INSERT INTO T_TRANSACTION_TRA (TRA_USER_ID, TRA_AMOUNT, TRA_TYPE, TRA_CATEGORY, TRA_DATE) VALUES (?, ?, ?, ?, NOW())',
      [userId, 0, 'income', 'Initial']
    );

    // Initialize default objective
    await connection.query(
      'INSERT INTO T_OBJECTIF_OBJ (OBJ_USER_ID, OBJ_NAME, OBJ_TARGET_AMOUNT, OBJ_CURRENT_AMOUNT, OBJ_CREATED_AT) VALUES (?, ?, ?, ?, NOW())',
      [userId, 'Objectif Initial', 0, 0]
    );

    await connection.commit();

    // Get created user
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

    const user = users[0];
    // Log successful login
    await db.query(
      'INSERT INTO T_LOGIN_LOG (LOG_USER_ID, LOG_STATUS) VALUES (?, ?)',
      [user.USE_ID, 'success']
    );

    res.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// SETTINGS ENDPOINTS
app.post('/api/auth/settings/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { monthlyIncome, monthlyBudget, savingsGoal } = req.body;

    console.log('Updating settings for user:', userId, {
      monthlyIncome,
      monthlyBudget,
      savingsGoal
    });

    // Update user settings
    await db.query(
      `UPDATE T_USER_USE 
       SET USE_MONTHLY_INCOME = ?,
           USE_MONTHLY_BUDGET = ?,
           USE_SAVINGS_GOAL = ?
       WHERE USE_ID = ?`,
      [monthlyIncome, monthlyBudget, savingsGoal, userId]
    );

    // Get updated user data
    const [users] = await db.query(
      'SELECT * FROM T_USER_USE WHERE USE_ID = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      success: true,
      user: users[0] 
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});
// DASHBOARD DATA ENDPOINTS
app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get user data
    const [users] = await db.query(
      'SELECT * FROM T_USER_USE WHERE USE_ID = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get objectives
    const [objectives] = await db.query(
      'SELECT * FROM T_OBJECTIF_OBJ WHERE OBJ_USER_ID = ?',
      [userId]
    );

    // Get transactions
    const [transactions] = await db.query(
      'SELECT * FROM T_TRANSACTION_TRA WHERE TRA_USER_ID = ? ORDER BY TRA_DATE DESC LIMIT 5',
      [userId]
    );

    // Calculate total savings
    const [savings] = await db.query(
      `SELECT 
        SUM(CASE WHEN TRA_TYPE = 'income' THEN TRA_AMOUNT ELSE -TRA_AMOUNT END) as total_savings
       FROM T_TRANSACTION_TRA 
       WHERE TRA_USER_ID = ?`,
      [userId]
    );

    res.json({
      user: users[0],
      objectives,
      transactions,
      savings: savings[0].total_savings || 0
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});