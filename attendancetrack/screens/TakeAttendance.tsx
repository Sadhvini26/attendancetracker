import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const TakeAttendance = () => {
  const navigation = useNavigation();

  // Define student rolls
  const studentRolls = [
    ["541", "542", "543", "545", "54A"],
    ["546", "54D", "54E", "54H", "54J"],
    ["54K", "54M", "54P", "54U", "54Z"],
    ["553", "558", "55A", "55D", "55H"],
    ["55M", "55Z", "5K5", "5K6", "L15"],
  ];

  // Initialize student status (1: Present, 2: Absent) with all students set to absent
  const initialStudentStatus = Object.fromEntries(
    studentRolls.flat().map(roll => [roll, 2])
  );

  // Override some initial values from the original code
  const initialOverrides = {
    "542": 1, "543": 1, "545": 1, "546": 1, 
    "54D": 1, "54E": 1, "54H": 1, "54K": 1, 
    "54M": 1, "54Z": 1, "553": 1, "558": 1, 
    "55A": 1, "55D": 1, "55H": 1, "55M": 1, 
    "5K5": 1, "5K6": 1, "L15": 1, 
  };

  const [studentStatus, setStudentStatus] = useState({
    ...initialStudentStatus, 
    ...initialOverrides
  });

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    const totalStudents = studentRolls.flat().length;
    const presentCount = Object.values(studentStatus).filter(status => status === 1).length;
    const absentCount = totalStudents - presentCount;
    const presentPercentage = Math.round((presentCount / totalStudents) * 100);
    
    return { totalStudents, presentCount, absentCount, presentPercentage };
  }, [studentStatus]);

  const getButtonColor = (roll) => {
    return studentStatus[roll] === 1 ? "#28a745" : "#dc3545"; // Green = present, Red = absent
  };

  const toggleStatus = (roll) => {
    setStudentStatus((prev) => ({
      ...prev,
      [roll]: prev[roll] === 1 ? 2 : 1, // Toggle between present and absent
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    studentRolls.flat().forEach((roll) => (allPresent[roll] = 1));
    setStudentStatus(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    studentRolls.flat().forEach((roll) => (allAbsent[roll] = 2));
    setStudentStatus(allAbsent);
  };

  const saveAttendance = () => {
    // Here you would implement API call to save attendance data
    Alert.alert(
      "Success",
      "Attendance data saved successfully!",
      [{ text: "OK", onPress: () => navigation.navigate("FacultyDashboard") }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>ATTENDANCE</Text>
      </View>

      {/* Attendance Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Present: {attendanceStats.presentCount}/{attendanceStats.totalStudents} ({attendanceStats.presentPercentage}%)
        </Text>
        <Text style={styles.summaryText}>
          Absent: {attendanceStats.absentCount}/{attendanceStats.totalStudents} ({100 - attendanceStats.presentPercentage}%)
        </Text>
      </View>

      {/* Student Roll Buttons */}
      <ScrollView contentContainerStyle={styles.studentsContainer}>
        {studentRolls.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((roll) => (
              <TouchableOpacity
                key={roll}
                style={[
                  styles.studentButton, 
                  { backgroundColor: getButtonColor(roll) }
                ]}
                onPress={() => toggleStatus(roll)}
                accessibilityLabel={`Student ${roll}, ${studentStatus[roll] === 1 ? 'present' : 'absent'}`}
                accessibilityHint="Double tap to toggle attendance status"
              >
                <Text style={styles.studentText}>{roll}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: "#28a745" }]} 
          onPress={markAllPresent}
          accessibilityLabel="Mark all students present"
        >
          <Text style={styles.buttonText}>MARK ALL PRESENT</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: "#dc3545" }]} 
          onPress={markAllAbsent}
          accessibilityLabel="Mark all students absent"
        >
          <Text style={styles.buttonText}>MARK ALL ABSENT</Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={saveAttendance}
        accessibilityLabel="Save attendance data"
      >
        <Text style={styles.saveButtonText}>DONE</Text>
      </TouchableOpacity>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("FacultyDashboard")}
          accessibilityLabel="Go to dashboard"
        >
          <FontAwesome name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("FacultyDashboard")}
          accessibilityLabel="Go to profile"
        >
          <FontAwesome name="user" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Settings")}
          accessibilityLabel="Go to settings"
        >
          <FontAwesome name="cog" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Enhanced styles with additional components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f8f9fa",
    elevation: 1,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "500",
  },
  studentsContainer: {
    padding: 15,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "center",
  },
  studentButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    elevation: 3,
  },
  studentText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  actionButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#313638",
    borderRadius: 5,
    paddingVertical: 12,
    marginHorizontal: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "black",
    padding: 15,
  },
});

export default TakeAttendance;