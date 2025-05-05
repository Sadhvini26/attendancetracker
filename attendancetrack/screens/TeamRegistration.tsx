import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const API_URL = "http://172.17.144.1:3000/api";
// const API_URL = "http://192.168.194.239:3000/api";

const TeamRegistration = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { project, student, category } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [teamLeadName, setTeamLeadName] = useState(student?.name || "");
  const [teamLeadRollNo, setTeamLeadRollNo] = useState(student?.rollNo || "");
  const [teamLeadPhone, setTeamLeadPhone] = useState(student?.phone || "");
  const [teamLeadBranch, setTeamLeadBranch] = useState(student?.branch || "CSE");

  // For workshop or internship, we don't need team members
  const isTeamProject = category === "rtrp";

  // Team members (only for RTRP)
  const [members, setMembers] = useState([
    { rollNo: "", name: "", branch: "CSE" },
    { rollNo: "", name: "", branch: "CSE" },
    { rollNo: "", name: "", branch: "CSE" },
    { rollNo: "", name: "", branch: "CSE" },
  ]);

  const updateMember = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const validateForm = () => {
    // Validate team lead info
    if (!teamLeadName || !teamLeadRollNo || !teamLeadPhone) {
      Alert.alert("Error", "Please fill in all team lead information");
      return false;
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(teamLeadPhone)) {
      Alert.alert("Error", "Phone number must be 10 digits");
      return false;
    }

    // For team projects, validate team members
    if (isTeamProject) {
      for (let i = 0; i < members.length; i++) {
        if (!members[i].rollNo || !members[i].name) {
          Alert.alert("Error", `Please fill in all details for team member ${i + 1}`);
          return false;
        }

        if (members[i].rollNo === teamLeadRollNo) {
          Alert.alert("Error", "Team members cannot have the same roll number as team lead");
          return false;
        }

        // Check for duplicate roll numbers among team members
        for (let j = 0; j < i; j++) {
          if (members[i].rollNo === members[j].rollNo) {
            Alert.alert("Error", `Duplicate roll number for team member ${i + 1} and ${j + 1}`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Format the request based on registration type
      let requestData;

      if (isTeamProject) {
        // RTRP team registration
        requestData = {
          projectId: project._id,
          teamLeadId: student._id,
          teamLeadName,
          teamLeadRollNo,
          teamLeadPhone,
          members: [
            {
              userId: null, // This will be matched with users in the backend if possible
              rollNo: teamLeadRollNo,
              name: teamLeadName,
              branch: teamLeadBranch,
            },
            ...members.map((member) => ({
              userId: null,
              rollNo: member.rollNo,
              name: member.name,
              branch: member.branch,
            })),
          ],
        };
      } else {
        // Workshop or Internship (individual registration)
        requestData = {
          projectId: project._id,
          teamLeadId: student._id,
          teamLeadName,
          teamLeadRollNo,
          teamLeadPhone,
          members: [
            {
              userId: student._id,
              rollNo: teamLeadRollNo,
              name: teamLeadName,
              branch: teamLeadBranch,
            },
          ],
        };
      }

      const response = await axios.post(`${API_URL}/projects/register-team`, requestData);

      if (response.data && response.data.team) {
        Alert.alert(
          "Success",
          `Registration successful! Your team ID is ${response.data.team.teamId}`,
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("StudentDashboard", { student }),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert(
          "Error",
          "Failed to register. Please try again later."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {isTeamProject ? "Team Registration" : "Registration"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.projectCard}>
          <Text style={styles.projectId}>{project.projectId}</Text>
          <Text style={styles.projectName}>{project.name}</Text>
        </View>

        <Text style={styles.sectionTitle}>Team Lead Information</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={teamLeadName}
            onChangeText={setTeamLeadName}
            placeholder="Full Name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Roll Number</Text>
          <TextInput
            style={styles.input}
            value={teamLeadRollNo}
            onChangeText={setTeamLeadRollNo}
            placeholder="Roll Number"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={teamLeadPhone}
            onChangeText={setTeamLeadPhone}
            placeholder="10-digit Phone Number"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Branch</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={teamLeadBranch}
              onValueChange={(value) => setTeamLeadBranch(value)}
              style={styles.picker}
            >
              <Picker.Item label="CSE" value="CSE" />
              <Picker.Item label="IT" value="IT" />
              <Picker.Item label="ECE" value="ECE" />
              <Picker.Item label="EEE" value="EEE" />
              <Picker.Item label="MECH" value="MECH" />
              <Picker.Item label="CIVIL" value="CIVIL" />
            </Picker>
          </View>
        </View>

        {isTeamProject && (
          <>
            <Text style={styles.sectionTitle}>Team Members</Text>
            <Text style={styles.noteText}>
              Please ensure all team members are registered in the system.
            </Text>

            {members.map((member, index) => (
              <View key={index} style={styles.memberCard}>
                <Text style={styles.memberTitle}>Team Member {index + 1}</Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Roll Number</Text>
                  <TextInput
                    style={styles.input}
                    value={member.rollNo}
                    onChangeText={(value) => updateMember(index, "rollNo", value)}
                    placeholder="Roll Number"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={member.name}
                    onChangeText={(value) => updateMember(index, "name", value)}
                    placeholder="Full Name"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Branch</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={member.branch}
                      onValueChange={(value) => updateMember(index, "branch", value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="CSE" value="CSE" />
                      <Picker.Item label="IT" value="IT" />
                      <Picker.Item label="ECE" value="ECE" />
                      <Picker.Item label="EEE" value="EEE" />
                      <Picker.Item label="MECH" value="MECH" />
                      <Picker.Item label="CIVIL" value="CIVIL" />
                    </Picker>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>SUBMIT REGISTRATION</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  projectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  projectId: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "bold",
  },
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },
  noteText: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 15,
    fontStyle: "italic",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333333",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  memberCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  memberTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2196F3",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TeamRegistration;