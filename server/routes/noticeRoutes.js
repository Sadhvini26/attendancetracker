// routes/noticeRoutes.js - API routes for notice board
const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/public', async (req, res) => {
  try {
    // Get only important public notices for the login page
    const publicNotices = await Notice.find({
      targetAudience: 'all',
      isImportant: true,
      expiryDate: { $gte: new Date() }
    })
    .sort({ createdAt: -1 })
    .limit(5);

    res.status(200).json({
      success: true,
      notices: publicNotices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching public notices',
      error: error.message
    });
  }
});

// Protected routes - need authentication
router.get('/', protect, noticeController.getNotices);
router.get('/:id', protect, noticeController.getNoticeById);

// Admin only routes
router.post('/', protect, authorize('admin'), noticeController.createNotice);
router.put('/:id', protect, authorize('admin'), noticeController.updateNotice);
router.delete('/:id', protect, authorize('admin'), noticeController.deleteNotice);

module.exports = router;