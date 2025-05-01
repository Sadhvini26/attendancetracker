const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects')); // Add this line

// Test route
app.get('/', (req, res) => {
  res.send('Attendance Tracking API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});