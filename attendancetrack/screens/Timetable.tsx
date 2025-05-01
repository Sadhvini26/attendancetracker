import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const timetableData = [
  { id: 1, day: 'Monday', classes: [
    { time: '9:00 - 10:30', subject: 'Data Structures', room: 'Room 301', section: 'CSE-A' },
    { time: '10:45 - 12:15', subject: 'Algorithms', room: 'Room 302', section: 'CSE-B' },
    { time: '1:30 - 3:00', subject: 'Programming Lab', room: 'Lab 103', section: 'CSE-C' }
  ]},
  { id: 2, day: 'Tuesday', classes: [
    { time: '9:00 - 10:30', subject: 'Database Systems', room: 'Room 303', section: 'CSE-D' },
    { time: '10:45 - 12:15', subject: 'Web Development', room: 'Lab 104', section: 'CSE-A' }
  ]},
  { id: 3, day: 'Wednesday', classes: [
    { time: '9:00 - 10:30', subject: 'Operating Systems', room: 'Room 305', section: 'CSE-B' },
    { time: '10:45 - 12:15', subject: 'Computer Networks', room: 'Room 306', section: 'CSE-C' },
    { time: '1:30 - 3:00', subject: 'Programming Lab', room: 'Lab 103', section: 'CSE-D' }
  ]},
  { id: 4, day: 'Thursday', classes: [
    { time: '9:00 - 10:30', subject: 'Software Engineering', room: 'Room 307', section: 'CSE-A' },
    { time: '10:45 - 12:15', subject: 'AI Foundations', room: 'Room 308', section: 'CSE-B' }
  ]},
  { id: 5, day: 'Friday', classes: [
    { time: '9:00 - 10:30', subject: 'Mobile App Development', room: 'Lab 105', section: 'CSE-C' },
    { time: '10:45 - 12:15', subject: 'Cloud Computing', room: 'Room 309', section: 'CSE-D' },
    { time: '1:30 - 3:00', subject: 'Project Mentoring', room: 'Conference Room', section: 'All Sections' }
  ]}
];

// Current day statistics
const todayStats = {
  day: 'Wednesday',
  classes: 3,
  present: 42,
  absent: 5,
  attendancePercentage: 89
};
const renderTimetableItem = ({ item }) => (
    <View style={styles.dayContainer}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayText}>{item.day}</Text>
        <Text style={styles.classCountText}>{item.classes.length} Classes</Text>
      </View>
      {item.classes.map((classItem, index) => (
        <View key={index} style={styles.classItem}>
          <View style={styles.timeContainer}>
            <FontAwesome5 name="clock" size={14} color="#007AFF" />
            <Text style={styles.timeText}>{classItem.time}</Text>
          </View>
          <View style={styles.classContent}>
            <Text style={styles.subjectText}>{classItem.subject}</Text>
            <View style={styles.classDetails}>
              <View style={styles.detailItem}>
                <FontAwesome5 name="map-marker-alt" size={12} color="#666" />
                <Text style={styles.detailText}>{classItem.room}</Text>
              </View>
              <View style={styles.detailItem}>
                <FontAwesome5 name="users" size={12} color="#666" />
                <Text style={styles.detailText}>{classItem.section}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
  const Timetable = () => {
    return (
      <>
        <View style={styles.timetableHeader}>
          <Text style={styles.timetableHeaderText}>Faculty Timetable</Text>
        </View>
        <FlatList
          data={timetableData}
          renderItem={renderTimetableItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.contentContainer}
        />
      </>
    );
  };
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    paddingBottom: 10,
    elevation: 4,
  },
  facultyInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  facultyNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  todaySummary: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  todayTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 5,
    paddingTop: 5,
  },
  quickActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  quickActionText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5,
  },
  contentContainer: {
    padding: 15,
  },
  permissionsContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  permissionsList: {
    paddingBottom: 20,
  },
  dashboardContent: {
    flex: 1,
  },
  menuGrid: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 30,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '48%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  // Time Table Styles
  dayContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  classCountText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  classItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  classContent: {
    flex: 1,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  classDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  // Permission Styles
  permissionItem: {
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pendingItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  approvedItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  rejectedItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  permissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  permissionName: {
    fontSize: 15,
    fontWeight: '600',
  },
  permissionDate: {
    fontSize: 12,
    color: '#666',
  },
  permissionReason: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  approveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 13,
    marginLeft: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 5,
  },
  approvedText: {
    color: '#28a745',
  },
  rejectedText: {
    color: '#dc3545',
  },
  timetableHeader: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
  },
  timetableHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default Timetable;