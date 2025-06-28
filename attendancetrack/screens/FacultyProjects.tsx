

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = "https://anveshak-hx6p.onrender.com";

const FacultyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    skills: '',
    deadline: '',
    maxTeamSize: '4'
  });

  const navigation = useNavigation();
  const route = useRoute();

  const fetchProjects = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/projects/faculty/my-projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    const { title, description, domain, skills, deadline, maxTeamSize } = formData;

    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Title and Description are required");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/projects/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          domain,
          skills: skills.split(',').map(s => s.trim()),
          deadline,
          maxTeamSize: parseInt(maxTeamSize) || 4
        })
      });

      if (response.ok) {
        Alert.alert("Success", "Project added");
        setShowAddModal(false);
        setFormData({
          title: '',
          description: '',
          domain: '',
          skills: '',
          deadline: '',
          maxTeamSize: '4'
        });
        fetchProjects();
      } else {
        Alert.alert("Error", "Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project", error);
    }
  };

  // const getAuthToken = () => {
  //   return 'shhh'; // Replace with secure token handling
  // };

  useEffect(() => {
    fetchProjects();
  }, []);

  const renderProject = ({ item }) => (
    <View style={styles.projectCard}>
      <Text style={styles.projectTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Skills: {item.skills?.join(', ')}</Text>
      <Text>Domain: {item.domain}</Text>
      <Text>Deadline: {item.deadline}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#007AFF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Faculty Projects</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Icon name="add-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id}
          renderItem={renderProject}
          ListEmptyComponent={<Text style={styles.emptyText}>No projects found</Text>}
        />
      )}

      {/* Modal */}
      <Modal visible={showAddModal} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Project</Text>
          {['title', 'description', 'domain', 'skills', 'deadline', 'maxTeamSize'].map((field, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={field}
              value={formData[field]}
              onChangeText={(text) => setFormData({ ...formData, [field]: text })}
              keyboardType={field === 'maxTeamSize' ? 'numeric' : 'default'}
            />
          ))}
          <TouchableOpacity style={styles.button} onPress={handleAddProject}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowAddModal(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#007AFF' },
  headerTitle: { color: '#FFF', fontSize: 20 },
  projectTitle: { color: '#FFF', fontSize: 20 },
  input: { margin: 10, padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 },
  button: { backgroundColor: '#007AFF', margin: 10, padding: 12, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff' },
  cancelText: { textAlign: 'center', color: 'red', marginTop: 10 },
  projectCard: { backgroundColor: '#FFF', margin: 10, padding: 15, borderRadius: 8 },
  modalContainer: { padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#777' }
});

export default FacultyProjects;


