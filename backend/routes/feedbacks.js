const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM feedbacks');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const feedback = req.body;

  if (!feedback.form_data) {
    return res.status(400).json({ error: 'form_data is required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO feedbacks (form_data) VALUES ($1);',
      [JSON.stringify(feedback.form_data)]
    );
    res.status(200).send('Feedback created successfully');
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;