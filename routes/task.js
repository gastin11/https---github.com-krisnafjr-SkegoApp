const express = require('express');
const router = express.Router();
const db = require('../database/db');
const moment = require('moment');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tb_task');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a task
router.post('/', async (req, res) => {
  const { task_name, difficulty_level, deadline, duration, priority_score, status, category, detail} = req.body;

  try {
    // Convert deadline from DD-MM-YYYY to YYYY-MM-DD
    const formattedDeadline = moment(deadline, 'DD-MM-YYYY').format('YYYY-MM-DD');

    const [result] = await db.query(
      'INSERT INTO tb_task (task_name, difficulty_level, deadline, duration, priority_score, status, category, detail) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [task_name, difficulty_level, formattedDeadline, duration, priority_score, status, category, detail]
    );
    res.status(201).json({ message: 'Task added successfully', taskId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task
router.put('/:id_task', async (req, res) => {
  const { id_task } = req.params;
  const { task_name, difficulty_level, deadline, duration, priority_score, status, category, detail } = req.body;
  // Convert deadline from DD-MM-YYYY to YYYY-MM-DD
  const formattedDeadline = moment(deadline, 'DD-MM-YYYY').format('YYYY-MM-DD');

  try {
    const [result] = await db.query(
      'UPDATE tb_task SET task_name = ?, difficulty_level = ?, deadline = ?, duration = ?, priority_score = ?, status = ?, category = ?, detail = ? WHERE id_task = ?',
      [task_name, difficulty_level, formattedDeadline, duration, priority_score, status, category, detail ,id_task]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
router.delete('/:id_task', async (req, res) => {
  const { id_task } = req.params;

  try {
    const [result] = await db.query('DELETE FROM tb_task WHERE id_task = ?', [id_task]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
