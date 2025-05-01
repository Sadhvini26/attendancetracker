const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to authenticate token
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

// Get available project ideas
router.get('/ideas', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ status: 'available' });
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Get project ideas error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.status(200).json(project);
  } catch (error) {
    console.error('Get project by ID error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Register for an existing project
router.post('/register/:id', authenticateToken, async (req, res) => {
  try {
    const { teamMembers } = req.body;
    
    // Find the project
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if project is still available
    if (project.status !== 'available') {
      return res.status(400).json({ message: 'Project is no longer available' });
    }
    
    // Validate team size
    if (teamMembers.length > project.maxTeamSize) {
      return res.status(400).json({ 
        message: `Maximum team size for this project is ${project.maxTeamSize}`
      });
    }
    
    // Update project with team information
    project.teamMembers = teamMembers;
    project.leadId = req.user.userId;
    project.status = 'registered';
    
    await project.save();
    
    return res.status(200).json({
      message: 'Project registration successful',
      project
    });
  } catch (error) {
    console.error('Project registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Submit a new custom project
router.post('/custom', authenticateToken, async (req, res) => {
  try {
    const { title, description, teamMembers, domain, skills } = req.body;
    
    // Validate request
    if (!title || !description || !teamMembers || teamMembers.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create project
    const newProject = new Project({
      title,
      description,
      domain,
      skills,
      teamMembers,
      leadId: req.user.userId,
      status: 'pending_approval'
    });
    
    await newProject.save();
    
    return res.status(201).json({ 
      message: 'Custom project submitted for approval',
      project: newProject
    });
  } catch (error) {
    console.error('Custom project submission error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all projects (for admin view)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin or faculty
    const user = await User.findById(req.user.userId);
    if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const projects = await Project.find().sort({ submissionDate: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get projects for a specific student
router.get('/student/my-projects', authenticateToken, async (req, res) => {
  try {
    console.log(req.user)
    console.log(req.user.name)
    const user = await User.findById(req.user.userId);
const projects = await Project.find({
  $or: [
    { leadId: req.user.userId },
    { 'teamMembers.rollNo': user.username } // Now using the correct username
  ]
}).sort({ submissionDate: -1 });
    console.log(projects);
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Get student projects error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;