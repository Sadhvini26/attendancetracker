const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// Add notice
router.post('/add', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Notice text is required' });
    }

    const newNotice = new Notice({ text });
    await newNotice.save();

    res.status(201).json({ message: 'Notice added successfully', notice: newNotice });
  } catch (error) {
    console.error('Add Notice Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notices
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices' });
  }
});
// GET /api/notices


module.exports = router;
