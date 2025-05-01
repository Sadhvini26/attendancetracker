// controllers/noticeController.js - Functions to handle notice operations
const Notice = require('../models/Notice');
const User = require('../models/User');

// Get all notices (with filtering options)
exports.getNotices = async (req, res) => {
  try {
    const { category, audience, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (audience) {
      query.targetAudience = { $in: [audience, 'all'] };
    } else {
      // If no specific audience is provided, filter by user role
      const userRole = req.user.role;
      if (userRole === 'student') {
        const year = req.user.year || 'all';
        query.targetAudience = { 
          $in: ['all', 'students', year] 
        };
      } else if (userRole === 'faculty') {
        query.targetAudience = { 
          $in: ['all', 'faculty'] 
        };
      }
      // Admin can see all notices
    }
    
    // Check if notices are expired
    query.expiryDate = { $gte: new Date() };
    
    // Execute query with pagination
    const notices = await Notice.find(query)
      .sort({ isImportant: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name role');
      
    // Get total count for pagination
    const total = await Notice.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: notices.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      notices
    });
    
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notices',
      error: error.message
    });
  }
};

// Get a single notice by ID
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('createdBy', 'name role');
      
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }
    
    res.status(200).json({
      success: true,
      notice
    });
    
  } catch (error) {
    console.error('Error fetching notice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notice',
      error: error.message
    });
  }
};

// Create a new notice (admin only)
exports.createNotice = async (req, res) => {
  try {
    // Check if user has admin rights
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create notices'
      });
    }
    
    const { title, content, category, targetAudience, isImportant, expiryDate, attachments } = req.body;
    
    const notice = await Notice.create({
      title,
      content,
      category,
      targetAudience,
      isImportant,
      expiryDate,
      attachments,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      notice
    });
    
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notice',
      error: error.message
    });
  }
};

// Update a notice (admin only)
exports.updateNotice = async (req, res) => {
  try {
    // Check if user has admin rights
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can update notices'
      });
    }
    
    const { title, content, category, targetAudience, isImportant, expiryDate, attachments } = req.body;
    
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        targetAudience,
        isImportant,
        expiryDate,
        attachments
      },
      { new: true, runValidators: true }
    );
    
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      notice
    });
    
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notice',
      error: error.message
    });
  }
};

// Delete a notice (admin only)
exports.deleteNotice = async (req, res) => {
  try {
    // Check if user has admin rights
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete notices'
      });
    }
    
    const notice = await Notice.findByIdAndDelete(req.params.id);
    
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notice',
      error: error.message
    });
  }
};