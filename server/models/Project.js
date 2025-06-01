const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    trim: true
  },
  skills: {
    type: [String],
    default: []
  },
  mentor: {
    type: String,
    trim: true
  },
  deadline: {
    type: Date
  },
  // maxTeamSize: {
  //   type: Number,
  //   default: 4
  // },
   maxTeamSize: {
    type: Number,
    default: 4
  },
  maxTeams: {
    type: Number,
    default: 5
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  teamMembers: [{
    name: {
      type: String,
      trim: true
    },
    rollNo: {
      type: String,
      trim: true
    }
  }],
  status: {
    type: String,
    enum: ['available', 'registered', 'completed', 'pending_approval'],
    default: 'available'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;