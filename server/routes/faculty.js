// // const express = require('express');
// // const router = express.Router();
// // const Project = require('../models/Project');
// // const User = require('../models/User');
// // const jwt = require('jsonwebtoken');

// // // Middleware to authenticate token
// // const authenticateToken = (req, res, next) => {
// //   const authHeader = req.headers['authorization'];
// //   const token = authHeader && authHeader.split(' ')[1];
// //   console.log('🔐 Authenticating token:', token);

// //   if (!token) {
// //     console.log('⛔ No token provided');
// //     return res.status(401).json({ message: 'Authentication token required' });
// //   }

// //   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
// //     if (err) {
// //       console.log('❌ Token verification failed:', err.message);
// //       return res.status(403).json({ message: 'Invalid or expired token' });
// //     }
// //     console.log('✅ Token valid:', user);
// //     req.user = user;
// //     next();
// //   });
// // };


// // // Middleware to check if user is faculty
// // const checkFaculty = (req, res, next) => {
// //   console.log('🔍 [DEBUG] In checkFaculty middleware');
// //   console.log('📌 facultyUser:', req.facultyUser);

// //   if (!req.facultyUser || req.facultyUser.role !== 'faculty') {
// //     console.log('❌ Not a faculty member');
// //     return res.status(403).json({ message: 'Access denied: not faculty' });
// //   }

// //   console.log('✅ Faculty check passed');
// //   next();
// // };


// // // Add a new project by faculty
// // router.post('/add', authenticateToken, async (req, res) => {
// //   console.log('📥 /add route hit');
// //   try {
// //     const { title, description, domain, skills, deadline, maxTeamSize } = req.body;
    
// //     // Validate required fields
// //     if (!title || !description) {
// //       return res.status(400).json({ message: 'Title and description are required' });
// //     }
    
// //     // Create new project with faculty as mentor
// //     const newProject = new Project({
// //       title: title.trim(),
// //       description: description.trim(),
// //       domain: domain ? domain.trim() : '',
// //       skills: Array.isArray(skills) ? skills : [],
// //       mentor: req.facultyUser.username || req.facultyUser.name, // Use faculty username or name as mentor
// //       deadline: deadline ? new Date(deadline) : null,
// //       maxTeamSize: maxTeamSize || 4,
// //       status: 'available',
// //       submissionDate: new Date()
// //     });
    
// //     await newProject.save();
    
// //     console.log(`✅ Project "${title}" added by faculty ${req.facultyUser.name}`);
    
// //     return res.status(201).json({
// //       message: 'Project added successfully',
// //       project: newProject
// //     });
    
// //   } catch (error) {
// //     console.error('❌ Add project error:', error.message);
// //     return res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Get all projects created by current faculty
// // router.get('/my-projects', authenticateToken,checkFaculty,  async (req, res) => {
// //   // Debug incoming request
// //   console.log('🔍 [DEBUG] Incoming GET /my-projects');
// //   console.log('🔐 [DEBUG] Authorization header:', req.headers.authorization);
// //   console.log('🕵️ [DEBUG] Parsed facultyUser in request:', req.facultyUser);

// //   try {
// //     const facultyIdentifier = req.facultyUser.username || req.facultyUser.name;
// //     console.log(`🆔 [DEBUG] Using mentor identifier: ${facultyIdentifier}`);

// //     const projects = await Project.find({ mentor: facultyIdentifier })
// //       .sort({ submissionDate: -1 });

// //     console.log(`📋 Retrieved ${projects.length} projects for faculty "${req.facultyUser.name}"`);

// //     // Log the actual project documents (for a quick peek—remove or limit in prod)
// //     console.log('📦 Projects payload:', JSON.stringify(projects, null, 2));

// //     return res.status(200).json(projects);

// //   } catch (error) {
// //     console.error('❌ Get faculty projects error:', error);
// //     console.error('❌ Full error stack:', error.stack);
// //     return res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Update a project (only by the mentor faculty)
// // router.put('/update/:id', authenticateToken, checkFaculty, async (req, res) => {
// //   try {
// //     const { title, description, domain, skills, deadline, maxTeamSize, status } = req.body;
// //     const projectId = req.params.id;
    
// //     // Find the project
// //     const project = await Project.findById(projectId);
// //     if (!project) {
// //       return res.status(404).json({ message: 'Project not found' });
// //     }
    
// //     // Check if faculty is the mentor of this project
// //     const facultyIdentifier = req.facultyUser.username || req.facultyUser.name;
// //     if (project.mentor !== facultyIdentifier) {
// //       return res.status(403).json({ message: 'You can only update projects you mentor' });
// //     }
    
// //     // Update project fields
// //     if (title) project.title = title.trim();
// //     if (description) project.description = description.trim();
// //     if (domain !== undefined) project.domain = domain.trim();
// //     if (skills && Array.isArray(skills)) project.skills = skills;
// //     if (deadline) project.deadline = new Date(deadline);
// //     if (maxTeamSize) project.maxTeamSize = maxTeamSize;
// //     if (status && ['available', 'registered', 'completed'].includes(status)) {
// //       project.status = status;
// //     }
    
// //     await project.save();
    
// //     console.log(`✅ Project "${project.title}" updated by faculty ${req.facultyUser.name}`);
    
// //     return res.status(200).json({
// //       message: 'Project updated successfully',
// //       project
// //     });
    
// //   } catch (error) {
// //     console.error('❌ Update project error:', error.message);
// //     return res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Delete a project (only by the mentor faculty)
// // router.delete('/delete/:id', authenticateToken, checkFaculty, async (req, res) => {
// //   try {
// //     const projectId = req.params.id;
    
// //     // Find the project
// //     const project = await Project.findById(projectId);
// //     if (!project) {
// //       return res.status(404).json({ message: 'Project not found' });
// //     }
    
// //     // Check if faculty is the mentor of this project
// //     const facultyIdentifier = req.facultyUser.username || req.facultyUser.name;
// //     if (project.mentor !== facultyIdentifier) {
// //       return res.status(403).json({ message: 'You can only delete projects you mentor' });
// //     }
    
// //     // Don't allow deletion if project has registered teams
// //     if (project.status === 'registered' && project.teamMembers && project.teamMembers.length > 0) {
// //       return res.status(400).json({ 
// //         message: 'Cannot delete project with registered teams. Please contact admin.' 
// //       });
// //     }
    
// //     await Project.findByIdAndDelete(projectId);
    
// //     console.log(`🗑️ Project "${project.title}" deleted by faculty ${req.facultyUser.name}`);
    
// //     return res.status(200).json({
// //       message: 'Project deleted successfully'
// //     });
    
// //   } catch (error) {
// //     console.error('❌ Delete project error:', error.message);
// //     return res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Get project statistics for faculty
// // router.get('/stats', authenticateToken, checkFaculty, async (req, res) => {
// //   try {
// //     const facultyIdentifier = req.facultyUser.username || req.facultyUser.name;
    
// //     const totalProjects = await Project.countDocuments({ mentor: facultyIdentifier });
// //     const availableProjects = await Project.countDocuments({ 
// //       mentor: facultyIdentifier, 
// //       status: 'available' 
// //     });
// //     const registeredProjects = await Project.countDocuments({ 
// //       mentor: facultyIdentifier, 
// //       status: 'registered' 
// //     });
// //     const completedProjects = await Project.countDocuments({ 
// //       mentor: facultyIdentifier, 
// //       status: 'completed' 
// //     });
    
// //     return res.status(200).json({
// //       totalProjects,
// //       availableProjects,
// //       registeredProjects,
// //       completedProjects
// //     });
    
// //   } catch (error) {
// //     console.error('❌ Get project stats error:', error.message);
// //     return res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // module.exports = router;

// // facultyProjectsRoutes.js
// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const Project = require('../models/Project'); // Adjust path to your Project model
// const Faculty = require('../models/User'); // Adjust path to your Faculty model

// // Middleware to authenticate JWT token
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
  
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication token required' });
//   }
  
