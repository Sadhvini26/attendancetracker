import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  FlatList,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const DisciplinaryPoints = () => {
  const navigation = useNavigation();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulating API fetch
    const mockStudents = [
      { id: '1', name: 'Sadhvini', rollNumber: '23BD1A0558', branch: 'CSE', points: 0 },
      { id: '2', name: 'Varshini', rollNumber: '23BD1A05K6', branch: 'CSE', points: 2 },
      { id: '3', name: 'Bhargavi', rollNumber: '23BD1A055Z', branch: 'CSE', points: 5 },
      { id: '4', name: 'Nandini', rollNumber: '24BD5A0519', branch: 'CSE', points: 1 },
      { id: '5', name: 'Pranavi', rollNumber: '24BD5A0520', branch: 'CSE', points: 3 },
      
    ];
    
    setStudents(mockStudents);
  }, []);

  const searchStudent = () => {
    setIsSearching(true);
  };

  const filteredStudents = isSearching ? 
    students.filter(student => {
      const searchLower = searchQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(searchLower) ||
        student.rollNumber.toLowerCase().includes(searchLower) ||
        student.branch.toLowerCase().includes(searchLower)
      );
    }) : students;

  const openModal = (student) => {
    setSelectedStudent(student);
    setPoints(student.points.toString());
    setModalVisible(true);
  };

  const updatePoints = () => {
    if (!points || !reason) {
      Alert.alert('Error', 'Please enter both points and reason');
      return;
    }

    const pointsValue = parseInt(points);
    if (isNaN(pointsValue)) {
      Alert.alert('Error', 'Points must be a number');
      return;
    }

    // Update the student's points
    const updatedStudents = students.map(student => {
      if (student.id === selectedStudent.id) {
        return { ...student, points: pointsValue };
      }
      return student;
    });

    setStudents(updatedStudents);
    
    // In a real app, you would send this update to your backend
    Alert.alert(
      'Success', 
      `Disciplinary points for ${selectedStudent.name} (${selectedStudent.rollNumber}) updated to ${pointsValue}`,
      [{ text: 'OK', onPress: () => setModalVisible(false) }]
    );
    
    // Reset form
    setReason('');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.studentItem}
      onPress={() => openModal(item)}
    >
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetails}>
          <Text style={styles.rollNumberText}>Roll No: {item.rollNumber}</Text> | {item.branch}
        </Text>
      </View>
      <View style={[
        styles.pointsContainer, 
        { backgroundColor: getPointsColor(item.points) }
      ]}>
        <Text style={styles.pointsText}>{item.points}</Text>
      </View>
    </TouchableOpacity>
  );

  const getPointsColor = (points) => {
    if (points === 0) return '#4CAF50'; // Green
    if (points <= 3) return '#FFC107'; // Yellow
    return '#F44336'; // Red
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
        <Text style={styles.headerTitle}>Disciplinary Points</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by roll number"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={searchStudent}
        />
        {searchQuery ? (
          <TouchableOpacity 
            onPress={() => {
              setSearchQuery('');
              setIsSearching(false);
            }}
          >
            <Icon name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={searchStudent}
            style={styles.searchButton}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Search Tip */}
      <View style={styles.searchTipContainer}>
        <Icon name="information-circle-outline" size={16} color="#666" />
        <Text style={styles.searchTipText}>
          Search by roll number and tap on a student to update disciplinary points
        </Text>
      </View>
      
      {/* Students List */}
      <FlatList
        data={filteredStudents}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isSearching 
                ? `No students found with roll number: ${searchQuery}` 
                : 'No students found'}
            </Text>
          </View>
        }
      />
      
      {/* Edit Points Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Disciplinary Points</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            
            {selectedStudent && (
              <View style={styles.modalContent}>
                <Text style={styles.studentModalName}>{selectedStudent.name}</Text>
                <Text style={styles.studentModalDetails}>
                  <Text style={styles.rollNumberText}>Roll No: {selectedStudent.rollNumber}</Text> | {selectedStudent.branch}
                </Text>
                <View style={styles.currentPointsContainer}>
                  <Text style={styles.currentPointsLabel}>Current Points:</Text>
                  <View style={[
                    styles.currentPointsBadge,
                    { backgroundColor: getPointsColor(selectedStudent.points) }
                  ]}>
                    <Text style={styles.currentPointsValue}>{selectedStudent.points}</Text>
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>New Points:</Text>
                  <TextInput
                    style={styles.pointsInput}
                    value={points}
                    onChangeText={setPoints}
                    keyboardType="numeric"
                    placeholder="Enter new points value"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Reason for Change:</Text>
                  <TextInput
                    style={styles.reasonInput}
                    value={reason}
                    onChangeText={setReason}
                    placeholder="Enter reason for updating disciplinary points"
                    multiline
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.updateButton}
                  onPress={updatePoints}
                >
                  <Text style={styles.updateButtonText}>Update Points</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
  },
  searchButton: {
    backgroundColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  searchTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 15,
  },
  searchTipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  studentItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentDetails: {
    color: '#666',
    marginTop: 5,
  },
  rollNumberText: {
    fontWeight: '500',
  },
  pointsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 15,
  },
  studentModalName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentModalDetails: {
    color: '#666',
    marginTop: 5,
  },
  currentPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  currentPointsLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  currentPointsBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPointsValue: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  pointsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DisciplinaryPoints;