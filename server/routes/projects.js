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

// Get available project ideas (only those with maxTeams > 0)
router.get('/ideas', authenticateToken, async (req, res) => {
  try {
    console.log('🔐 Authenticated user:', req.user); // debug logged-in user
    console.log('📥 Fetching projects with status "available" and maxTeams > 0...');

    const projects = await Project.find({ 
      status: 'available'
      // maxTeams: { $gt: 0 } 
    });

    console.log(`✅ Found ${projects.length} available project(s)`);
    return res.status(200).json(projects);
    
  } catch (error) {
    console.error('❌ Get project ideas error:', error.message);
    console.error('📛 Stack Trace:', error.stack);
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
    
    // Check availability by both status and maxTeams
    if (project.status !== 'available' || project.maxTeams <= 0) {
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
    
    // Decrement available slots
    project.maxTeams -= 1;
    // If no more slots, flip status to 'registered'
    project.status = project.maxTeams > 0 ? 'available' : 'registered';
    
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
// const Project = require('../models/Project');




// Submit a new custom project
// router.post('/custom', authenticateToken, async (req, res) => {
//   try {
//     const { title, description, teamMembers, domain, skills, maxTeams, maxTeamSize, deadline } = req.body;
    
//     // Validate request
//     if (!title || !description || !Array.isArray(teamMembers) || teamMembers.length === 0) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }
    
//     // Create project
//     const newProject = new Project({
//       title,
//       description,
//       domain,
//       skills,
//       deadline,
//       maxTeamSize,
//       maxTeams: typeof maxTeams === 'number' ? maxTeams : 1,  // default 1 if not provided
//       teamMembers,
//       leadId: req.user.userId,
//       status: 'pending_approval',
//       submissionDate: new Date()
//     });
    
//     await newProject.save();
    
//     return res.status(201).json({ 
//       message: 'Custom project submitted for approval',
//       project: newProject
//     });
//   } catch (error) {
//     console.error('Custom project submission error:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// Get all projects (for admin/faculty)
router.get('/', authenticateToken, async (req, res) => {
  try {
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
    const user = await User.findById(req.user.userId);
    const projects = await Project.find({
      $or: [
        { leadId: req.user.userId },
        { 'teamMembers.rollNo': user.username }
      ]
    }).sort({ submissionDate: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Get student projects error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get projects mentored by a specific faculty
router.get('/mentored-by/:facultyUsername', authenticateToken, async (req, res) => {
  try {
    const { facultyUsername } = req.params;
    const projects = await Project
      .find({ 
        mentor: facultyUsername,
        status: { $in: ['registered', 'active'] }
      })
      .populate('teamMembers', 'name rollNo');
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Get mentored projects error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
// routes/projects.js
// const express = require('express');
// const router = express.Router();
// const authenticateToken = require('../middleware/auth');
// const Project = require('../models/Project');

// POST /api/projects/add
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { title, description, domain, skills, deadline, maxTeamSize } = req.body;
    console.log(req.user);
    
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const mentorIdentifier = req.user.username || req.user.name || req.user.userId;
    const newProject = new Project({
      title: title.trim(),
      description: description.trim(),
      domain: domain?.trim() || '',
      skills: Array.isArray(skills) ? skills : [],
      mentor: mentorIdentifier,
      deadline: deadline ? new Date(deadline) : null,
      maxTeamSize: maxTeamSize || 4,
      status: 'available'
    });

    await newProject.save();
    console.log(`✅ Project "${newProject.title}" added by ${mentorIdentifier}`);
    res.status(201).json({ message: 'Project added successfully', project: newProject });
  } catch (err) {
    console.error('❌ Error adding project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/projects/my-projects
router.get('/faculty/my-projects', authenticateToken, async (req, res) => {
  try {
    const mentorIdentifier = req.user.username || req.user.name || req.user.userId;
    const projects = await Project.find({ mentor: mentorIdentifier })
      .sort({ submissionDate: -1 });
    console.log(`📋 Retrieved ${projects.length} projects for ${mentorIdentifier}`);
    res.json(projects);
  } catch (err) {
    console.error('❌ Error fetching projects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// module.exports = router;
