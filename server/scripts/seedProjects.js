// scripts/seedProjects.js
require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');

const seedProjects = [
  {
    title: "AI-Powered Attendance System",
    description: "Develop a facial recognition system using machine learning to automate student attendance tracking in classrooms. The system should be able to identify students, mark attendance, and generate reports.",
    domain: "AI/ML",
    skills: ["Python", "TensorFlow", "OpenCV", "React Native"],
    mentor: "Dr. Sarah Johnson",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    maxTeamSize: 4
  },
  {
    title: "Smart Campus Navigation App",
    description: "Create a mobile application that helps students navigate the campus efficiently. Features should include indoor mapping, shortest path finding, classroom schedules, and points of interest.",
    domain: "Mobile App",
    skills: ["React Native", "Firebase", "GPS", "UI/UX Design"],
    mentor: "Prof. Michael Chen",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    maxTeamSize: 3
  },
  {
    title: "Student Performance Analytics Dashboard",
    description: "Build an analytics platform that visualizes student performance data across various subjects and semesters. The dashboard should provide insights to both students and faculty to improve academic outcomes.",
    domain: "Data Analytics",
    skills: ["JavaScript", "React", "Node.js", "D3.js", "MongoDB"],
    mentor: "Dr. Emily Rivera",
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    maxTeamSize: 4
  },
  {
    title: "IoT-based Smart Classroom System",
    description: "Develop a system that utilizes IoT devices to create a smart classroom environment. Features may include automated lighting, temperature control, attendance tracking, and energy efficiency monitoring.",
    domain: "IoT",
    skills: ["Arduino", "Raspberry Pi", "Python", "MQTT", "Embedded Systems"],
    mentor: "Prof. David Wilson",
    deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), // 75 days from now
    maxTeamSize: 4
  },
  {
    title: "Campus Event Management Platform",
    description: "Create a comprehensive web and mobile platform for managing campus events, including event creation, registration, ticketing, attendance tracking, and feedback collection.",
    domain: "Web Development",
    skills: ["React", "Node.js", "MongoDB", "JWT", "Express"],
    mentor: "Prof. Jennifer Lee",
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
    maxTeamSize: 3
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Add new projects
    const createdProjects = await Project.insertMany(seedProjects);
    console.log(`Added ${createdProjects.length} projects`);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();