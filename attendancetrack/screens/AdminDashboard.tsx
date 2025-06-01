// Admin Dashboard
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
const AdminDashboard = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      setFontsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Admin Info Card */}
      <View style={styles.adminCard}>
        <View style={styles.adminInfoRow}>
          <Icon name="person-outline" size={30} color="black" />
          <Text style={styles.adminNameText}>ADMIN NAME</Text>
          <TouchableOpacity>
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Permissions & Settings */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('FacultyPermissions')}>
            <FontAwesome name="file-text-o" size={24} color="black" />
            <Text style={styles.quickActionText}>Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="settings-outline" size={24} color="black" />
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Dashboard Title */}
      <Text style={styles.dashboardTitle}>Dashboard</Text>

      {/* Main Dashboard Options */}
      <View style={styles.menuGrid}>
        <View style={styles.menuRow}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditNoticeBoard')}>
            <FontAwesome name="commenting-o" size={28} color="black" />
            <Text style={styles.menuItemText}>Edit Notice Board</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('StudentDetails')}>
            <FontAwesome name="id-card-o" size={28} color="black" />
            <Text style={styles.menuItemText} >Student Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuRow}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('FacultyDetailsScreen')}>
            <FontAwesome name="address-book-o" size={28} color="black" />
            <Text style={styles.menuItemText}>Faculty Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DisciplinaryPoints')}>
            <MaterialCommunityIcons name="account-group-outline" size={28} color="black" />
            <Text style={styles.menuItemText}>Disciplinary Points</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuRow}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('commonContact')}>
            <Feather name="phone" size={28} color="black" />
            <Text style={styles.menuItemText}>Contact KMIT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('SignIn')}>
            <Feather name="log-out" size={28} color="black" />
            <Text style={styles.menuItemText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  adminCard: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    paddingBottom: 15,
    elevation: 2,
    paddingTop: 20,
  },
  adminInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
  },
  adminNameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 10,
  },
  quickActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 5,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
  },
  menuGrid: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '48%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AdminDashboard;