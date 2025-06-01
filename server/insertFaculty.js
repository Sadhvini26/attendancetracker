// const mongoose = require('mongoose');
// const User = require('./models/User');

// async function insertFaculty() {
//   try {
//     await mongoose.connect('mongodb+srv://sadhvinipagidimarri99:sadhvini99@attendancecluster.m5bdxun.mongodb.net/?retryWrites=true&w=majority&appName=AttendanceCluster', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const faculty = new User({
//       username: 'faculty',
//       password: 'faculty',  // Remember to hash in real apps
//       role: 'faculty',
//       name: 'Prof. Michael Chen'
//     });

//     await faculty.save();
//     console.log('Faculty inserted:', faculty);
//     mongoose.disconnect();
//   } catch (error) {
//     console.error('Error inserting faculty:', error);
//   }
// }

// insertFaculty();
const mongoose = require('mongoose');
const User = require('./models/User');

async function insertFacultyUsers() {
  try {
    await mongoose.connect('mongodb+srv://sadhvinipagidimarri99:sadhvini99@attendancecluster.m5bdxun.mongodb.net/?retryWrites=true&w=majority&appName=AttendanceCluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const facultyList = [
      {
        username: 'sarah.johnson',
        password: 'faculty', // hash in real apps
        role: 'faculty',
        name: 'Dr. Sarah Johnson'
      },
      {
        username: 'michael.chen',
        password: 'faculty',
        role: 'faculty',
        name: 'Prof. Michael Chen'
      },
      {
        username: 'emily.rivera',
        password: 'faculty',
        role: 'faculty',
        name: 'Dr. Emily Rivera'
      },
      {
        username: 'david.wilson',
        password: 'faculty',
        role: 'faculty',
        name: 'Prof. David Wilson'
      },
      {
        username: 'jennifer.lee',
        password: 'faculty',
        role: 'faculty',
        name: 'Prof. Jennifer Lee'
      }
    ];

    const inserted = await User.insertMany(facultyList);
    console.log('Inserted faculty users:', inserted);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error inserting faculty users:', error);
  }
}

insertFacultyUsers();
