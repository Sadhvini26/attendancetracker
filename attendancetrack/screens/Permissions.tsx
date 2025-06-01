import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";

/** ————————————————
 *  1. Adjust this URL to match your backend’s address.
 *  If you’re testing on a physical device/emulator, be sure to
 *  use your machine’s local network IP (e.g. 192.168.x.x),
 *  or an ngrok/tunnel address if you’re exposing localhost.
 */
const BASE_URL = "http://192.168.149.239:3000/api/permissions";

interface PermissionRequest {
  _id?: string;            // MongoDB’s auto‐generated ID
  name: string;
  role: "student";
  reason: string;
  letter: string;
  status: "new" | "approved" | "rejected";
  date: string;            // "YYYY-MM-DD"
  duration: string;        // e.g. "Half day"
  createdAt?: string;      // timestamps from backend (optional)
  updatedAt?: string;
}

const REASON_OPTIONS = [
  "Medical",
  "Personal",
  "Competition",
  "Conference",
  "Other",
];
const DURATION_OPTIONS = [
  "Half day",
  "Full day",
  "2 days",
  "3 days",
  "More than 3 days",
];

const StudentPermissions = () => {
  /** ——————————————————————————————
   *  Tabs: "request" to show the “New Request” button,
   *  "history" to list fetched requests from backend.
   */
  const route=useRoute()
  const [activeTab, setActiveTab] = useState<"request" | "history">("request");
  const {student}=route?.params
  // Modal visibility for the "New Request" form
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Whether to show the dropdown menus
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  /** ——————————————————————————————————
   *  This state holds the list of requests fetched from MongoDB.
   *  We initialize as an empty array—backend will populate it.
   */
  const [myRequests, setMyRequests] = useState<PermissionRequest[]>([]);

  /** ——————————————————————————————————————————————————
   *  Form state for creating a new permission request.
   *  We default reason & duration to the first options in each dropdown.
   */
  const [newRequest, setNewRequest] = useState({
    reason: REASON_OPTIONS[0],
    letter: "",
    date: "",
    duration: DURATION_OPTIONS[0],
  });

  /** ——————————————————————————————————————————————————————————————————
   *  Whenever the user switches to the "history" tab, fetch all requests
   *  from the backend. You could also fetch on component mount (use []),
   *  but this approach re‐fetches every time they switch to “History”.
   */
  useEffect(() => {
    if (activeTab === "history") {
      fetch(`${BASE_URL}/${student?.username}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Server responded ${res.status}`);
          }
          return res.json();
        })
        .then((data: PermissionRequest[]) => {
          // Sort newest first (optional)
          const sorted = data.sort((a, b) => {
            // Compare timestamp if available, otherwise string‐compare date
            const dateA = a.createdAt
              ? new Date(a.createdAt)
              : new Date(a.date);
            const dateB = b.createdAt
              ? new Date(b.createdAt)
              : new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          });
          setMyRequests(sorted);
        })
        .catch((err) => {
          console.error("Failed to fetch permissions:", err);
          Alert.alert(
            "Error",
            "Could not load permission history. Please try again later."
          );
        });
    }
  }, [activeTab]);

  /** ——————————————————————————————————————————————
   *  Update a single field in the `newRequest` form.
   */
  const handleInputChange = (field: string, value: string) => {
    setNewRequest({
      ...newRequest,
      [field]: value,
    });
  };

  /** ——————————————————————————————————————————————————————————————————
   *  Called when the user taps “Submit” in the modal. This:
   *    1) Validates that `letter` and `date` are nonempty.
   *    2) Sends a POST to /api/permissions with name, role, reason, letter, date, duration.
   *    3) On success, prepends the new request to local state and closes modal.
   */
  const submitRequest = () => {
    if (!newRequest.letter || !newRequest.date) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Build payload: in real app, “name” would come from your auth context/token
    const payload: PermissionRequest = {
      name: student?.username,
      role: "student",
      reason: newRequest.reason,
      letter: newRequest.letter,
      status: "new",
      date: newRequest.date,
      duration: newRequest.duration,
    };

    fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If you have a JWT token, add it here:
        // Authorization: `Bearer ${yourAuthToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        } else {
          return res.json().then((errObj) => {
            throw new Error(
              errObj.message || `Server returned ${res.status}`
            );
          });
        }
      })
      .then((created: PermissionRequest) => {
        // Prepend the newly created request (so newest is on top).
        setMyRequests([created, ...myRequests]);

        // Reset form and close modal
        setNewRequest({
          reason: REASON_OPTIONS[0],
          letter: "",
          date: "",
          duration: DURATION_OPTIONS[0],
        });
        setIsModalVisible(false);

        Alert.alert("Success", "Your permission request has been submitted.");
      })
      .catch((err) => {
        console.error("Submit failed:", err);
        Alert.alert("Error", "Failed to submit request. Try again later.");
      });
  };

  /** ——————————————————————————————————————————————
   *  Returns a style object to color the status text.
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return styles.approved;
      case "rejected":
        return styles.rejected;
      default:
        return styles.new;
    }
  };

  /** —————————————————————————————————————————————————————————————
   *  A small custom dropdown component for "reason" or "duration".
   */
  const CustomDropdown = ({
    options,
    selectedValue,
    onSelect,
    isVisible,
    setIsVisible,
    placeholder,
  }: {
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    isVisible: boolean;
    setIsVisible: (v: boolean) => void;
    placeholder: string;
  }) => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsVisible(!isVisible)}
        >
          <Text>{selectedValue || placeholder}</Text>
        </TouchableOpacity>

        {isVisible && (
          <View style={styles.dropdownList}>
            <ScrollView nestedScrollEnabled={true}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelect(option);
                    setIsVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedValue === option && styles.dropdownItemSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Permissions</Text>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "request" && styles.activeTab]}
          onPress={() => setActiveTab("request")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "request" && styles.activeTabText,
            ]}
          >
            Request
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* ———————————— Request Tab Content —————————————— */}
      {activeTab === "request" && (
        <View style={styles.tabContent}>
          <Text style={styles.description}>
            Submit a new permission request for leave or absence.
          </Text>
          <TouchableOpacity
            style={styles.newRequestButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.buttonText}>New Request</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ————————————— History Tab Content —————————————— */}
      {activeTab === "history" && (
        <ScrollView style={styles.tabContent}>
          {myRequests.length > 0 ? (
            myRequests.map((req) => (
              <View key={req._id || req.date} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestDate}>{req.date}</Text>
                  <Text
                    style={[
                      styles.requestStatus,
                      getStatusColor(req.status),
                    ]}
                  >
                    {req.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.requestReason}>
                  Reason: {req.reason}
                </Text>
                <Text style={styles.requestDuration}>
                  Duration: {req.duration}
                </Text>
                <Text style={styles.requestLetter} numberOfLines={2}>
                  {req.letter}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noRequests}>No permission requests yet</Text>
          )}
        </ScrollView>
      )}

      {/* ————————————— New Request Modal —————————————— */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Permission Request</Text>

            {/* Form Fields */}
            <Text style={styles.label}>Reason:</Text>
            <CustomDropdown
              options={REASON_OPTIONS}
              selectedValue={newRequest.reason}
              onSelect={(value) => handleInputChange("reason", value)}
              isVisible={showReasonDropdown}
              setIsVisible={setShowReasonDropdown}
              placeholder="Select reason"
            />

            <Text style={styles.label}>Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={newRequest.date}
              onChangeText={(text) => handleInputChange("date", text)}
            />

            <Text style={styles.label}>Duration:</Text>
            <CustomDropdown
              options={DURATION_OPTIONS}
              selectedValue={newRequest.duration}
              onSelect={(value) => handleInputChange("duration", value)}
              isVisible={showDurationDropdown}
              setIsVisible={setShowDurationDropdown}
              placeholder="Select duration"
            />

            <Text style={styles.label}>Explanation:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write your request details here..."
              multiline={true}
              numberOfLines={4}
              value={newRequest.letter}
              onChangeText={(text) => handleInputChange("letter", text)}
            />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitRequest}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 30,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  activeTab: {
    backgroundColor: "#000000",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
  },
  newRequestButton: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  requestCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  requestDate: {
    fontSize: 14,
    color: "#666",
  },
  requestStatus: {
    fontSize: 12,
    fontWeight: "bold",
  },
  requestReason: {
    fontSize: 16,
    fontWeight: "bold",
  },
  requestDuration: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  requestLetter: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
  },
  noRequests: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  new: { color: "#ff9800" },
  approved: { color: "#28a745" },
  rejected: { color: "#dc3545" },

  /** Modal styles */
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#888",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#000000",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },

  /** Dropdown styles */
  dropdownContainer: {
    position: "relative",
    marginBottom: 15,
    zIndex: 1, // Ensure the dropdown pops on top of other components
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    maxHeight: 150,
    zIndex: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  dropdownItemText: {
    fontSize: 14,
  },
  dropdownItemSelected: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default StudentPermissions;
