const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true
  }
});

const attendanceSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  facultyName: {
    type: String,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  time: {
    type: String, // HH:MM format
    required: true
  },
  attendanceRecords: [attendanceRecordSchema],
  summary: {
    totalStudents: {
      type: Number,
      required: true
    },
    presentCount: {
      type: Number,
      required: true
    },
    absentCount: {
      type: Number,
      required: true
    },
    presentPercentage: {
      type: Number,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
attendanceSchema.index({ facultyId: 1, date: 1 });
attendanceSchema.index({ date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);