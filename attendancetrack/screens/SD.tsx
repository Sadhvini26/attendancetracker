// Admin -> Student Details
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';

const StudentDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([
    { id: '1', name: 'Sri Bhargavi', rollNumber: '23BD1A055Z', class: 'PS23', clubs: 'None' },
    { id: '2', name: 'Sadhvini', rollNumber: '23BD1A0558', class: 'PS23', clubs: 'None' },
    { id: '3', name: 'Varshini', rollNumber: '23BD1A05K6', class: 'PS23', clubs: 'None' },
    { id: '4', name: 'Nandini', rollNumber: '24BD5A0519', class: 'PS23', clubs: 'None' },
    { id: '5', name: 'Pranavi', rollNumber: '24BD5A0520', class: 'PS23', clubs: 'None' },
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.includes(searchQuery) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.clubs.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <View style={styles.container}>
    <Text style={styles.title}>Student Details</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Student"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentCard}>
            <Text style={styles.studentText}><Text style={styles.label}>Name:</Text> {item.name}</Text>
            <Text style={styles.studentText}><Text style={styles.label}>Roll No:</Text> {item.rollNumber}</Text>
            <Text style={styles.studentText}><Text style={styles.label}>Class:</Text> {item.class}</Text>
            <Text style={styles.studentText}><Text style={styles.label}>Clubs:</Text> {item.clubs}</Text>
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
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 30,
    marginBottom: 10, 
    textAlign: 'center' 
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  studentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentText: { fontSize: 16, marginBottom: 5 },
  label: { fontWeight: 'bold', color: '#333' },
});

export default StudentDetails;
