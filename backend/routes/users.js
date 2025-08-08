const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const SALT_ROUNDS = 12;

const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

const checkPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

router.post('/login', async (req, res) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Missing username or password' });
        }

        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];

        const isMatch = await checkPassword(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const normalizedIp = req.ip.replace('::ffff:', '');

        await pool.query(
            'UPDATE users SET last_login = NOW(), last_login_ip = $1 WHERE id = $2',
            [normalizedIp, user.id]
        );

        if (!JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(500).json({ error: 'Server misconfiguration' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                is_admin: user.is_admin,
                last_login: new Date(),
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, is_admin FROM users WHERE id = $1',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: rows[0] });
  } catch (e) {
    console.error('Error in /users/me:', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;