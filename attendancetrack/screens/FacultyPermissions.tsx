// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput, Alert } from "react-native";
// import Icon from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// interface LeaveRequest {
//   id: string;
//   name: string;
//   role: "student" | "faculty";
//   reason: string;
//   letter: string;
//   status: "new" | "approved" | "rejected";
// }

// const sampleStudentRequests: LeaveRequest[] = [
//   { id: "1", name: "Bhargavi", role: "student", reason: "Medical", letter: "I am not feeling well due to high fever. So, please grant me half day leave.", status: "new" },
//   { id: "2", name: "Sadhvini", role: "student", reason: "Conference", letter: "I have to attend a seminar organized by a big tech company.", status: "new" },
//   { id: "3", name: "Nandini", role: "student", reason: "Family Function", letter: "I need to attend my cousin's wedding ceremony.", status: "new" },
//   { id: "4", name: "Pranavi", role: "student", reason: "Medical", letter: "I have a doctor's appointment for my regular checkup.", status: "new" },
//   { id: "5", name: "Priya", role: "student", reason: "Project Work", letter: "I need to visit a company for my project research work.", status: "new" },
//   { id: "6", name: "Varshini", role: "student", reason: "Internship", letter: "I need to visit a company for my interview.", status: "new" },

// ];

// const FacultyPermissions = () => {
//   const [activeView, setActiveView] = useState<"student" | "myRequest">("student");
//   const [statusFilter, setStatusFilter] = useState<"new" | "approved" | "rejected">("new");
//   const [studentRequests, setStudentRequests] = useState<LeaveRequest[]>(sampleStudentRequests);
//   const [myRequests, setMyRequests] = useState<LeaveRequest[]>([]);
//   const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
//   const [showRequestModal, setShowRequestModal] = useState(false);
  
//   // Form fields for new request
//   const [reason, setReason] = useState("");
//   const [letter, setLetter] = useState("");
  
//   // Count of pending approvals
//   const pendingApprovals = studentRequests.filter(req => req.status === "new").length;
  
//   // Handle approving/rejecting student request
//   // Handle approving/rejecting student request
// const handleDecision = (id: string, decision: "approved" | "rejected") => {
//   setStudentRequests((prevRequests) => {
//     // Count APPROVED requests before updating (not new requests)
//     const currentApprovedCount = prevRequests.filter(req => req.status === "approved").length;

//     if (decision === "approved" && currentApprovedCount >= 5) {
//       Alert.alert("Maximum Approvals Reached", "You can approve a maximum of 5 requests.");
//       return prevRequests; // Return previous state without modifying
//     }

//     return prevRequests.map((req) =>
//       req.id === id ? { ...req, status: decision } : req
//     );
//   });

//   setSelectedRequest(null);
// };
  
  
//   // Submit new request to admin
//   const submitRequest = () => {
//     if (!reason.trim() || !letter.trim()) {
//       Alert.alert("Missing Information", "Please provide both reason and letter content.");
//       return;
//     }
    
//     const newRequest: LeaveRequest = {
//       id: Date.now().toString(),
//       name: "Faculty Name", // In a real app, this would come from user state
//       role: "faculty",
//       reason,
//       letter,
//       status: "new"
//     };
    
//     setMyRequests([newRequest, ...myRequests]);
//     setReason("");
//     setLetter("");
//     setShowRequestModal(false);
//     Alert.alert("Success", "Your request has been submitted to the admin.");
//   };
  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Permissions</Text>
      
//       {/* View Switcher */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeView === "student" && styles.activeTab]}
//           onPress={() => setActiveView("student")}
//         >
//           <Text style={[styles.tabText, activeView === "student" && styles.activeTabText]}>
//             Student Requests {pendingApprovals > 0 && `(${pendingApprovals})`}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.tab, activeView === "myRequest" && styles.activeTab]}
//           onPress={() => setActiveView("myRequest")}
//         >
//           <Text style={[styles.tabText, activeView === "myRequest" && styles.activeTabText]}>My Requests</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Show appropriate view based on selection */}
//       {activeView === "student" ? (
//         <>
//           {/* Status Filter Buttons for Student Requests */}
//           <View style={styles.filterContainer}>
//             {["new", "approved", "rejected"].map((status) => (
//               <TouchableOpacity
//                 key={status}
//                 style={[styles.filterButton, statusFilter === status && styles.activeFilter]}
//                 onPress={() => setStatusFilter(status as "new" | "approved" | "rejected")}
//               >
//                 <Text style={[styles.filterText, statusFilter === status && styles.activeFilterText]}>
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
          
