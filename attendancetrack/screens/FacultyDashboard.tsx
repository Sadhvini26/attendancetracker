// FacultyDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import {DisciplinaryPoints} from './DisciplinaryPoints'
// Define navigation types
type RootStackParamList = {
  SignIn: undefined;
  FacultyDashboard: { faculty: Faculty };
  NoticeBoard: undefined;
  StudentDetails: undefined;
  TakeAttendance: undefined;
  Timetable: undefined;
  DisciplinaryPoints: undefined;
  FacultyPermissions: undefined;
  // Add other screens as needed
};

type Faculty = {
  name: string;
  id?: string;
  // Add other faculty properties as needed
};

type FacultyDashboardRouteProp = RouteProp<RootStackParamList, 'FacultyDashboard'>;
type FacultyDashboardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FacultyDashboard = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation<FacultyDashboardNavigationProp>();
  const route = useRoute<FacultyDashboardRouteProp>();
  
  // Get faculty data from route params, or use default if not available
  const faculty = route.params?.faculty || { name: 'FACULTY NAME' };

  // Simulating font loading
  useEffect(() => {
    // In a real implementation, you would load your custom fonts here
    const timer = setTimeout(() => {
      setFontsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* White card with faculty info and quick links */}
      <View style={styles.facultyCard}>
        <View style={styles.facultyInfoRow}>
          <View style={styles.facultyAvatarContainer}>
            <Icon name="person-outline" size={30} color="black" />
          </View>
          <Text style={styles.facultyNameText}>{faculty.name}</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        {/* Quick action buttons */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('FacultyPermissions')}
          >
            <FontAwesome name="file-text-o" size={24} color="black" />
            <Text style={styles.quickActionText}>Permissions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Timetable')}
          >
            <Icon name="time-outline" size={24} color="black" />
            <Text style={styles.quickActionText}>Time Table</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="settings-outline" size={24} color="black" />
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Welcome message */}
      <Text style={styles.welcomeText}>Welcome, {faculty.name}</Text>
      
      {/* Dashboard title */}
      <Text style={styles.dashboardTitle}>Dashboard</Text>
      
      {/* Main menu grid */}
      <View style={styles.menuGrid}>
        {/* Row 1 */}
        <View style={styles.menuRow}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('NB')}
          >
            <Icon name="chatbubble-ellipses-outline" size={28} color="black" />
            <Text style={styles.menuItemText}>Notice Board</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('SD')}
          >
            <Icon name="people-outline" size={28} color="black" />
            <Text style={styles.menuItemText}>Student Details</Text>
          </TouchableOpacity>
        </View>
        
        {/* Row 2 */}
        <View style={styles.menuRow}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('TakeAttendance')}
          >
            <MaterialCommunityIcons name="calendar-check-outline" size={28} color="black" />
            <Text style={styles.menuItemText}>Manage Attendance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('DisciplinaryPoints')}
          >
            <FontAwesome name="exclamation-circle" size={28} color="black" />
            <Text style={styles.menuItemText}>Disciplinary Points</Text>
          </TouchableOpacity>
        </View>
        
        {/* Row 3 */}
        <View style={styles.menuRow}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.replace('commonContact')}>
            <Feather name="phone" size={28} color="black" />
            <Text style={styles.menuItemText}>Contact KMIT</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.replace('SignIn')}
          >
            <Feather name="log-out" size={28} color="black" />
            <Text style={styles.menuItemText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  facultyCard: {
    paddingTop: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  facultyInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  facultyAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  facultyNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  notificationButton: {
    padding: 5,
  },
  welcomeText: {
    color: '#aaa',
    fontSize: 18,
    marginTop: 15,
    marginLeft: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
  },
  quickActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 20,
  },
  menuGrid: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '48%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default FacultyDashboard;