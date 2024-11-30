const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Register user
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const createdAt = new Date();

  try {
    const [result] = await db.query(
      'INSERT INTO tb_user (username, password, email, created_at) VALUES (?, ?, ?, ?)',
      [username, password, email, createdAt]
    );
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM tb_user WHERE username = ? AND password = ?', [
      email,
      password,
    ]);

    if (rows.length > 0) {
      res.json({ message: 'Login successful', user: rows[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.post('/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Periksa apakah user dengan email dan password lama ada
    const [rows] = await db.query(
      'SELECT * FROM tb_user WHERE email = ? AND password = ?',
      [email, oldPassword]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or old password' });
    }

    // Update password dengan password baru
    await db.query('UPDATE tb_user SET password = ? WHERE email = ?', [newPassword, email]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
