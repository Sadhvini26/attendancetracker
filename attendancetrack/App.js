// App.js - Main Navigation Configuration
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './screens/SignInScreen';
import StudentDashboard from './screens/StudentDashboard';
import FacultyDashboard from './screens/FacultyDashboard';
import AdminDashboard from './screens/AdminDashboard';
import NoticeBoard from './screens/NoticeBoard'; // Assuming you have this screen
import ProjectsScreen from './screens/ProjectsScreen';
import DisciplinaryPoints from './screens/DisciplinaryPoints';
import TakeAttendance from './screens/TakeAttendance';
import SD from './screens/SD';
import commonContact from './screens/commonContact';
import Permissions from './screens/Permissions';
import FacultyPermissions from './screens/FacultyPermissions';
import Timetable from './screens/Timetable';
import attn from './screens/attn'
import EditNoticeBoard from './screens/EditNoticeBoard';
import FacultyDetailsScreen from './screens/FacultyDetailsScreen';
import Internships from './screens/Internships'
import FD from './screens/FD'
import 'react-native-get-random-values';
import { Buffer } from 'react-native-blob-util';
global.Buffer = Buffer; // Polyfill Buffer for xlsx
// Create a navigation stack
const Stack = createNativeStackNavigator();

// Define RootStackParamList for TypeScript users (export in a separate types.js/.ts file)
// export type RootStackParamList = {
//   SignIn: undefined;
//   StudentDashboard: { student: any };
//   FacultyDashboard: { faculty: any };
//   AdminDashboard: { admin: any };
//   NB: undefined;
// };

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="FacultyDashboard" component={FacultyDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="DisciplinaryPoints" component={DisciplinaryPoints} />
        <Stack.Screen name="TakeAttendance" component={TakeAttendance} />
        <Stack.Screen name="Projects" component={ProjectsScreen} />
        <Stack.Screen name="NB" component={NoticeBoard} />
        <Stack.Screen name="EditNoticeBoard" component={EditNoticeBoard} />
        <Stack.Screen name="SD" component={SD} />
        <Stack.Screen name="commonContact" component={commonContact} />
        <Stack.Screen name="Permissions" component={Permissions} />
        <Stack.Screen name="Timetable" component={Timetable} />
        <Stack.Screen name="FacultyPermissions" component={FacultyPermissions} />
        <Stack.Screen name="FD" component={FD} />
        <Stack.Screen name="attn" component={attn} />
        <Stack.Screen name="Internships" component={Internships} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}