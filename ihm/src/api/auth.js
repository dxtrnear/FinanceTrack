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

    // Insert new user into T_USER_USE
    const [result] = await pool.query(
      'INSERT INTO T_USER_USE (USE_NAME, USE_EMAIL, USE_PASSWORD, USE_PHONE) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone]
    );

    const userId = result.insertId;

    // Initialize T_TRANSACTION_TRA and T_OBJECTIF_OBJ with default values
    await pool.query(
      'INSERT INTO T_TRANSACTION_TRA (TRA_AMOUNT, TRA_CATEGORY, TRA_DATE, TRA_TYPE, TRA_USER_ID) VALUES (?, ?, NOW(), ?, ?)',
      [0.00, 'Initial', 'init', userId]
    );

    await pool.query(
      'INSERT INTO T_OBJECTIF_OBJ (OBJ_NAME, OBJ_TARGET_AMOUNT, OBJ_CURRENT_AMOUNT, OBJ_CREATED_AT, OBJ_DEADLINE, OBJ_USER_ID) VALUES (?, ?, ?, NOW(), NULL, ?)',
      ['Default Objective', 0.00, 0.00, userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