//           {/* Approval Limit Warning */}
//           {statusFilter === "new" && (
//             <View style={styles.warningBox}>
//               <Text style={styles.warningText}>
//                 You can approve a maximum of 5 requests 
//                 (Approved so far: {studentRequests.filter(req => req.status === "approved").length})
//               </Text>
//             </View>
//           )}
          
//           {/* Student Requests List */}
//           <FlatList
//             data={studentRequests.filter(req => req.status === statusFilter)}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <TouchableOpacity style={styles.requestCard} onPress={() => setSelectedRequest(item)}>
//                 <Text style={styles.requestName}>{item.name}</Text>
//                 <Text style={styles.requestReason}>{item.reason}</Text>
//                 <Text style={[styles.requestStatus, styles[item.status]]}>{item.status}</Text>
//               </TouchableOpacity>
//             )}
//             ListEmptyComponent={<Text style={styles.noRequests}>No {statusFilter} requests</Text>}
//           />
//         </>
//       ) : (
//         <>
//           {/* My Requests View */}
//           <TouchableOpacity 
//             style={styles.newRequestButton} 
//             onPress={() => setShowRequestModal(true)}
//           >
//             <Text style={styles.newRequestButtonText}>Request New Permission</Text>
//           </TouchableOpacity>
          
//           <FlatList
//             data={myRequests}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.requestCard}>
//                 <View style={styles.requestHeader}>
//                   <Text style={styles.requestName}>Permission to Admin</Text>
//                   <Text style={[styles.requestStatus, styles[item.status]]}>{item.status}</Text>
//                 </View>
//                 <Text style={styles.requestReason}><Text style={styles.bold}>Reason:</Text> {item.reason}</Text>
//                 <Text style={styles.requestLetter} numberOfLines={2}>{item.letter}</Text>
//               </View>
//             )}
//             ListEmptyComponent={<Text style={styles.noRequests}>No requests submitted yet</Text>}
//           />
//         </>
//       )}

//       {/* Modal for Student Leave Request Details */}
//       <Modal visible={!!selectedRequest} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             {selectedRequest && (
//               <>
//                 <Text style={styles.modalTitle}>{selectedRequest.name}</Text>
//                 <Text style={styles.modalText}><Text style={styles.bold}>Reason:</Text> {selectedRequest.reason}</Text>
//                 <Text style={styles.modalText}><Text style={styles.bold}>Letter:</Text> {selectedRequest.letter}</Text>

//                 {/* Approve/Reject Buttons */}
//                 {selectedRequest.status === "new" && (
//                   <View style={styles.buttonContainer}>
//                     <TouchableOpacity 
//                       style={styles.approveButton} 
//                       onPress={() => handleDecision(selectedRequest.id, "approved")}
//                     >
//                       <Text style={styles.buttonText}>Approve</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity 
//                       style={styles.rejectButton} 
//                       onPress={() => handleDecision(selectedRequest.id, "rejected")}
//                     >
//                       <Text style={styles.buttonText}>Reject</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}

//                 <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedRequest(null)}>
//                   <Text style={styles.closeButtonText}>Close</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
      
//       {/* Modal for Creating New Request */}
//       <Modal visible={showRequestModal} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Request Permission from Admin</Text>
            
//             <Text style={styles.inputLabel}>Reason:</Text>
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.input}
//                 value={reason}
//                 onChangeText={setReason}
//                 placeholder="Enter reason for leave"
//               />
//             </View>
            
