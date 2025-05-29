const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Attendance Schema
const AttendanceSchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  students: [{
    rollNo: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to prevent duplicate entries for same faculty and date
AttendanceSchema.index({ facultyId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', AttendanceSchema);

// Save attendance data
router.post('/save', auth, async (req, res) => {
  try {
    // Ensure the user is a faculty member
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied. Faculty role required.' });
    }

    const { facultyId, date, students } = req.body;

    // Validate required fields
    if (!facultyId || !date || !students || !Array.isArray(students)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate that the logged-in faculty is saving their own attendance
    if (req.user.username !== facultyId) {
      return res.status(403).json({ message: 'You can only save attendance for yourself' });
    }

    const attendanceDate = new Date(date);
    
    // Check if attendance for this date already exists
    const existingAttendance = await Attendance.findOne({
      facultyId: facultyId,
      date: {
        $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
        $lt: new Date(attendanceDate.setHours(23, 59, 59, 999))
      }
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.students = students;
      existingAttendance.updatedAt = new Date();
      await existingAttendance.save();
      
      res.json({ 
        message: 'Attendance updated successfully', 
        attendance: existingAttendance 
      });
    } else {
      // Create new attendance record
      const newAttendance = new Attendance({
        facultyId,
        date: attendanceDate,
        students
      });

      await newAttendance.save();
      
      res.status(201).json({ 
        message: 'Attendance saved successfully', 
        attendance: newAttendance 
      });
    }
  } catch (error) {
    console.error('Save attendance error:', error);
    
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: 'Attendance for this date already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Get attendance history for a faculty member
router.get('/history', auth, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied. Faculty role required.' });
    }

    const { startDate, endDate, limit = 50 } = req.query;
    
    let query = { facultyId: req.user.username };
    
    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendanceHistory = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(attendanceHistory);
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance for a specific date
router.get('/date/:date', auth, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied. Faculty role required.' });
    }

    const { date } = req.params;
    const targetDate = new Date(date);
    
    const attendance = await Attendance.findOne({
      facultyId: req.user.username,
      date: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999))
      }
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No attendance record found for this date' });
    }

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance by date error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;