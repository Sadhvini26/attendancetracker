import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  FlatList,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
// import Facullty from './Faculty'
const StudentProjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teams, setTeams] = useState([]);

  // Mock data - replace with API calls in production
  const mockProjects = [
    { id: '1', name: 'Attendance Tracker' },
    { id: '2', name: 'Library Management System' },
    { id: '3', name: 'Student Feedback Portal' },
  ];

  const mockTeams = {
    '1': [
      { 
        teamId: 'AT1', 
        teamNumber: '1', 
        teamLeader: 'Rahul Sharma', 
        members: ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta']
      },
      { 
        teamId: 'AT2', 
        teamNumber: '2', 
        teamLeader: 'Aisha Khan', 
        members: ['Aisha Khan', 'Vikram Singh', 'Neha Reddy', 'Sanjay Das']
      },
      { 
        teamId: 'AT3', 
        teamNumber: '3', 
        teamLeader: 'Rajesh Mishra', 
        members: ['Rajesh Mishra', 'Divya Rao', 'Suresh Iyer']
      },
    ],
    '2': [
      { 
        teamId: 'LMS1', 
        teamNumber: '1', 
        teamLeader: 'Karthik Raman', 
        members: ['Karthik Raman', 'Ananya Sharma', 'Rohan Patel']
      },
      { 
        teamId: 'LMS2', 
        teamNumber: '2', 
        teamLeader: 'Meera Singh', 
        members: ['Meera Singh', 'Arjun Nair', 'Tanvi Gupta', 'Farhan Khan']
      },
    ],
    '3': [
      { 
        teamId: 'SFP1', 
        teamNumber: '1', 
        teamLeader: 'Varun Malhotra', 
        members: ['Varun Malhotra', 'Pooja Iyer', 'Aditi Sharma', 'Kiran Rao']
      }
    ]
  };

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setTeams(mockTeams[project.id]);
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.projectCard, 
        selectedProject?.id === item.id && styles.selectedProjectCard
      ]}
      onPress={() => handleProjectSelect(item)}
    >
      <Icon name="document-text-outline" size={24} color={selectedProject?.id === item.id ? "#fff" : "#000"} />
      <Text style={[styles.projectName, selectedProject?.id === item.id && styles.selectedProjectText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderTeamItem = ({ item }) => (
    <View style={styles.teamCard}>
      <View style={styles.teamHeaderContainer}>
        <View style={styles.teamNumberContainer}>
          <Text style={styles.teamNumberText}>Team {item.teamNumber}</Text>
        </View>
      </View>
      
      <View style={styles.teamLeaderContainer}>
        <Icon name="star" size={16} color="#FFD700" />
        <Text style={styles.teamLeaderText}>Team Leader: {item.teamLeader}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <Text style={styles.membersTitle}>Team Members:</Text>
      {item.members.map((member, index) => (
        <View key={index} style={styles.memberRow}>
          <Icon name="person-outline" size={16} color="#555" />
          <Text style={styles.memberName}>{member}</Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity 
  style={styles.backButton}
  onPress={() => navigation.navigate('FacultyDashboard')}  // or navigation.navigate('FacultyPage')
>
  <Icon name="arrow-back" size={24} color="white" />
</TouchableOpacity>

        <Text style={styles.headerTitle}>Student Project Details</Text>
      </View>
      
      {/* Projects List */}
      <View style={styles.projectsContainer}>
        <Text style={styles.sectionTitle}>Select Project</Text>
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.projectsList}
        />
      </View>
      
      {/* Teams List */}
      {selectedProject ? (
        <View style={styles.teamsContainer}>
          <Text style={styles.selectedProjectTitle}>{selectedProject.name} Teams</Text>
          
          {teams && teams.length > 0 ? (
            <FlatList
              data={teams}
              renderItem={renderTeamItem}
              keyExtractor={(item) => item.teamId}
              contentContainerStyle={styles.teamsList}
            />
          ) : (
            <View style={styles.noTeamsContainer}>
              <Icon name="alert-circle-outline" size={50} color="#888" />
              <Text style={styles.noTeamsText}>No teams registered for this project yet.</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noProjectSelectedContainer}>
          <Icon name="document-outline" size={80} color="#DDD" />
          <Text style={styles.noProjectSelectedText}>Select a project to view team details</Text>
        </View>
      )}
    </SafeAreaView>
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
    color: '#555',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  projectsContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  projectsList: {
    paddingHorizontal: 10,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    minWidth: 200,
  },
  selectedProjectCard: {
    backgroundColor: '#000',
  },
  projectName: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  selectedProjectText: {
    color: 'white',
  },
  teamsContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  selectedProjectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  teamsList: {
    padding: 10,
  },
  teamCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  teamHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamNumberContainer: {
    backgroundColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  teamNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  teamLeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  teamLeaderText: {
    fontWeight: '500',
    marginLeft: 5,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  membersTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  memberName: {
    marginLeft: 10,
  },
  noTeamsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noTeamsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  noProjectSelectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProjectSelectedText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default StudentProjectDetails;