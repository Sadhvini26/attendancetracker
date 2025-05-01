const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      student: user.role === 'student' ? user : null,
      faculty: user.role === 'faculty' ? user : null,
      admin: user.role === 'admin' ? user : null,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Add a user (admin or setup)
router.post('/add-user', async (req, res) => {
  try {
    const { username, password, role, name, originalSection, operationalSection } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      username,
      password,
      role,
      name,
      originalSection: role === 'student' ? originalSection : undefined,
      operationalSection: role === 'student' ? operationalSection : undefined
    });

    await newUser.save();
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Add user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.get('/verify-token', authenticateToken, (req, res) => {
  return res.status(200).json({ 
    message: 'Token is valid', 
    userId: req.user.userId,
    role: req.user.role
  });
});
module.exports = router;