//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }
//     req.facultyUser = user;
//     next();
//   });
// };

// // Add new project
// router.post('/add', authenticateToken, async (req, res) => {
//   console.log('📥 /add route hit');
//   try {
//     const { title, description, domain, skills, deadline, maxTeamSize } = req.body;
    
//     // Validate required fields
//     if (!title || !description) {
//       return res.status(400).json({ message: 'Title and description are required' });
//     }
    
//     // Create new project with faculty as mentor
//     const newProject = new Project({
//       title: title.trim(),
//       description: description.trim(),
//       domain: domain ? domain.trim() : '',
//       skills: Array.isArray(skills) ? skills : [],
//       mentor: req.facultyUser.username || req.facultyUser.name,
//       facultyId: req.facultyUser._id, // Store faculty ID for filtering
//       deadline: deadline ? new Date(deadline) : null,
//       maxTeamSize: maxTeamSize || 4,
//       status: 'available',
//       submissionDate: new Date(),
//       teamMembers: []
//     });
    
//     await newProject.save();
    
//     console.log(`✅ Project "${title}" added by faculty ${req.facultyUser.name}`);
    
//     return res.status(201).json({
//       message: 'Project added successfully',
//       project: newProject
//     });
    
//   } catch (error) {
//     console.error('❌ Add project error:', error.message);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get faculty's own projects
// router.get('/my-projects', authenticateToken,async (req, res) => {
//   console.log('📥 /my-projects route hit');
//   try {
//     const projects = await Project.find({ 
//       facultyId: req.facultyUser._id 
//     }).sort({ submissionDate: -1 });
    
//     console.log(`✅ Found ${projects.length} projects for faculty ${req.facultyUser.name}`);
    
//     return res.status(200).json(projects);
    
//   } catch (error) {
//     console.error('❌ Fetch projects error:', error.message);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get project statistics for faculty
// router.get('/stats', authenticateToken, async (req, res) => {
//   console.log('📥 /stats route hit');
//   try {
//     const facultyId = req.facultyUser._id;
    
//     const totalProjects = await Project.countDocuments({ facultyId });
//     const availableProjects = await Project.countDocuments({ 
//       facultyId, 
//       status: 'available' 
//     });
//     const registeredProjects = await Project.countDocuments({ 
//       facultyId, 
//       status: 'registered' 
//     });
//     const completedProjects = await Project.countDocuments({ 
//       facultyId, 
//       status: 'completed' 
//     });
    
//     const stats = {
//       totalProjects,
//       availableProjects,
//       registeredProjects,
//       completedProjects
//     };
    
//     console.log(`✅ Stats for faculty ${req.facultyUser.name}:`, stats);
    
//     return res.status(200).json(stats);
    
//   } catch (error) {
//     console.error('❌ Fetch stats error:', error.message);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get all available projects (for students to view)
// router.get('/available', async (req, res) => {
//   console.log('📥 /available route hit');
//   try {
//     const projects = await Project.find({ 
//       status: 'available' 
//     }).sort({ submissionDate: -1 });
    
//     console.log(`✅ Found ${projects.length} available projects`);
    
//     return res.status(200).json(projects);
    
//   } catch (error) {
//     console.error('❌ Fetch available projects error:', error.message);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });
// module.exports=router

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Project = require('../models/Project');

// GET: Fetch all projects for the logged-in faculty
router.get('/my-projects', authenticateToken, async (req, res) => {
  try {
    const projects = await FacultyProject.find({ facultyId: req.facultyUser.id });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// POST: Add new project
router.post('/add', authenticateToken, async (req, res) => {
  const { title, description, domain, skills, deadline, maxTeamSize } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and Description are required' });
  }

  try {
    const newProject = new Project({
      facultyId: req.facultyUser.id,
      title,
      description,
      domain,
      skills,
      deadline,
      maxTeamSize,
    });

    await newProject.save();
    res.status(201).json({ message: 'Project added successfully', project: newProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error adding project' });
  }
});

module.exports = router;