//             <Text style={styles.inputLabel}>Letter:</Text>
//             <View style={styles.textareaContainer}>
//               <TextInput
//                 style={styles.textarea}
//                 value={letter}
//                 onChangeText={setLetter}
//                 placeholder="Write your leave request details here"
//                 multiline={true}
//                 numberOfLines={5}
//               />
//             </View>
            
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity 
//                 style={styles.submitButton} 
//                 onPress={submitRequest}
//               >
//                 <Text style={styles.buttonText}>Submit Request</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.cancelButton} 
//                 onPress={() => setShowRequestModal(false)}
//               >
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     padding: 20, 
//     backgroundColor: "#f8f8f8" 
//   },
//   title: { 
//     fontSize: 24, 
//     fontWeight: 'bold', 
//     marginTop: 30,
//     marginBottom: 20, 
//     textAlign: 'center'
//   },
//   tabContainer: { 
//     flexDirection: "row", 
//     justifyContent: "space-around", 
//     marginBottom: 15 
//   },
//   tab: { 
//     paddingVertical: 10, 
//     paddingHorizontal: 20, 
//     borderRadius: 20, 
//     backgroundColor: "#ddd",
//     flex: 1,
//     marginHorizontal: 5,
//     alignItems: 'center'
//   },
//   activeTab: { 
//     backgroundColor: "#000000" 
//   },
//   tabText: { 
//     fontSize: 16, 
//     color: "#333" 
//   },
//   activeTabText: { 
//     color: "#fff", 
//     fontWeight: "bold" 
//   },
//   filterContainer: { 
//     flexDirection: "row", 
//     justifyContent: "space-around", 
//     marginBottom: 15 
//   },
//   filterButton: { 
//     paddingVertical: 8, 
//     paddingHorizontal: 20, 
//     borderRadius: 15, 
//     backgroundColor: "#ddd" 
//   },
//   activeFilter: { 
//     backgroundColor: "#000000" 
//   },
//   filterText: { 
//     fontSize: 14, 
//     color: "#333" 
//   },
//   activeFilterText: { 
//     color: "#fff", 
//     fontWeight: "bold" 
//   },
//   warningBox: {
//     backgroundColor: "#fff3cd",
//     borderColor: "#ffecb5",
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15
//   },
//   warningText: {
//     color: "#856404",
//     fontSize: 14,
//     textAlign: "center"
//   },
//   newRequestButton: { 
//     backgroundColor: "#000000", 
//     padding: 12, 
//     borderRadius: 10, 
//     alignItems: "center", 
//     marginBottom: 15
//   },
//   newRequestButtonText: { 
//     color: "#fff", 
//     fontWeight: "bold", 
//     fontSize: 16 
//   },
//   requestCard: { 
//     backgroundColor: "#fff", 
//     padding: 15, 
//     marginBottom: 10, 
//     borderRadius: 10, 
//     elevation: 3 
//   },
//   requestHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 5
//   },
//   requestName: { 
//     fontSize: 18, 
//     fontWeight: "bold" 
//   },
//   requestReason: { 
//     fontSize: 14, 
//     color: "#666", 
//     marginBottom: 5 
//   },
//   requestLetter: { 
//     fontSize: 14, 
//     color: "#666", 
//     fontStyle: "italic" 
//   },
//   requestStatus: { 
//     fontSize: 12, 
//     fontWeight: "bold", 
//     textAlign: "right" 
//   },
//   new: { color: "#ff9800" },
//   approved: { color: "#28a745" },
//   rejected: { color: "#dc3545" },
//   noRequests: { 
//     textAlign: "center", 
//     color: "#666", 
//     marginTop: 20, 
//     fontSize: 16 
//   },
//   modalContainer: { 
//     flex: 1, 
//     justifyContent: "center", 
//     alignItems: "center", 
//     backgroundColor: "rgba(0,0,0,0.5)" 
//   },
//   modalContent: { 
//     width: "90%", 
//     backgroundColor: "#fff", 
//     padding: 20, 
//     borderRadius: 10 
//   },
//   modalTitle: { 
//     fontSize: 20, 
//     fontWeight: "bold", 
//     marginBottom: 15 
//   },
//   modalText: { 
//     fontSize: 16, 
//     marginBottom: 10 
//   },
//   bold: { 
//     fontWeight: "bold" 
//   },
//   inputLabel: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//     marginTop: 10
//   },
//   inputContainer: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 5,
//     marginBottom: 10
//   },
//   input: {
//     padding: 10,
//     fontSize: 16
//   },
//   textareaContainer: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 5,
//     marginBottom: 15
//   },
//   textarea: {
//     padding: 10,
//     fontSize: 16,
//     textAlignVertical: "top",
//     minHeight: 100
//   },
//   buttonContainer: { 
//     flexDirection: "row", 
//     justifyContent: "space-between", 
//     marginTop: 20 
//   },
//   approveButton: { 
//     backgroundColor: "#28a745", 
//     padding: 12, 
//     borderRadius: 5, 
//     flex: 1, 
//     marginRight: 5 
//   },
//   rejectButton: { 
//     backgroundColor: "#dc3545", 
//     padding: 12, 
//     borderRadius: 5, 
//     flex: 1, 
//     marginLeft: 5 
//   },
//   submitButton: {
//     backgroundColor: "#007bff",
//     padding: 12,
//     borderRadius: 5,
//     flex: 1,
//     marginRight: 5
//   },
//   cancelButton: {
//     backgroundColor: "#6c757d",
//     padding: 12,
//     borderRadius: 5,
//     flex: 1,
//     marginLeft: 5
//   },
//   buttonText: { 
//     textAlign: "center", 
//     color: "#fff", 
//     fontWeight: "bold" 
//   },
//   closeButton: { 
//     marginTop: 10, 
//     backgroundColor: "#888", 
//     padding: 10, 
//     borderRadius: 5, 
//     alignItems: "center" 
//   },
//   closeButtonText: { 
//     color: "#fff", 
//     fontWeight: "bold" 
//   },
// });

