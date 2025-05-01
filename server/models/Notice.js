const mongoose = require('mongoose');
const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a notice title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide notice content'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'examination', 'events', 'placement', 'academic'],
    default: 'general'
  },
  targetAudience: {
    type: [String],
    enum: ['all', 'students', 'faculty', 'admin', '1stYear', '2ndYear', '3rdYear', '4thYear'],
    default: ['all']
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String
  }],
  isImportant: {
    type: Boolean,
    default: false
  },
  expiryDate: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // Default 30 days from now
  }
}, { timestamps: true });

// Create indexes for faster queries
NoticeSchema.index({ createdAt: -1 });
NoticeSchema.index({ category: 1 });
NoticeSchema.index({ targetAudience: 1 });

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;