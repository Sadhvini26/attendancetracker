const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  teamLeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamLeadName: String,
  teamLeadRollNo: String,
  teamLeadPhone: String,
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rollNo: {
        type: String,
        required: true
      },
      name: String,
      branch: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', TeamSchema);