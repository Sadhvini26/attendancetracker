// Admin -> Faculty Details
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';

const FacultyDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const facultyList = [
    { id: '1', name: 'Mr. Rajesh Kumar', department: 'Computer Science', designation: 'Professor' },
    { id: '2', name: 'Ms. Ananya Sharma', department: 'Mathematics', designation: 'Assistant Professor' },
    { id: '3', name: 'Dr. Sameer Reddy', department: 'Physics', designation: 'Associate Professor' },
    { id: '4', name: 'Mr. Ajay Reddy', department: 'Computer Science', designation: 'Associate Professor' },
    { id: '5', name: 'Dr. Sameera', department: 'Physics', designation: 'Associate Professor' },
    { id: '6', name: 'Ms. Seshilekha', department: 'Mathematics', designation: 'Associate Professor' },
    { id: '7', name: 'Dr. Sanjay Reddy', department: 'Computer Science', designation: 'Professor' },
    { id: '8', name: 'Dr. Ajay Kumar', department: 'Physics', designation: 'Professor' },
  ];

  const filteredFaculty = facultyList.filter(faculty =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faculty.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Faculty Details</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Faculty"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <FlatList
        data={filteredFaculty}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>Department: {item.department}</Text>
            <Text style={styles.detail}>Designation: {item.designation}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 30,
    marginBottom: 10, 
    textAlign: 'center' 
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
});

export default FacultyDetails;
