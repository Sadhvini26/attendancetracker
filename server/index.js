const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const facultyRoutes =require('./routes/faculty')
const permissionRoutes = require("./routes/permissions");
// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects')); 
// const facultyRoutes = require('./routes/faculty');
// const attendanceRoutes = require('./routes/attendance');
const noticeRoutes = require('./routes/noticeRoutes');
app.use('/api/notices', noticeRoutes);
app.use("/api/permissions", permissionRoutes);
// app.use('/api/faculty-projects', facultyRoutes);
// app.use('/api/attendance', attendanceRoutes);
// Test route
app.get('/', (req, res) => {
  res.send('Attendance Tracking API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});