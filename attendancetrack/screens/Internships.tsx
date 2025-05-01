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
  Alert,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Internships = () => {
  const navigation = useNavigation();
  const [internships, setInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentRollNumber, setStudentRollNumber] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    domain: 'All',
    location: 'All',
    duration: 'All'
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulating API fetch
    const mockInternships = [
      { 
        id: '1', 
        companyName: 'TechCorp', 
        role: 'Software Developer Intern',
        location: 'Hyderabad',
        domain: 'Software Development',
        deadline: '2025-05-15',
        stipend: '₹15,000/month',
        duration: '3 months',
        description: 'Looking for passionate students to join our software development team for a summer internship. Work on real projects and gain hands-on experience with modern tech stacks.',
        requirements: 'Proficient in Java, Python, or JavaScript. Basic understanding of web development and databases.',
        registrations: 45
      },
      { 
        id: '2', 
        companyName: 'DataMinds', 
        role: 'Data Science Intern',
        location: 'Bangalore',
        domain: 'Data Science',
        deadline: '2025-05-10',
        stipend: '₹20,000/month',
        duration: '6 months',
        description: 'Join our data science team to work on machine learning models and data analysis for real-world problems. Great opportunity to apply theoretical knowledge to practical applications.',
        requirements: 'Knowledge of Python, statistics, and machine learning basics. Experience with libraries like pandas, numpy, scikit-learn is a plus.',
        registrations: 67
      },
      { 
        id: '3', 
        companyName: 'CloudWave', 
        role: 'Cloud Engineering Intern',
        location: 'Remote',
        domain: 'Cloud Computing',
        deadline: '2025-05-20',
        stipend: '₹18,000/month',
        duration: '4 months',
        description: 'Work with our cloud engineering team to deploy and manage cloud infrastructure. Learn about AWS, Azure, or GCP in a hands-on environment.',
        requirements: 'Basic understanding of cloud concepts, networking, and Linux. AWS/Azure certification is a plus but not required.',
        registrations: 29
      },
      { 
        id: '4', 
        companyName: 'SecureNet', 
        role: 'Cyber Security Intern',
        location: 'Chennai',
        domain: 'Cyber Security',
        deadline: '2025-05-25',
        stipend: '₹22,000/month',
        duration: '3 months',
        description: 'Join our security team to learn about vulnerability assessment, penetration testing, and security protocols. Help us identify and fix security vulnerabilities.',
        requirements: 'Knowledge of networking concepts, basic security principles. Familiarity with Linux and scripting languages.',
        registrations: 38
      },
      { 
        id: '5', 
        companyName: 'WebDesign Pro', 
        role: 'UI/UX Design Intern',
        location: 'Hyderabad',
        domain: 'Design',
        deadline: '2025-06-01',
        stipend: '₹12,000/month',
        duration: '2 months',
        description: 'Work with our design team to create beautiful and functional user interfaces. Learn about user experience design, wireframing, and prototyping.',
        requirements: 'Proficiency in design tools like Figma or Adobe XD. Basic understanding of UI/UX principles.',
        registrations: 51
      },
      { 
        id: '6', 
        companyName: 'MobileTech', 
        role: 'Mobile App Developer Intern',
        location: 'Pune',
        domain: 'Mobile Development',
        deadline: '2025-05-18',
        stipend: '₹16,000/month',
        duration: '4 months',
        description: 'Join our mobile development team to work on Android or iOS applications. Learn the complete development cycle from concept to deployment.',
        requirements: 'Knowledge of Java/Kotlin for Android or Swift for iOS. Experience with mobile app development is a plus.',
        registrations: 42
      },
    ];
    
    setInternships(mockInternships);
  }, []);

  const openInternshipDetails = (internship) => {
    setSelectedInternship(internship);
    setModalVisible(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const daysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const differenceInTime = deadlineDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = 
      internship.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = filters.domain === 'All' || internship.domain === filters.domain;
    const matchesLocation = filters.location === 'All' || internship.location === filters.location;
    const matchesDuration = filters.duration === 'All' || internship.duration === filters.duration;

    return matchesSearch && matchesDomain && matchesLocation && matchesDuration;
  });

  const registerForInternship = () => {
    if (!studentName || !studentRollNumber || !studentEmail || !studentPhone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // In a real app, you would send this registration to your backend
    Alert.alert(
      'Registration Successful',
      `You have successfully registered for the ${selectedInternship.role} position at ${selectedInternship.companyName}. You will receive further details via email.`,
      [{ 
        text: 'OK', 
        onPress: () => {
          setModalVisible(false);
          // Reset form
          setStudentName('');
          setStudentRollNumber('');
          setStudentEmail('');
          setStudentPhone('');
        } 
      }]
    );
  };

  const renderInternshipItem = ({ item }) => {
    const remainingDays = daysRemaining(item.deadline);
    
    return (
      <TouchableOpacity 
        style={styles.internshipItem}
        onPress={() => openInternshipDetails(item)}
      >
        <View style={styles.internshipHeader}>
          <Text style={styles.companyName}>{item.companyName}</Text>
          <View style={[
            styles.deadlineBadge,
            { backgroundColor: remainingDays <= 5 ? '#F44336' : '#4CAF50' }
          ]}>
            <Text style={styles.deadlineText}>
              {remainingDays} days left
            </Text>
          </View>
        </View>
        
        <Text style={styles.roleTitle}>{item.role}</Text>
        
        <View style={styles.internshipDetails}>
          <View style={styles.detailItem}>
            <Icon name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="briefcase-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.domain}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <FontAwesome name="money" size={16} color="#666" />
            <Text style={styles.detailText}>{item.stipend}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
        </View>
        
        <View style={styles.registrationsContainer}>
          <Icon name="people-outline" size={16} color="#666" />
          <Text style={styles.registrationsText}>{item.registrations} students registered</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getDomains = () => {
    const domains = [...new Set(internships.map(item => item.domain))];
    return ['All', ...domains];
  };

  const getLocations = () => {
    const locations = [...new Set(internships.map(item => item.location))];
    return ['All', ...locations];
  };

  const getDurations = () => {
    const durations = [...new Set(internships.map(item => item.duration))];
    return ['All', ...durations];
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
        <Text style={styles.headerTitle}>Internship Opportunities</Text>
      </View>
      
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search internships..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Icon name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Internship List */}
      {filteredInternships.length > 0 ? (
        <FlatList
          data={filteredInternships}
          renderItem={renderInternshipItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="search" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No internships found</Text>
          <Text style={styles.emptySubtext}>Try changing your search or filters</Text>
        </View>
      )}
      
      {/* Internship Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            
            {selectedInternship && (
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalCompanyName}>{selectedInternship.companyName}</Text>
                <Text style={styles.modalRoleTitle}>{selectedInternship.role}</Text>
                
                <View style={styles.modalDetailRow}>
                  <View style={styles.modalDetailItem}>
                    <Icon name="location-outline" size={18} color="#666" />
                    <Text style={styles.modalDetailText}>{selectedInternship.location}</Text>
                  </View>
                  
                  <View style={styles.modalDetailItem}>
                    <MaterialCommunityIcons name="briefcase-outline" size={18} color="#666" />
                    <Text style={styles.modalDetailText}>{selectedInternship.domain}</Text>
                  </View>
                </View>
                
                <View style={styles.modalDetailRow}>
                  <View style={styles.modalDetailItem}>
                    <FontAwesome name="money" size={18} color="#666" />
                    <Text style={styles.modalDetailText}>{selectedInternship.stipend}</Text>
                  </View>
                  
                  <View style={styles.modalDetailItem}>
                    <Icon name="time-outline" size={18} color="#666" />
                    <Text style={styles.modalDetailText}>{selectedInternship.duration}</Text>
                  </View>
                </View>
                
                <View style={styles.modalDeadlineContainer}>
                  <Icon name="calendar-outline" size={18} color="#666" />
                  <Text style={styles.modalDeadlineText}>
                    Application Deadline: {formatDate(selectedInternship.deadline)}
                  </Text>
                </View>
                
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.sectionText}>{selectedInternship.description}</Text>
                </View>
                
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Requirements</Text>
                  <Text style={styles.sectionText}>{selectedInternship.requirements}</Text>
                </View>
                
                <View style={styles.registrationFormContainer}>
                  <Text style={styles.registrationTitle}>Register for this Internship</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      value={studentName}
                      onChangeText={setStudentName}
                      placeholder="Enter your full name"
                    />
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Roll Number</Text>
                    <TextInput
                      style={styles.input}
                      value={studentRollNumber}
                      onChangeText={setStudentRollNumber}
                      placeholder="Enter your roll number"
                    />
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.input}
                      value={studentEmail}
                      onChangeText={setStudentEmail}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                    />
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      value={studentPhone}
                      onChangeText={setStudentPhone}
                      placeholder="Enter your phone number"
                      keyboardType="phone-pad"
                    />
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.registerButton}
                    onPress={registerForInternship}
                  >
                    <Text style={styles.registerButtonText}>Register Now</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { height: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Internships</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Icon name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filterModalContent}>
              {/* Domain Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Domain</Text>
                <View style={styles.filterOptions}>
                  {getDomains().map((domain, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterOption,
                        filters.domain === domain && styles.selectedFilterOption
                      ]}
                      onPress={() => setFilters({...filters, domain})}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        filters.domain === domain && styles.selectedFilterOptionText
                      ]}>
                        {domain}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Location Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Location</Text>
                <View style={styles.filterOptions}>
                  {getLocations().map((location, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterOption,
                        filters.location === location && styles.selectedFilterOption
                      ]}
                      onPress={() => setFilters({...filters, location})}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        filters.location === location && styles.selectedFilterOptionText
                      ]}>
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Duration Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Duration</Text>
                <View style={styles.filterOptions}>
                  {getDurations().map((duration, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterOption,
                        filters.duration === duration && styles.selectedFilterOption
                      ]}
                      onPress={() => setFilters({...filters, duration})}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        filters.duration === duration && styles.selectedFilterOptionText
                      ]}>
                        {duration}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Filter Actions */}
              <View style={styles.filterActions}>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={() => setFilters({
                    domain: 'All',
                    location: 'All',
                    duration: 'All'
                  })}
                >
                  <Text style={styles.resetButtonText}>Reset All</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={() => setIsFilterModalVisible(false)}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
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
  filterButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  internshipItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  internshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deadlineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  deadlineText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  internshipDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 5,
    color: '#666',
  },
  registrationsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  registrationsText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
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
    width: '90%',
    // maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    height: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  modalContent: {
    padding: 15,
  },
  modalCompanyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalRoleTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
  },
  modalDetailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  modalDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  modalDetailText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  modalDeadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  modalDeadlineText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionText: {
    color: '#444',
    lineHeight: 20,
  },
  registrationFormContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    marginTop: 10,
  },
  registrationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  filterModalContent: {
    padding: 15,
  },
  filterSection: {
    marginBottom: 30,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedFilterOption: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterOptionText: {
    color: '#444',
  },
  selectedFilterOptionText: {
    color: 'white',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  resetButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Internships;