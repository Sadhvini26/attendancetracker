// Admin -> Notice Board
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditNoticeBoard = () => {
  const [notices, setNotices] = useState([
    { id: '1', text: 'Exam schedule released.' },
    { id: '2', text: 'Meeting at 3 PM.' },
  ]);
  const [newNotice, setNewNotice] = useState('');

  const addNotice = () => {
    if (!newNotice.trim()) {
      Alert.alert('Error', 'Notice text cannot be empty');
      return;
    }
    const newEntry = {
      id: Date.now().toString(),
      text: newNotice,
    };
    setNotices([...notices, newEntry]);
    setNewNotice('');
    Alert.alert('Success', 'Notice added successfully!');
  };

  const deleteNotice = (id: string) => {
    setNotices(notices.filter((notice) => notice.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Notice Board</Text>

      {/* Notice Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter notice"
        value={newNotice}
        onChangeText={setNewNotice}
      />

      <TouchableOpacity onPress={addNotice} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Notice</Text>
      </TouchableOpacity>

      {/* Notice List */}
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noticeItem}>
            <Text style={styles.noticeText}>{item.text}</Text>
            <TouchableOpacity onPress={() => deleteNotice(item.id)}>
              <Icon name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f5f5',
    // marginTop: 20,
},
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 30,
    marginBottom: 10, 
    textAlign: 'center' 
},
  input: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 5, 
    marginTop: 10,
    marginBottom: 10 
},
  addButton: { 
    backgroundColor: 'black', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center',
    marginBottom: 20,
},
  addButtonText: { 
    color: 'white', 
    fontWeight: 'bold' 
},
  noticeItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 30, 
    backgroundColor: 'white', 
    borderRadius: 5, 
    marginTop: 10 
},
  noticeText: { 
    fontSize: 16 
},
});

export default EditNoticeBoard;