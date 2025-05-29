import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL = 'http://192.168.231.239:3000'; // Update with your server IP
// const SERVER_URL = 'http://192.168.198.239:3000'; // Update with your server IP

const ProjectsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { student } = route.params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('ideas');
  
  // Custom project form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDomain, setProjectDomain] = useState('');
  const [projectSkills, setProjectSkills] = useState('');
  const [teamMembers, setTeamMembers] = useState([
    { name: student?.name || '', rollNo: student?.username || '' }
  ]);
  const [submitting, setSubmitting] = useState(false);
  
  // Project registration modal state
  const [selectedProject, setSelectedProject] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationTeamMembers, setRegistrationTeamMembers] = useState([
    { name: student?.name || '', rollNo: student?.username || '' }
  ]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'You are not logged in');
        navigation.replace('SignIn');
        return;
      }
      
      // Fetch project ideas
      const ideasResponse = await axios.get(
        `${SERVER_URL}/api/projects/ideas`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Fetch student's projects
      const myProjectsResponse = await axios.get(
        `${SERVER_URL}/api/projects/student/my-projects`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      console.log('My Projects Response:', myProjectsResponse.data);
      
      setProjectIdeas(ideasResponse.data);
      setMyProjects(myProjectsResponse.data);
    } catch (error) {
      console.error('Fetch data error:', error);
      let errorMessage = 'Failed to load projects';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Team members management for custom project
  const updateTeamMember = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };
    setTeamMembers(updatedMembers);
  };

  const addTeamMember = () => {
    if (teamMembers.length < 5) {
      setTeamMembers([...teamMembers, { name: '', rollNo: '' }]);
    } else {
      Alert.alert('Maximum Limit', 'You can add up to 5 team members only');
    }
  };

  const removeTeamMember = (index) => {
    if (index === 0) {
      Alert.alert('Cannot Remove', 'Project lead cannot be removed');
      return;
    }
    
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
  };

  // Team members management for project registration
  const updateRegistrationTeamMember = (index, field, value) => {
    const updatedMembers = [...registrationTeamMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };
    setRegistrationTeamMembers(updatedMembers);
  };

  const addRegistrationTeamMember = () => {
    if (registrationTeamMembers.length < (selectedProject?.maxTeamSize || 5)) {
      setRegistrationTeamMembers([...registrationTeamMembers, { name: '', rollNo: '' }]);
    } else {
      Alert.alert(
        'Maximum Limit', 
        `You can add up to ${selectedProject?.maxTeamSize || 5} team members only`
      );
    }
  };

  const removeRegistrationTeamMember = (index) => {
    if (index === 0) {
      Alert.alert('Cannot Remove', 'Project lead cannot be removed');
      return;
    }
    
    const updatedMembers = registrationTeamMembers.filter((_, i) => i !== index);
    setRegistrationTeamMembers(updatedMembers);
  };

  const validateCustomForm = () => {
    if (!projectTitle.trim()) {
      Alert.alert('Error', 'Please enter a project title');
      return false;
    }
    
    if (!projectDescription.trim()) {
      Alert.alert('Error', 'Please enter a project description');
      return false;
    }
    
    for (let i = 0; i < teamMembers.length; i++) {
      if (!teamMembers[i].name.trim() || !teamMembers[i].rollNo.trim()) {
        Alert.alert('Error', `Please fill in all details for team member ${i + 1}`);
        return false;
      }
    }
    
    return true;
  };

  const validateRegistrationForm = () => {
    for (let i = 0; i < registrationTeamMembers.length; i++) {
      if (!registrationTeamMembers[i].name.trim() || !registrationTeamMembers[i].rollNo.trim()) {
        Alert.alert('Error', `Please fill in all details for team member ${i + 1}`);
        return false;
      }
    }
    
    return true;
  };

  const submitCustomProject = async () => {
    if (!validateCustomForm()) return;
    
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      const skillsArray = projectSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill !== '');
      
      const response = await axios.post(
        `${SERVER_URL}/api/projects/custom`, 
        {
          title: projectTitle,
          description: projectDescription,
          domain: projectDomain,
          skills: skillsArray,
          teamMembers: teamMembers
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update the myProjects state with the newly created project
      const newProject = response.data;
      setMyProjects(prevProjects => [...prevProjects, newProject]);
      
      Alert.alert(
        'Success', 
        'Your project has been submitted for approval!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setShowCustomForm(false);
              setActiveTab('myprojects');
              // Clear form data
              setProjectTitle('');
              setProjectDescription('');
              setProjectDomain('');
              setProjectSkills('');
              setTeamMembers([
                { name: student?.name || '', rollNo: student?.username || '' }
              ]);
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Project submission error:', error);
      let errorMessage = 'Failed to submit project. Please try again.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const registerForProject = async () => {
    if (!validateRegistrationForm()) return;
    if (!selectedProject) return;
    
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      const response = await axios.post(
        `${SERVER_URL}/api/projects/register/${selectedProject._id}`, 
        {
          teamMembers: registrationTeamMembers
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Get the updated project and add it to myProjects
      const registeredProject = response.data;
      
      // Update the myProjects array with the newly registered project
      setMyProjects(prevProjects => {
        // Check if the project already exists in myProjects
        const exists = prevProjects.some(project => project._id === registeredProject._id);
        if (exists) {
          // Update the existing project
          return prevProjects.map(project => 
            project._id === registeredProject._id ? registeredProject : project
          );
        } else {
          // Add the new project
          return [...prevProjects, registeredProject];
        }
      });
      
      Alert.alert(
        'Success', 
        'You have successfully registered for this project!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setShowRegistrationModal(false);
              setSelectedProject(null);
              setActiveTab('myprojects');
              // Refresh projects to get the updated data
              fetchData();
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Project registration error:', error);
      let errorMessage = 'Failed to register for project. Please try again.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const openRegistrationModal = (project) => {
    setSelectedProject(project);
    setRegistrationTeamMembers([
      { name: student?.name || '', rollNo: student?.username || '' }
    ]);
    setShowRegistrationModal(true);
  };

  const renderProjectCard = ({ item }) => (
    <View style={styles.projectCard}>
      <Text style={styles.projectTitle}>{item.title}</Text>
      
      <View style={styles.projectMetaRow}>
        <View style={styles.projectMetaItem}>
          <Text style={styles.projectMetaLabel}>Domain:</Text>
          <Text style={styles.projectMetaValue}>{item.domain || 'N/A'}</Text>
        </View>
        
        <View style={styles.projectMetaItem}>
          <Text style={styles.projectMetaLabel}>Team Size:</Text>
          <Text style={styles.projectMetaValue}>Max {item.maxTeamSize || 4}</Text>
        </View>
      </View>
      
      <Text style={styles.projectDescTitle}>Description:</Text>
      <Text style={styles.projectDescription}>{item.description}</Text>
      
      {item.skills && item.skills.length > 0 && (
        <>
          <Text style={styles.projectDescTitle}>Skills Required:</Text>
          <View style={styles.skillsContainer}>
            {item.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </>
      )}
      
      {item.mentor && (
        <View style={styles.mentorRow}>
          <Icon name="person" size={16} color="#aaa" />
          <Text style={styles.mentorText}>Mentor: {item.mentor}</Text>
        </View>
      )}
      
      {item.deadline && (
        <View style={styles.deadlineRow}>
          <Icon name="time" size={16} color="#aaa" />
          <Text style={styles.deadlineText}>
            Deadline: {new Date(item.deadline).toLocaleDateString()}
          </Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.registerButton}
        onPress={() => openRegistrationModal(item)}
      >
        <Text style={styles.registerButtonText}>Register for Project</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMyProjectCard = ({ item }) => (
    <View style={styles.projectCard}>
      <View style={styles.projectStatusBadge}>
        <Text style={styles.projectStatusText}>
          {item.status === 'registered' ? 'Active' : 
           item.status === 'pending_approval' ? 'Pending Approval' : 
           item.status === 'completed' ? 'Completed' : 'Unknown'}
        </Text>
      </View>
      
      <Text style={styles.projectTitle}>{item.title}</Text>
      
      <Text style={styles.projectDescTitle}>Description:</Text>
      <Text style={styles.projectDescription}>{item.description}</Text>
      
      <Text style={styles.projectDescTitle}>Team Members:</Text>
      {item.teamMembers && item.teamMembers.length > 0 ? (
        item.teamMembers.map((member, index) => (
          <View key={index} style={styles.teamMemberRow}>
            <Icon name="person-circle-outline" size={16} color="#aaa" />
            <Text style={styles.teamMemberText}>
              {member.name || 'No name'} ({member.rollNo || 'No ID'})
              {index === 0 ? ' - Lead' : ''}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.teamMemberText}>No team members listed</Text>
      )}
      
      {item.domain && (
        <View style={styles.mentorRow}>
          <MaterialCommunityIcons name="application-braces" size={16} color="#aaa" />
          <Text style={styles.mentorText}>Domain: {item.domain}</Text>
        </View>
      )}
      
      {item.mentor && (
        <View style={styles.mentorRow}>
          <Icon name="person" size={16} color="#aaa" />
          <Text style={styles.mentorText}>Mentor: {item.mentor}</Text>
        </View>
      )}
      
      <View style={styles.submissionRow}>
        <Icon name="calendar" size={16} color="#aaa" />
        <Text style={styles.submissionText}>
          Registered on: {new Date(item.submissionDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderCustomProjectForm = () => (
    <ScrollView style={styles.customFormContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Project Title</Text>
        <TextInput 
          style={styles.input}
          placeholder="Enter project title"
          placeholderTextColor="#aaa"
          value={projectTitle}
          onChangeText={setProjectTitle}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Project Description</Text>
        <TextInput 
          style={[styles.input, styles.textArea]}
          placeholder="Describe your project"
          placeholderTextColor="#aaa"
          multiline={true}
          numberOfLines={4}
          value={projectDescription}
          onChangeText={setProjectDescription}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Domain</Text>
        <TextInput 
          style={styles.input}
          placeholder="e.g., Web Development, AI/ML, Mobile App"
          placeholderTextColor="#aaa"
          value={projectDomain}
          onChangeText={setProjectDomain}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Skills Required (comma-separated)</Text>
        <TextInput 
          style={styles.input}
          placeholder="e.g., React, Node.js, MongoDB"
          placeholderTextColor="#aaa"
          value={projectSkills}
          onChangeText={setProjectSkills}
        />
      </View>
      
      <Text style={styles.sectionTitle}>Team Members</Text>
      <Text style={styles.note}>* First member is considered as team lead</Text>
      
      {teamMembers.map((member, index) => (
        <View key={index} style={styles.teamMemberContainer}>
          <View style={styles.teamMemberHeader}>
            <Text style={styles.teamMemberTitle}>
              {index === 0 ? 'Team Lead' : `Member ${index}`}
            </Text>
            {index !== 0 && (
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeTeamMember(index)}
              >
                <Icon name="close-circle" size={20} color="#ff4d4d" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput 
              style={styles.input}
              placeholder="Enter name"
              placeholderTextColor="#aaa"
              value={member.name}
              onChangeText={(value) => updateTeamMember(index, 'name', value)}
              editable={index !== 0} // First member (lead) name is not editable
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Roll Number</Text>
            <TextInput 
              style={styles.input}
              placeholder="Enter roll number"
              placeholderTextColor="#aaa"
              value={member.rollNo}
              onChangeText={(value) => updateTeamMember(index, 'rollNo', value)}
              editable={index !== 0} // First member (lead) roll number is not editable
            />
          </View>
        </View>
      ))}
      
      <TouchableOpacity 
        style={styles.addMemberButton}
        onPress={addTeamMember}
      >
        <Icon name="add-circle" size={20} color="white" />
        <Text style={styles.addMemberText}>Add Team Member</Text>
      </TouchableOpacity>
      
      <View style={styles.formButtonsRow}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setShowCustomForm(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            submitting && { opacity: 0.7 }
          ]}
          onPress={submitCustomProject}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Project</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderRegistrationModal = () => (
    <Modal
      visible={showRegistrationModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowRegistrationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Register for Project</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowRegistrationModal(false)}
            >
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {selectedProject && (
            <>
              <Text style={styles.modalProjectTitle}>{selectedProject.title}</Text>
              
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalSectionTitle}>Team Members</Text>
                <Text style={styles.modalNote}>
                  * First member is you (team lead)
                </Text>
                <Text style={styles.modalNote}>
                  * Maximum team size: {selectedProject.maxTeamSize || 4}
                </Text>
                
                {registrationTeamMembers.map((member, index) => (
                  <View key={index} style={styles.teamMemberContainer}>
                    <View style={styles.teamMemberHeader}>
                      <Text style={styles.teamMemberTitle}>
                        {index === 0 ? 'Team Lead' : `Member ${index}`}
                      </Text>
                      {index !== 0 && (
                        <TouchableOpacity 
                          style={styles.removeButton}
                          onPress={() => removeRegistrationTeamMember(index)}
                        >
                          <Icon name="close-circle" size={20} color="#ff4d4d" />
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Name</Text>
                      <TextInput 
                        style={styles.input}
                        placeholder="Enter name"
                        placeholderTextColor="#aaa"
                        value={member.name}
                        onChangeText={(value) => updateRegistrationTeamMember(index, 'name', value)}
                        editable={index !== 0} // First member (lead) name is not editable
                      />
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Roll Number</Text>
                      <TextInput 
                        style={styles.input}
                        placeholder="Enter roll number"
                        placeholderTextColor="#aaa"
                        value={member.rollNo}
                        onChangeText={(value) => updateRegistrationTeamMember(index, 'rollNo', value)}
                        editable={index !== 0} // First member (lead) roll number is not editable
                      />
                    </View>
                  </View>
                ))}
                
                {registrationTeamMembers.length < (selectedProject.maxTeamSize || 4) && (
                  <TouchableOpacity 
                    style={styles.addMemberButton}
                    onPress={addRegistrationTeamMember}
                  >
                    <Icon name="add-circle" size={20} color="white" />
                    <Text style={styles.addMemberText}>Add Team Member</Text>
                  </TouchableOpacity>
                )}
                
                <View style={styles.formButtonsRow}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowRegistrationModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.submitButton, 
                      submitting && { opacity: 0.7 }
                    ]}
                    onPress={registerForProject}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="black" />
                    ) : (
                      <Text style={styles.submitButtonText}>Register</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Projects</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchData}
        >
          <Icon name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ideas' && styles.activeTab]}
          onPress={() => setActiveTab('ideas')}
        >
          <FontAwesome 
            name="lightbulb-o" 
            size={18} 
            color={activeTab === 'ideas' ? '#4F8EF7' : '#aaa'} 
          />
          <Text style={[styles.tabText, activeTab === 'ideas' && styles.activeTabText]}>
            Project Ideas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'myprojects' && styles.activeTab]}
          onPress={() => setActiveTab('myprojects')}
        >
          <FontAwesome 
            name="folder" 
            size={18} 
            color={activeTab === 'myprojects' ? '#4F8EF7' : '#aaa'} 
          />
          <Text style={[styles.tabText, activeTab === 'myprojects' && styles.activeTabText]}>
            My Projects
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'custom' && styles.activeTab]}
          onPress={() => {
            setActiveTab('custom');
            setShowCustomForm(true);
          }}
        >
          <FontAwesome 
            name="plus-circle" 
            size={18} 
            color={activeTab === 'custom' ? '#4F8EF7' : '#aaa'} 
          />
          <Text style={[styles.tabText, activeTab === 'custom' && styles.activeTabText]}>
            Submit Project
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F8EF7" />
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      ) : (
        <>
          {activeTab === 'ideas' && (
            projectIdeas.length > 0 ? (
              <FlatList
                data={projectIdeas}
                renderItem={renderProjectCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#4F8EF7']}
                  />
                }
              />
            ) : (
              <ScrollView 
                contentContainerStyle={styles.emptyStateContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#4F8EF7']}
                  />
                }
              >
                <MaterialCommunityIcons name="lightbulb-outline" size={60} color="#ccc" />
                <Text style={styles.emptyStateText}>No project ideas available at the moment</Text>
              </ScrollView>
            )
          )}
          
          {activeTab === 'myprojects' && (
            myProjects.length > 0 ? (
              <FlatList
                data={myProjects}
                renderItem={renderMyProjectCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#4F8EF7']}
                  />
                }
              />
            ) : (
              <ScrollView 
                contentContainerStyle={styles.emptyStateContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#4F8EF7']}
                  />
                }
              >
                <MaterialCommunityIcons name="folder-open-outline" size={60} color="#ccc" />
                <Text style={styles.emptyStateText}>You haven't registered for any projects yet</Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => setActiveTab('ideas')}
                >
                  <Text style={styles.emptyStateButtonText}>Browse Project Ideas</Text>
                </TouchableOpacity>
              </ScrollView>
            )
          )}
          
          {activeTab === 'custom' && showCustomForm && renderCustomProjectForm()}
        </>
      )}
      
      {renderRegistrationModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginLeft: 16,
  },
  refreshButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    activeTab: {
      backgroundColor: '#e6f0ff',
    },
    tabText: {
      marginLeft: 8,
      fontSize: 14,
      color: '#888',
    },
    activeTabText: {
      color: '#000000',
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: '#888',
    },
    listContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    projectCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    projectTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 12,
    },
    projectStatusBadge: {
      alignSelf: 'flex-start',
      backgroundColor: '#e6f0ff',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 8,
    },
    projectStatusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#000000',
    },
    projectMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    projectMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    projectMetaLabel: {
      fontSize: 14,
      color: '#888',
      marginRight: 4,
    },
    projectMetaValue: {
      fontSize: 14,
      color: '#555',
      fontWeight: '600',
    },
    projectDescTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
      marginBottom: 4,
    },
    projectDescription: {
      fontSize: 14,
      color: '#555',
      lineHeight: 20,
      marginBottom: 12,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    skillTag: {
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    skillText: {
      fontSize: 12,
      color: '#666',
    },
    mentorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    mentorText: {
      fontSize: 14,
      color: '#666',
      marginLeft: 8,
    },
    deadlineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    deadlineText: {
      fontSize: 14,
      color: '#666',
      marginLeft: 8,
    },
    teamMemberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      paddingLeft: 4,
    },
    teamMemberText: {
      fontSize: 14,
      color: '#666',
      marginLeft: 8,
    },
    submissionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    submissionText: {
      fontSize: 14,
      color: '#666',
      marginLeft: 8,
    },
    registerButton: {
      backgroundColor: '#4F8EF7',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    registerButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyStateText: {
      fontSize: 16,
      color: '#888',
      textAlign: 'center',
      marginTop: 16,
      marginBottom: 24,
    },
    emptyStateButton: {
      backgroundColor: '#4F8EF7',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    emptyStateButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    customFormContainer: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 24,
      marginBottom: 8,
    },
    note: {
      fontSize: 14,
      color: '#888',
      marginBottom: 16,
      fontStyle: 'italic',
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: '#666',
      marginBottom: 6,
    },
    input: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: '#333',
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    teamMemberContainer: {
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    teamMemberHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    teamMemberTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#555',
    },
    removeButton: {
      padding: 4,
    },
    addMemberButton: {
      backgroundColor: '#4F8EF7',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 24,
    },
    addMemberText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    formButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 32,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      paddingVertical: 14,
      borderRadius: 8,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButtonText: {
      color: '#666',
      fontSize: 16,
      fontWeight: '600',
    },
    submitButton: {
      flex: 2,
      backgroundColor: '#4CAF50',
      paddingVertical: 14,
      borderRadius: 8,
      marginLeft: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: 'white',
      borderRadius: 12,
      overflow: 'hidden',
    },
    modalHeader: {
      backgroundColor: '#4F8EF7',
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    modalCloseButton: {
      padding: 4,
    },
    modalProjectTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      padding: 16,
      paddingBottom: 0,
    },
    modalContent: {
      padding: 16,
    },
    modalSectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#555',
      marginBottom: 8,
    },
    modalNote: {
      fontSize: 14,
      color: '#888',
      marginBottom: 8,
      fontStyle: 'italic',
    }
  });
  
  export default ProjectsScreen;