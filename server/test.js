// testProjects.js
const mongoose = require('mongoose');
const Project=require('./models/Project')
// Replace with your actual MongoDB Atlas connection string
const uri = 'mongodb+srv://sadhvinipagidimarri99:sadhvini99@attendancecluster.m5bdxun.mongodb.net/?retryWrites=true&w=majority&appName=AttendanceCluster';

// const ProjectSchema = new mongoose.Schema({
//   mentor: mongoose.Schema.Types.ObjectId,
//   teamMembers: [{ rollNumber: String }],
// });

// const Project = mongoose.model('Project', ProjectSchema);

async function test() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const facultyId = '683073450f108d2aa7be4be7'; // Replace with the faculty _id you want to test

const projects = await Project.find({ mentor: facultyId}).lean();
    console.log('Projects found:', projects);

    const allRolls = projects
  .flatMap(proj => proj.teamMembers || [])      // get all teamMembers from projects
  .map(member => member.rollNo)                  // extract `rollNo` (not `rollNumber`)
  .filter(Boolean);                              // filter out empty or null values


    console.log('All roll numbers:', allRolls);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
