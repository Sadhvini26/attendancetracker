// NoticeBoard.js - Simple implementation of the NoticeBoard screen
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const NoticeBoard = () => {
  const navigation = useNavigation();
  
  // Sample notices
  const notices = [
    { id: 1, title: 'Exam Schedule Updated', date: '2025-04-15', content: 'The final examination schedule has been updated. Please check the academic calendar.' },
    { id: 2, title: 'Holiday Announcement', date: '2025-04-20', content: 'The college will remain closed on April 25th for the Annual Day celebrations.' },
    { id: 3, title: 'Campus Recruitment Drive', date: '2025-04-18', content: 'XYZ Technologies will be conducting a campus recruitment drive on May 5th. Interested students should register.' },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notice Board</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.noticesContainer}>
        {notices.map(notice => (
          <View key={notice.id} style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <Text style={styles.noticeTitle}>{notice.title}</Text>
              <Text style={styles.noticeDate}>{notice.date}</Text>
            </View>
            <Text style={styles.noticeContent}>{notice.content}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 30,
  },
  noticesContainer: {
    flex: 1,
    padding: 15,
  },
  noticeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  noticeDate: {
    fontSize: 12,
    color: '#666',
  },
  noticeContent: {
    fontSize: 14,
  },
});

export default NoticeBoard;