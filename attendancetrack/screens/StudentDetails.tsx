// Admin -> Student Details
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';

const StudentDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNumber: '',
    class: '',
    clubs: ''
  });
  const [editStudent, setEditStudent] = useState({
    name: '',
    rollNumber: '',
    class: '',
    clubs: ''
  });

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

  const handleAddStudent = () => {
    if (!newStudent.name.trim() || !newStudent.rollNumber.trim() || !newStudent.class.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Roll Number, Class)');
      return;
    }

    // Check if roll number already exists
    const rollExists = students.some(student => student.rollNumber === newStudent.rollNumber.trim());
    if (rollExists) {
      Alert.alert('Error', 'A student with this roll number already exists');
      return;
    }

    const newId = (students.length + 1).toString();
    const studentToAdd = {
      id: newId,
      name: newStudent.name.trim(),
      rollNumber: newStudent.rollNumber.trim(),
      class: newStudent.class.trim(),
      clubs: newStudent.clubs.trim() || 'None'
    };

    setStudents([...students, studentToAdd]);
    setNewStudent({ name: '', rollNumber: '', class: '', clubs: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Student added successfully!');
  };

  const handleCancel = () => {
    setNewStudent({ name: '', rollNumber: '', class: '', clubs: '' });
    setShowAddModal(false);
  };

  const handleCardPress = (studentId) => {
    setExpandedCard(expandedCard === studentId ? null : studentId);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditStudent({
      name: student.name,
      rollNumber: student.rollNumber,
      class: student.class,
      clubs: student.clubs
    });
    setShowEditModal(true);
    setExpandedCard(null);
  };

  const handleDelete = (studentId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setStudents(students.filter(student => student.id !== studentId));
            setExpandedCard(null);
            Alert.alert('Success', 'Student deleted successfully!');
          }
        }
      ]
    );
  };

  const handleUpdateStudent = () => {
    if (!editStudent.name.trim() || !editStudent.rollNumber.trim() || !editStudent.class.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Roll Number, Class)');
      return;
    }

    // Check if roll number already exists (excluding current student)
    const rollExists = students.some(student => 
      student.rollNumber === editStudent.rollNumber.trim() && student.id !== selectedStudent.id
    );
    if (rollExists) {
      Alert.alert('Error', 'A student with this roll number already exists');
      return;
    }

    const updatedStudentList = students.map(student =>
      student.id === selectedStudent.id
        ? {
            ...student,
            name: editStudent.name.trim(),
            rollNumber: editStudent.rollNumber.trim(),
            class: editStudent.class.trim(),
            clubs: editStudent.clubs.trim() || 'None'
          }
        : student
    );

    setStudents(updatedStudentList);
    setShowEditModal(false);
    setSelectedStudent(null);
    setEditStudent({ name: '', rollNumber: '', class: '', clubs: '' });
    Alert.alert('Success', 'Student updated successfully!');
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setSelectedStudent(null);
    setEditStudent({ name: '', rollNumber: '', class: '', clubs: '' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Details</Text>
      
      <View style={styles.headerRow}>
        <TextInput
          style={[styles.searchInput, { flex: 1, marginRight: 10 }]}
          placeholder="Search Student"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>Add Student</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.studentCard}
            onPress={() => handleCardPress(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.studentText}><Text style={styles.label}>Name:</Text> {item.name}</Text>
            <Text style={styles.studentText}><Text style={styles.label}>Roll No:</Text> {item.rollNumber}</Text>
            <Text style={styles.studentText}><Text style={styles.label}>Class:</Text> {item.class}</Text>
            <Text style={styles.studentText}><Text style={styles.label}>Clubs:</Text> {item.clubs}</Text>
            
            {expandedCard === item.id && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Add Student Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Student</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Student Name *"
              value={newStudent.name}
              onChangeText={(text) => setNewStudent({...newStudent, name: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Roll Number *"
              value={newStudent.rollNumber}
              onChangeText={(text) => setNewStudent({...newStudent, rollNumber: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Class *"
              value={newStudent.class}
              onChangeText={(text) => setNewStudent({...newStudent, class: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Clubs (Optional)"
              value={newStudent.clubs}
              onChangeText={(text) => setNewStudent({...newStudent, clubs: text})}
            />
            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAddStudent}
              >
                <Text style={styles.submitButtonText}>Add Student</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleEditCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Student</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Student Name *"
              value={editStudent.name}
              onChangeText={(text) => setEditStudent({...editStudent, name: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Roll Number *"
              value={editStudent.rollNumber}
              onChangeText={(text) => setEditStudent({...editStudent, rollNumber: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Class *"
              value={editStudent.class}
              onChangeText={(text) => setEditStudent({...editStudent, class: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Clubs (Optional)"
              value={editStudent.clubs}
              onChangeText={(text) => setEditStudent({...editStudent, clubs: text})}
            />
            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleEditCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleUpdateStudent}
              >
                <Text style={styles.submitButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
  studentText: { 
    fontSize: 16, 
    marginBottom: 5 
  },
  label: { 
    fontWeight: 'bold', 
    color: '#333' 
  },
  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 80,
  },
  editButton: {
    backgroundColor: '#17a2b8',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default StudentDetails;