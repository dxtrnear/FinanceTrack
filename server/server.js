// server.js
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

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    // Log the table structure first
    const [columns] = await db.query('DESCRIBE T_USER_USE');
    console.log('Table structure:', columns);

    const [existingUser] = await db.query('SELECT * FROM T_USER_USE WHERE USE_EMAIL = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    await db.query(
      'INSERT INTO T_USER_USE (USE_NAME, USE_EMAIL, USE_PASSWORD, USE_PHONE) VALUES (?, ?, ?, ?)',
      [name, email, password, phone]
    );
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query(
      'SELECT * FROM T_USER_USE WHERE USE_EMAIL = ? AND USE_PASSWORD = ?', 
      [email, password]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});