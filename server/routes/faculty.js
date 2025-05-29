const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project'); // Assuming you have a Project model
const auth = require('../middleware/auth'); // Your authentication middleware

// Get faculty profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Ensure the user is a faculty member
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied. Faculty role required.' });
    }

    const faculty = await User.findById(req.user.id).select('-password');
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json(faculty);
  } catch (error) {
    console.error('Get faculty profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;