// export default FacultyPermissions;
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const BASE_URL = "http://192.168.149.239:3000/api/permissions";

interface LeaveRequest {
  _id?: string;
  id?: string;
  name: string;
  role: "student" | "faculty";
  reason: string;
  letter: string;
  status: "new" | "approved" | "rejected";
  date?: string;
  duration?: string;
  createdAt?: string;
  updatedAt?: string;
}

const sampleStudentRequests: LeaveRequest[] = [
  { id: "1", name: "Bhargavi", role: "student", reason: "Medical", letter: "I am not feeling well due to high fever. So, please grant me half day leave.", status: "new" },
  { id: "2", name: "Sadhvini", role: "student", reason: "Conference", letter: "I have to attend a seminar organized by a big tech company.", status: "new" },
  { id: "3", name: "Nandini", role: "student", reason: "Family Function", letter: "I need to attend my cousin's wedding ceremony.", status: "new" },
  { id: "4", name: "Pranavi", role: "student", reason: "Medical", letter: "I have a doctor's appointment for my regular checkup.", status: "new" },
  { id: "5", name: "Priya", role: "student", reason: "Project Work", letter: "I need to visit a company for my project research work.", status: "new" },
  { id: "6", name: "Varshini", role: "student", reason: "Internship", letter: "I need to visit a company for my interview.", status: "new" },
];

