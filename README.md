# KMIT Anvesha - Attendance Tracker

A comprehensive college management application designed for students, faculty, and administrators at KMIT. The application provides role-based authentication and specialized features for each user type.

## Features

### Authentication System
- **Role-based authentication** with three user types:
  - Student Login
  - Faculty Login
  - Admin Login
- Secure password-based navigation to respective dashboards

### Student Features
- **Dashboard** with college-uploaded opportunities
- **Project** registration for 2nd years
  - Team formation (5 members max)
  - First-come-first-serve project selection
  - Maximum 10 teams per project
- **Workshop Registration** for individual participation
- **Internship Portal** exclusively for 3rd and 4th years

### Faculty Features
- **Dashboard** with comprehensive class management
- **Student Details Management**
  - View assigned project teams
  - Access individual student information
- **Attendance System**
  - Date and time-specific attendance marking
  - Visual student identification by roll number
  - Bulk attendance operations (Mark All Present/Absent)
  - **Automatic Excel sheet generation** for attendance records
- **Performance Tracking**
  - Disciplinary points management
  - Permission handling system

### Admin Features
- **Complete System Access** to all student and faculty information
- **Notice Board Management**
  - Post important announcements via Notice Board
- **Academic Management**
  - Syllabus updates
  - Exam date notifications
  - Student and faculty tracking

## Technology Stack

- **Frontend**: React Native
- **Backend**: Node.js
- **Database**: MongoDB
- **Mobile**: Expo (React Native)

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Expo CLI (for mobile development)

## Installation & Setup

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd kmit-anvesha
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Start the backend server:
```bash
node index.js
```

### Frontend Setup (Web)

1. Open a new terminal and navigate to the frontend directory:
```bash
cd attendancetrack
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the React application:
```bash
npm start
```

### Mobile App Setup (Expo)

1. Create a new Expo app:
```bash
npx create-expo-app@latest
```

2. Enter your app name when prompted

3. Navigate to your app directory:
```bash
cd <your-app-name>
```

4. Start the Expo development server:
```bash
npx expo start
```

5. Download the Expo app on your mobile device to view the application

## Application Structure

### Page Navigation Flow

1. **Landing Page**: Logo, KMIT Anvesha branding, Sign In button, Remember Me option
2. **Sign In Page**: Username/Password authentication with role-based redirection
3. **Student Dashboard**: Project opportunities, workshops, and internship portals
4. **Faculty Dashboard**: Class management, attendance system, student tracking
5. **Admin Dashboard**: System-wide management and notice board

### Key Functionalities

#### RTRP Project Management
- Team registration with 5-member limit
- Project selection with capacity constraints
- Automatic faculty assignment based on project selection

#### Attendance System
- Time-slot based attendance marking
- Automated Excel report generation

#### Communication System
- Admin-managed notice board
- Thread-based announcements
- System-wide notifications

## Configuration

Ensure your MongoDB connection is properly configured in the backend. Update the database connection string in your server configuration file.

## Database Schema

The application uses MongoDB with collections for:
- Users (Students, Faculty, Admin)
- Projects and Teams
- Attendance Records
- Announcements
- Internship Opportunities

## Team

Developed for KMIT College Management System


---

**Note**: Make sure to configure your environment variables and database connections before running the application in production.
