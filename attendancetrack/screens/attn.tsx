// Student -> Attendance
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AttendanceScreen = ({route}) => {
  const { student } = route.params || {};
  const attendanceData = [
    { date: 'Fri 21 Mar', status: ['✅', '✅', '✅', '✅', '✅', '✅'] },
    { date: 'Thu 20 Mar', status: ['✅', '❌', '❌', '✅', '✅', '✅'] },
    { date: 'Wed 19 Mar', status: ['✅', '✅', '✅', '✅', '✅', '✅'] },
    { date: 'Tue 18 Mar', status: ['❌', '❌', '❌', '✅', '✅', '❌'] },
    { date: 'Mon 17 Mar', status: ['✅', '✅', '✅', '✅', '✅', '❌'] },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Icon name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>ATTENDANCE</Text>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchText}>Search</Text>
        <FontAwesome name="search" size={18} color="gray" />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
    <FontAwesome name="user" size={50} color="black" />
    <Text style={styles.profileText}>
      {student?.name || 'NAME'}{'\n'}
      {student?.username || 'ROLL.NO'}{'\n'}
      {student?.operationalSection || 'SECTION'}
    </Text>
  </View>
      {/* Attendance Progress */}
      <View style={styles.progressCircle}>
        <Text style={styles.progressText}>75.85%</Text>
      </View>

      {/* Attendance Records */}
      <ScrollView style={styles.attendanceList}>
        {attendanceData.map((item, index) => (
          <View key={index} style={styles.attendanceItem}>
            <Text style={styles.dateText}>{item.date}</Text>
            <View style={styles.statusContainer}>
              {item.status.map((status, idx) => (
                <Text key={idx} style={status === '✔️' ? styles.present : styles.absent}>
                  {status}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  searchText: {
    color: 'gray',
  },
  profileCard: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  profileText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5,
  },
  progressCircle: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 7,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  attendanceList: {
    flex: 1,
  },
  attendanceItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
  },
  present: {
    color: 'green',
    marginRight: 5,
  },
  absent: {
    color: 'red',
    marginRight: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
  },
});

export default AttendanceScreen;
