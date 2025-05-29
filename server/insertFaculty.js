const mongoose = require('mongoose');
const User = require('./models/User');

async function insertFaculty() {
  try {
    await mongoose.connect('mongodb+srv://sadhvinipagidimarri99:sadhvini99@attendancecluster.m5bdxun.mongodb.net/?retryWrites=true&w=majority&appName=AttendanceCluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const faculty = new User({
      username: 'faculty',
      password: 'faculty',  // Remember to hash in real apps
      role: 'faculty',
      name: 'Prof. Michael Chen'
    });

    await faculty.save();
    console.log('Faculty inserted:', faculty);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting faculty:', error);
  }
}

insertFaculty();
