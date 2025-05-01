import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const FacultyDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  // Sample faculty data - in a real app, would be fetched from API
  // or passed through route params
  const facultyData = route.params?.faculty || {
    id: '1',
    name: 'Dr. Priyanka Sharma',
    designation: 'Associate Professor',
    department: 'Computer Science',
    email: 'priyanka.sharma@kmit.edu',
    phone: '+91 98765 43210',
    qualification: 'Ph.D. in Computer Science',
    experience: '10 years',
    subjects: ['Data Structures', 'Database Management Systems', 'Machine Learning'],
    researchInterests: ['Artificial Intelligence', 'Data Mining', 'Cloud Computing'],
    officeHours: 'Mon-Fri: 2:00 PM - 4:00 PM',
    joinedYear: '2013'
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Faculty Details</Text>
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {/* Faculty Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <FontAwesome name="user-circle" size={80} color="#000" />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.facultyName}>{facultyData.name}</Text>
            <Text style={styles.designation}>{facultyData.designation}</Text>
            <Text style={styles.department}>{facultyData.department}</Text>
          </View>
        </View>
        
        {/* Contact Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.detailItem}>
            <Icon name="mail-outline" size={22} color="#000" style={styles.itemIcon} />
            <Text style={styles.itemText}>{facultyData.email}</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Linking.openURL(`mailto:${facultyData.email}`)}
            >
              <MaterialIcons name="email" size={22} color="#007AFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="call-outline" size={22} color="#000" style={styles.itemIcon} />
            <Text style={styles.itemText}>{facultyData.phone}</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Linking.openURL(`tel:${facultyData.phone.replace(/\s+/g, '')}`)}
            >
              <MaterialIcons name="phone" size={22} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Professional Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          
          <View style={styles.detailItem}>
            <Icon name="school-outline" size={22} color="#000" style={styles.itemIcon} />
            <Text style={styles.itemLabel}>Qualification:</Text>
            <Text style={styles.itemText}>{facultyData.qualification}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="time-outline" size={22} color="#000" style={styles.itemIcon} />
            <Text style={styles.itemLabel}>Experience:</Text>
            <Text style={styles.itemText}>{facultyData.experience}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={22} color="#000" style={styles.itemIcon} />
            <Text style={styles.itemLabel}>Joined Year:</Text>
            <Text style={styles.itemText}>{facultyData.joinedYear}</Text>
          </View>
        </View>
        
        {/* Subjects */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Subjects Handled</Text>
          
          {facultyData.subjects.map((subject, index) => (
            <View key={`subject-${index}`} style={styles.tagItem}>
              <Icon name="book-outline" size={18} color="#000" style={styles.tagIcon} />
              <Text style={styles.tagText}>{subject}</Text>
            </View>
          ))}
        </View>
        
        {/* Research Interests */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Research Interests</Text>
          
          {facultyData.researchInterests.map((interest, index) => (
            <View key={`research-${index}`} style={styles.tagItem}>
              <Icon name="flask-outline" size={18} color="#000" style={styles.tagIcon} />
              <Text style={styles.tagText}>{interest}</Text>
            </View>
          ))}
        </View>
        
        {/* Office Hours */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Office Hours</Text>
          
          <View style={styles.officeHoursContainer}>
            <Icon name="time-outline" size={22} color="#000" style={styles.officeHoursIcon} />
            <Text style={styles.officeHoursText}>{facultyData.officeHours}</Text>
          </View>
        </View>
        
        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButtonLarge}>
            <Icon name="calendar-outline" size={24} color="white" />
            <Text style={styles.actionButtonText}>Schedule Meeting</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButtonLarge}>
            <Icon name="mail-outline" size={24} color="white" />
            <Text style={styles.actionButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileImageContainer: {
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  facultyName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  designation: {
    fontSize: 16,
    color: '#555',
    marginTop: 3,
  },
  department: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemIcon: {
    marginRight: 10,
    width: 25,
  },
  itemLabel: {
    fontWeight: '500',
    marginRight: 5,
    width: 100,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  actionButton: {
    padding: 5,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  tagIcon: {
    marginRight: 5,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  officeHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
  },
  officeHoursIcon: {
    marginRight: 10,
  },
  officeHoursText: {
    fontSize: 15,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButtonLarge: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 15,
    flex: 0.48,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default FacultyDetailsScreen;