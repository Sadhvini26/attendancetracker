// NoticeBoard.js
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const SERVER_URL = 'http://192.168.149.239:3000'; // Replace with your backend IP or domain

const NoticeBoard = () => {
  const navigation = useNavigation();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/notices`);
      setNotices(response.data);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notice Board</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.noticesContainer}>
          {notices.map(notice => {
            const date = new Date(notice.createdAt).toLocaleDateString();
            const [title, ...rest] = notice.text.split(/\.\s+|\n/); // optional: treat first sentence as title
            const content = rest.join('. ');

            return (
              <View key={notice._id} style={styles.noticeCard}>
                <View style={styles.noticeHeader}>
                  <Text style={styles.noticeTitle}>{title || 'Notice'}</Text>
                  <Text style={styles.noticeDate}>{date}</Text>
                </View>
                <Text style={styles.noticeContent}>{content || title}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}
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
    marginRight: 10,
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
