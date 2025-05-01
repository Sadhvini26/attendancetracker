// screens/ContactScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ContactScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Contact KMIT</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.contactBlock}>
          <Text style={styles.contactTitle}>Address</Text>
          <Text style={styles.contactText}>
            Keshav Memorial Institute of Technology{'\n'}
            3-5-1026, Narayanaguda{'\n'}
            Hyderabad, Telangana 500029
          </Text>
        </View>
        
        <View style={styles.contactBlock}>
          <Text style={styles.contactTitle}>Phone</Text>
          <Text style={styles.contactText}>+91 40 2322 0603</Text>
          <Text style={styles.contactText}>+91 40 2322 0604</Text>
        </View>
        
        <View style={styles.contactBlock}>
          <Text style={styles.contactTitle}>Email</Text>
          <Text style={styles.contactText}>info@kmit.in</Text>
          <Text style={styles.contactText}>principal@kmit.in</Text>
        </View>
        
        <View style={styles.contactBlock}>
          <Text style={styles.contactTitle}>Website</Text>
          <Text style={styles.contactText}>www.kmit.in</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#000',
  },
  headerText: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  contactBlock: {
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ContactScreen;