const FacultyPermissions = () => {
  const [activeView, setActiveView] = useState<"student" | "myRequest">("student");
  const [statusFilter, setStatusFilter] = useState<"new" | "approved" | "rejected">("new");
  const [studentRequests, setStudentRequests] = useState<LeaveRequest[]>(sampleStudentRequests);
  const [myRequests, setMyRequests] = useState<LeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Form fields for new request
  const [reason, setReason] = useState("");
  const [letter, setLetter] = useState("");
  
  // Count of pending approvals
  const pendingApprovals = studentRequests.filter(req => req.status === "new").length;
  
  // Fetch student requests from backend
  useEffect(() => {
    if (activeView === "student") {
      fetch(`${BASE_URL}/`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Server responded ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          // Filter only student requests and sort newest first
          const studentData = data.filter(req => req.role === "student");
          const sorted = studentData.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.date);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          });
          setStudentRequests(sorted);
        })
        .catch((err) => {
          console.error("Failed to fetch student requests:", err);
          Alert.alert(
            "Error",
            "Could not load student requests. Please try again later."
          );
        });
    }
  }, [activeView]);
  
  // Handle approving/rejecting student request
  const handleDecision = async (id: string, decision: "approved" | "rejected") => {
  try {
    // Check approval limit before making API call
    const currentApprovedCount = studentRequests.filter(req => req.status === "approved").length;
    
    if (decision === "approved" && currentApprovedCount >= 5) {
      Alert.alert("Maximum Approvals Reached", "You can approve a maximum of 5 requests.");
      return;
    }

    // Make API call to update status in database
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: decision }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server responded with ${response.status}`);
    }

    const updatedRequest = await response.json();

    // Update local state after successful API call
    setStudentRequests((prevRequests) =>
      prevRequests.map((req) =>
        (req.id === id || req._id === id) ? { ...req, status: decision } : req
      )
    );

    setSelectedRequest(null);
    
    Alert.alert(
      "Success", 
      `Request has been ${decision === "approved" ? "approved" : "rejected"} successfully.`
    );

  } catch (error) {
    console.error("Error updating request:", error);
    Alert.alert(
      "Error", 
      `Failed to ${decision === "approved" ? "approve" : "reject"} request. Please try again.`
    );
  }
};
  
  // Submit new request to admin
  const submitRequest = () => {
    if (!reason.trim() || !letter.trim()) {
      Alert.alert("Missing Information", "Please provide both reason and letter content.");
      return;
    }
    
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      name: "Faculty Name", // In a real app, this would come from user state
      role: "faculty",
      reason,
      letter,
      status: "new"
    };
    
    setMyRequests([newRequest, ...myRequests]);
    setReason("");
    setLetter("");
    setShowRequestModal(false);
    Alert.alert("Success", "Your request has been submitted to the admin.");
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permissions</Text>
      
      {/* View Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeView === "student" && styles.activeTab]}
          onPress={() => setActiveView("student")}
        >
          <Text style={[styles.tabText, activeView === "student" && styles.activeTabText]}>
            Student Requests {pendingApprovals > 0 && `(${pendingApprovals})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeView === "myRequest" && styles.activeTab]}
          onPress={() => setActiveView("myRequest")}
        >
          <Text style={[styles.tabText, activeView === "myRequest" && styles.activeTabText]}>My Requests</Text>
        </TouchableOpacity>
      </View>

      {/* Show appropriate view based on selection */}
      {activeView === "student" ? (
        <>
          {/* Status Filter Buttons for Student Requests */}
          <View style={styles.filterContainer}>
            {["new", "approved", "rejected"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.filterButton, statusFilter === status && styles.activeFilter]}
                onPress={() => setStatusFilter(status as "new" | "approved" | "rejected")}
              >
                <Text style={[styles.filterText, statusFilter === status && styles.activeFilterText]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Approval Limit Warning */}
          {statusFilter === "new" && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                You can approve a maximum of 5 requests 
                (Approved so far: {studentRequests.filter(req => req.status === "approved").length})
              </Text>
            </View>
          )}
          
          {/* Student Requests List */}
          <FlatList
            data={studentRequests.filter(req => req.status === statusFilter)}
            keyExtractor={(item) => item._id || item.id || item.name}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.requestCard} onPress={() => setSelectedRequest(item)}>
                <Text style={styles.requestName}>{item.name}</Text>
                <Text style={styles.requestReason}>{item.reason}</Text>
                <Text style={[styles.requestStatus, styles[item.status]]}>{item.status}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.noRequests}>No {statusFilter} requests</Text>}
          />
        </>
      ) : (
        <>
          {/* My Requests View */}
          <TouchableOpacity 
            style={styles.newRequestButton} 
            onPress={() => setShowRequestModal(true)}
          >
            <Text style={styles.newRequestButtonText}>Request New Permission</Text>
          </TouchableOpacity>
          
          <FlatList
            data={myRequests}
            keyExtractor={(item) => item._id || item.id || item.name}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestName}>Permission to Admin</Text>
                  <Text style={[styles.requestStatus, styles[item.status]]}>{item.status}</Text>
                </View>
                <Text style={styles.requestReason}><Text style={styles.bold}>Reason:</Text> {item.reason}</Text>
                <Text style={styles.requestLetter} numberOfLines={2}>{item.letter}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.noRequests}>No requests submitted yet</Text>}
          />
        </>
      )}

      {/* Modal for Student Leave Request Details */}
      <Modal visible={!!selectedRequest} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedRequest && (
              <>
                <Text style={styles.modalTitle}>{selectedRequest.name}</Text>
                <Text style={styles.modalText}><Text style={styles.bold}>Reason:</Text> {selectedRequest.reason}</Text>
                <Text style={styles.modalText}><Text style={styles.bold}>Letter:</Text> {selectedRequest.letter}</Text>

                {/* Approve/Reject Buttons */}
                {selectedRequest.status === "new" && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={styles.approveButton} 
                      onPress={() => handleDecision(selectedRequest._id || selectedRequest.id, "approved")}
                    >
                      <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.rejectButton} 
                      onPress={() => handleDecision(selectedRequest._id || selectedRequest.id, "rejected")}
                    >
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedRequest(null)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Modal for Creating New Request */}
      <Modal visible={showRequestModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Permission from Admin</Text>
            
            <Text style={styles.inputLabel}>Reason:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={reason}
                onChangeText={setReason}
                placeholder="Enter reason for leave"
              />
            </View>
            
            <Text style={styles.inputLabel}>Letter:</Text>
            <View style={styles.textareaContainer}>
              <TextInput
                style={styles.textarea}
                value={letter}
                onChangeText={setLetter}
                placeholder="Write your leave request details here"
                multiline={true}
                numberOfLines={5}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={submitRequest}
              >
                <Text style={styles.buttonText}>Submit Request</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
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
    backgroundColor: "#f8f8f8" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 30,
    marginBottom: 20, 
    textAlign: 'center'
  },
  tabContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: 15 
  },
  tab: { 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20, 
    backgroundColor: "#ddd",
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  activeTab: { 
    backgroundColor: "#000000" 
  },
  tabText: { 
    fontSize: 16, 
    color: "#333" 
  },
  activeTabText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  filterContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: 15 
  },
  filterButton: { 
    paddingVertical: 8, 
    paddingHorizontal: 20, 
    borderRadius: 15, 
    backgroundColor: "#ddd" 
  },
  activeFilter: { 
    backgroundColor: "#000000" 
  },
  filterText: { 
    fontSize: 14, 
    color: "#333" 
  },
  activeFilterText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    borderColor: "#ffecb5",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
    textAlign: "center"
  },
  newRequestButton: { 
    backgroundColor: "#000000", 
    padding: 12, 
    borderRadius: 10, 
    alignItems: "center", 
    marginBottom: 15
  },
  newRequestButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  requestCard: { 
    backgroundColor: "#fff", 
    padding: 15, 
    marginBottom: 10, 
    borderRadius: 10, 
    elevation: 3 
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5
  },
  requestName: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  requestReason: { 
    fontSize: 14, 
    color: "#666", 
    marginBottom: 5 
  },
  requestLetter: { 
    fontSize: 14, 
    color: "#666", 
    fontStyle: "italic" 
  },
  requestStatus: { 
    fontSize: 12, 
    fontWeight: "bold", 
    textAlign: "right" 
  },
  new: { color: "#ff9800" },
  approved: { color: "#28a745" },
  rejected: { color: "#dc3545" },
  noRequests: { 
    textAlign: "center", 
    color: "#666", 
    marginTop: 20, 
    fontSize: 16 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    width: "90%", 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 10 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 15 
  },
  modalText: { 
    fontSize: 16, 
    marginBottom: 10 
  },
  bold: { 
    fontWeight: "bold" 
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10
  },
  input: {
    padding: 10,
    fontSize: 16
  },
  textareaContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15
  },
  textarea: {
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100
  },
  buttonContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 20 
  },
  approveButton: { 
    backgroundColor: "#28a745", 
    padding: 12, 
    borderRadius: 5, 
    flex: 1, 
    marginRight: 5 
  },
  rejectButton: { 
    backgroundColor: "#dc3545", 
    padding: 12, 
    borderRadius: 5, 
    flex: 1, 
    marginLeft: 5 
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5
  },
  buttonText: { 
    textAlign: "center", 
    color: "#fff", 
    fontWeight: "bold" 
  },
  closeButton: { 
    marginTop: 10, 
    backgroundColor: "#888", 
    padding: 10, 
    borderRadius: 5, 
    alignItems: "center" 
  },
  closeButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});

export default FacultyPermissions;