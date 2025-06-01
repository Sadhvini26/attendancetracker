// Admin -> Faculty Details
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';

const FacultyDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    department: '',
    designation: ''
  });
  const [editFaculty, setEditFaculty] = useState({
    name: '',
    department: '',
    designation: ''
  });
  
  const [facultyList, setFacultyList] = useState([
    { id: '1', name: 'Mr. Rajesh Kumar', department: 'Computer Science', designation: 'Professor' },
    { id: '2', name: 'Ms. Ananya Sharma', department: 'Mathematics', designation: 'Assistant Professor' },
    { id: '3', name: 'Dr. Sameer Reddy', department: 'Physics', designation: 'Associate Professor' },
    { id: '4', name: 'Mr. Ajay Reddy', department: 'Computer Science', designation: 'Associate Professor' },
    { id: '5', name: 'Dr. Sameera', department: 'Physics', designation: 'Associate Professor' },
    { id: '6', name: 'Ms. Seshilekha', department: 'Mathematics', designation: 'Associate Professor' },
    { id: '7', name: 'Dr. Sanjay Reddy', department: 'Computer Science', designation: 'Professor' },
    { id: '8', name: 'Dr. Ajay Kumar', department: 'Physics', designation: 'Professor' },
  ]);

  const filteredFaculty = facultyList.filter(faculty =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faculty.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFaculty = () => {
    if (!newFaculty.name.trim() || !newFaculty.department.trim() || !newFaculty.designation.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newId = (facultyList.length + 1).toString();
    const facultyToAdd = {
      id: newId,
      name: newFaculty.name.trim(),
      department: newFaculty.department.trim(),
      designation: newFaculty.designation.trim()
    };

    setFacultyList([...facultyList, facultyToAdd]);
    setNewFaculty({ name: '', department: '', designation: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Faculty member added successfully!');
  };

  const handleCancel = () => {
    setNewFaculty({ name: '', department: '', designation: '' });
    setShowAddModal(false);
  };

  const handleCardPress = (facultyId) => {
    setExpandedCard(expandedCard === facultyId ? null : facultyId);
  };

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setEditFaculty({
      name: faculty.name,
      department: faculty.department,
      designation: faculty.designation
    });
    setShowEditModal(true);
    setExpandedCard(null);
  };

  const handleDelete = (facultyId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this faculty member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setFacultyList(facultyList.filter(faculty => faculty.id !== facultyId));
            setExpandedCard(null);
            Alert.alert('Success', 'Faculty member deleted successfully!');
          }
        }
      ]
    );
  };

  const handleUpdateFaculty = () => {
    if (!editFaculty.name.trim() || !editFaculty.department.trim() || !editFaculty.designation.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const updatedFacultyList = facultyList.map(faculty =>
      faculty.id === selectedFaculty.id
        ? {
            ...faculty,
            name: editFaculty.name.trim(),
            department: editFaculty.department.trim(),
            designation: editFaculty.designation.trim()
          }
        : faculty
    );

    setFacultyList(updatedFacultyList);
    setShowEditModal(false);
    setSelectedFaculty(null);
    setEditFaculty({ name: '', department: '', designation: '' });
    Alert.alert('Success', 'Faculty member updated successfully!');
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setSelectedFaculty(null);
    setEditFaculty({ name: '', department: '', designation: '' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faculty Details</Text>
      
      <View style={styles.headerRow}>
        <TextInput
          style={[styles.searchInput, { flex: 1, marginRight: 10 }]}
          placeholder="Search Faculty"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>Add Faculty</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredFaculty}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleCardPress(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>Department: {item.department}</Text>
            <Text style={styles.detail}>Designation: {item.designation}</Text>
            
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

      {/* Add Faculty Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Faculty</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Faculty Name"
              value={newFaculty.name}
              onChangeText={(text) => setNewFaculty({...newFaculty, name: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Department"
              value={newFaculty.department}
              onChangeText={(text) => setNewFaculty({...newFaculty, department: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Designation"
              value={newFaculty.designation}
              onChangeText={(text) => setNewFaculty({...newFaculty, designation: text})}
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
                onPress={handleAddFaculty}
              >
                <Text style={styles.submitButtonText}>Add Faculty</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Faculty Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleEditCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Faculty</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Faculty Name"
              value={editFaculty.name}
              onChangeText={(text) => setEditFaculty({...editFaculty, name: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Department"
              value={editFaculty.department}
              onChangeText={(text) => setEditFaculty({...editFaculty, department: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Designation"
              value={editFaculty.designation}
              onChangeText={(text) => setEditFaculty({...editFaculty, designation: text})}
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
                onPress={handleUpdateFaculty}
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
    backgroundColor: '#f8f8f8',
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
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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
});

export default FacultyDetails;