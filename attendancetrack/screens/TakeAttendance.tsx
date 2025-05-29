
// import React, { useState, useMemo, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";

// type Faculty = {
//   name: string;
//   _id: string;
// };

// type RootStackParamList = {
//   TakeAttendance: { faculty: Faculty };
// };

// type TakeAttendanceRouteProp = RouteProp<RootStackParamList, 'TakeAttendance'>;

// const API_URL = "http://192.168.231.239:3000/api";

// const TakeAttendance = () => {
//   const route = useRoute<TakeAttendanceRouteProp>();
//   const { faculty } = route.params;
//   const facultyId = faculty?._id;
//   const navigation = useNavigation();
//   console.log(facultyId);
  
//   // 2D array of student roll numbers from API
//   const [studentRolls, setStudentRolls] = useState<string[][]>([]);
//   const [studentStatus, setStudentStatus] = useState<Record<string, number>>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         console.log('Starting fetch for faculty ID:', facultyId);
        
//         const token = await AsyncStorage.getItem('authToken');
//         console.log('Retrieved token:', token ? 'Token exists' : 'No token found');
        
//         if (!token) {
//           Alert.alert('Error', 'You are not logged in');
//           setLoading(false);
//           return;
//         }
        
//         const url = `${API_URL}/faculty/${facultyId}/students`;
//         console.log('Making request to:', url);
        
//         const response = await axios.get(url, {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         console.log('✅ SUCCESS - Response status:', response.status);
//         console.log('✅ Response data:', response.data);
        
//         if (response.data && response.data.rollNumbers) {
//           console.log('✅ Roll numbers found:', response.data.rollNumbers);
          
//           // If rollNumbers is a flat array, convert it to 2D array (chunks of 5)
//           const rollNumbers = response.data.rollNumbers;
//           if (Array.isArray(rollNumbers) && rollNumbers.length > 0) {
//             // Check if it's already 2D or needs to be chunked
//             if (Array.isArray(rollNumbers[0])) {
//               setStudentRolls(rollNumbers);
//             } else {
//               // Convert flat array to 2D array (chunks of 5)
//               const chunked = [];
//               for (let i = 0; i < rollNumbers.length; i += 5) {
//                 chunked.push(rollNumbers.slice(i, i + 5));
//               }
//               setStudentRolls(chunked);
//             }
//           }
//         } else {
//           console.log('⚠️ No rollNumbers in response data');
//           Alert.alert('Info', 'No students found for this faculty');
//         }
//       } catch (error) {
//         console.log('❌ ERROR CAUGHT');
//         console.error('❌ Full error:', error);
        
//         let errorMessage = 'Failed to load students';
        
//         if (axios.isAxiosError(error)) {
//           console.error('❌ Axios error response:', error.response);
//           console.error('❌ Status:', error.response?.status);
//           console.error('❌ Data:', error.response?.data);
          
//           if (error.response?.status === 401) {
//             errorMessage = 'Authentication failed. Please login again.';
//           } else if (error.response?.status === 404) {
//             errorMessage = 'Faculty or students not found';
//           } else if (error.response?.data?.message) {
//             errorMessage = error.response.data.message;
//           }
//         }
        
//         Alert.alert('Error', errorMessage);
//       } finally {
//         console.log('🏁 Request completed, setting loading to false');
//         setLoading(false);
//       }
//     };

//     if (facultyId) {
//       fetchStudents();
//     } else {
//       console.error('❌ No faculty ID provided');
//       Alert.alert('Error', 'Faculty information is missing');
//       setLoading(false);
//     }
//   }, [facultyId]);

//   // Initialize studentStatus whenever studentRolls changes
//   useEffect(() => {
//     if (studentRolls.length === 0) return;

//     // Get all actual roll numbers from the fetched data
//     const allRollNumbers = studentRolls.flat();
    
//     // Initialize all students as absent (status = 2)
//     const initialStatus = Object.fromEntries(
//       allRollNumbers.map(roll => [roll, 2])
//     );

//     // FIXED: Only apply overrides for students that actually exist
//     // Remove this section entirely if you want all students to start as absent
//     const sampleOverrides = {
//       "542": 1, "543": 1, "545": 1, "546": 1,
//       "54D": 1, "54E": 1, "54H": 1, "54K": 1,
//       "54M": 1, "54Z": 1, "553": 1, "558": 1,
//       "55A": 1, "55D": 1, "55H": 1, "55M": 1,
//       "5K5": 1, "5K6": 1, "L15": 1,
//     };

//     // Only apply overrides for students that exist in the actual data
//     const validOverrides = {};
//     Object.entries(sampleOverrides).forEach(([rollNumber, status]) => {
//       if (allRollNumbers.includes(rollNumber)) {
//         validOverrides[rollNumber] = status;
//       }
//     });

//     console.log('All roll numbers:', allRollNumbers);
//     console.log('Valid overrides applied:', validOverrides);

//     setStudentStatus({ ...initialStatus, ...validOverrides });
//   }, [studentRolls]);

//   const attendanceStats = useMemo(() => {
//     // Only count students that exist in the fetched data
//     const allRollNumbers = studentRolls.flat();
//     const totalStudents = allRollNumbers.length;
    
//     // Only count status for students that actually exist
//     const presentCount = allRollNumbers.filter(roll => studentStatus[roll] === 1).length;
//     const absentCount = totalStudents - presentCount;
//     const presentPercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

//     console.log('Attendance stats calculation:', {
//       totalStudents,
//       presentCount,
//       absentCount,
//       presentPercentage,
//       allRollNumbers,
//       studentStatus
//     });

//     return { totalStudents, presentCount, absentCount, presentPercentage };
//   }, [studentStatus, studentRolls]);

//   const getButtonColor = (roll: string) => {
//     return studentStatus[roll] === 1 ? "#28a745" : "#dc3545"; // Green = present, Red = absent
//   };

//   const toggleStatus = (roll: string) => {
//     setStudentStatus(prev => ({
//       ...prev,
//       [roll]: prev[roll] === 1 ? 2 : 1,
//     }));
//   };

//   const markAllPresent = () => {
//     const allPresent = {};
//     studentRolls.flat().forEach((roll) => (allPresent[roll] = 1));
//     setStudentStatus(allPresent);
//   };

//   const markAllAbsent = () => {
//     const allAbsent = {};
//     studentRolls.flat().forEach((roll) => (allAbsent[roll] = 2));
//     setStudentStatus(allAbsent);
//   };

//   const saveAttendance = async () => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
      
//       if (!token) {
//         Alert.alert('Error', 'You are not logged in');
//         return;
//       }

//       // Only include attendance for students that actually exist
//       const allRollNumbers = studentRolls.flat();
//       const attendanceRecords = allRollNumbers.map(rollNumber => ({
//         rollNumber,
//         status: studentStatus[rollNumber] === 1 ? 'present' : 'absent'
//       }));

//       const attendanceData = {
//         facultyId: facultyId,
//         attendanceRecords
//       };

//       console.log('Saving attendance data:', attendanceData);

//       const response = await axios.post(
//         `${API_URL}/attendance/save`,
//         attendanceData,
//         {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('Attendance saved successfully:', response.data);
      
//       Alert.alert(
//         "Success",
//         "Attendance data saved successfully!",
//         [{ text: "OK", onPress: () => navigation.navigate("FacultyDashboard" as never) }]
//       );
//     } catch (error) {
//       console.error('Error saving attendance:', error);
      
//       let errorMessage = 'Failed to save attendance';
//       if (axios.isAxiosError(error) && error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
      
//       Alert.alert('Error', errorMessage);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.loadingContainer]}>
//         <Text style={styles.loadingText}>Loading students...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.backButton}
//           accessibilityLabel="Go back"
//         >
//           <FontAwesome name="arrow-left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.title}>ATTENDANCE</Text>
//       </View>

//       {/* Faculty Info */}
//       <View style={styles.facultyInfo}>
//         <Text style={styles.facultyName}>Faculty: {faculty?.name || facultyId}</Text>
//       </View>

//       {/* Attendance Summary */}
//       <View style={styles.summaryContainer}>
//         <Text style={styles.summaryText}>
//           Present: {attendanceStats.presentCount}/{attendanceStats.totalStudents} ({attendanceStats.presentPercentage}%)
//         </Text>
//         <Text style={styles.summaryText}>
//           Absent: {attendanceStats.absentCount}/{attendanceStats.totalStudents} ({100 - attendanceStats.presentPercentage}%)
//         </Text>
//       </View>

//       {/* Student Roll Buttons */}
//       <ScrollView contentContainerStyle={styles.studentsContainer}>
//         {studentRolls.length > 0 ? (
//           studentRolls.map((row, rowIndex) => (
//             <View key={rowIndex} style={styles.row}>
//               {row.map((roll) => (
//                 <TouchableOpacity
//                   key={roll}
//                   style={[
//                     styles.studentButton, 
//                     { backgroundColor: getButtonColor(roll) }
//                   ]}
//                   onPress={() => toggleStatus(roll)}
//                   accessibilityLabel={`Student ${roll}, ${studentStatus[roll] === 1 ? 'present' : 'absent'}`}
//                   accessibilityHint="Double tap to toggle attendance status"
//                 >
//                   <Text style={styles.studentText}>{roll.slice(-3).toUpperCase()}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           ))
//         ) : (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No students found for this faculty</Text>
//           </View>
//         )}
//       </ScrollView>

//       {/* Action Buttons */}
//       {studentRolls.length > 0 && (
//         <>
//           <View style={styles.actions}>
//             <TouchableOpacity 
//               style={[styles.actionButton, { backgroundColor: "#28a745" }]} 
//               onPress={markAllPresent}
//               accessibilityLabel="Mark all students present"
//             >
//               <Text style={styles.buttonText}>MARK ALL PRESENT</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={[styles.actionButton, { backgroundColor: "#dc3545" }]} 
//               onPress={markAllAbsent}
//               accessibilityLabel="Mark all students absent"
//             >
//               <Text style={styles.buttonText}>MARK ALL ABSENT</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Save Button */}
//           <TouchableOpacity 
//             style={styles.saveButton} 
//             onPress={saveAttendance}
//             accessibilityLabel="Save attendance data"
//           >
//             <Text style={styles.saveButtonText}>DONE</Text>
//           </TouchableOpacity>
//         </>
//       )}

//       {/* Footer Navigation */}
//       <View style={styles.footer}>
//         <TouchableOpacity 
//           onPress={() => navigation.navigate("FacultyDashboard" as never)}
//           accessibilityLabel="Go to dashboard"
//         >
//           <FontAwesome name="home" size={24} color="white" />
//         </TouchableOpacity>
//         <TouchableOpacity 
//           onPress={() => navigation.navigate("FacultyDashboard" as never)}
//           accessibilityLabel="Go to profile"
//         >
//           <FontAwesome name="user" size={24} color="white" />
//         </TouchableOpacity>
//         <TouchableOpacity 
//           onPress={() => navigation.navigate("Settings" as never)}
//           accessibilityLabel="Go to settings"
//         >
//           <FontAwesome name="cog" size={24} color="white" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: "white" 
//   },
//   loadingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#888',
//   },
//   header: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     padding: 15, 
//     borderBottomWidth: 1, 
//     borderBottomColor: "#ddd", 
//     backgroundColor: "#f8f9fa", 
//     elevation: 1 
//   },
//   backButton: { 
//     marginRight: 10, 
//     padding: 5 
//   },
//   title: { 
//     fontSize: 18, 
//     fontWeight: "bold" 
//   },
//   facultyInfo: {
//     padding: 10,
//     backgroundColor: "#f8f9fa",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd"
//   },
//   facultyName: {
//     fontSize: 16,
//     color: "#333",
//     fontWeight: "500"
//   },
//   summaryContainer: { 
//     backgroundColor: "#f8f9fa", 
//     padding: 15, 
//     flexDirection: "row", 
//     justifyContent: "space-around", 
//     borderBottomWidth: 1, 
//     borderBottomColor: "#ddd" 
//   },
//   summaryText: { 
//     fontSize: 16, 
//     fontWeight: "500" 
//   },
//   studentsContainer: { 
//     padding: 15, 
//     alignItems: "center" 
//   },
//   row: { 
//     flexDirection: "row", 
//     marginBottom: 15, 
//     justifyContent: "center" 
//   },
//   studentButton: { 
//     width: 50, 
//     height: 50, 
//     marginHorizontal: 7, 
//     borderRadius: 6, 
//     justifyContent: "center", 
//     alignItems: "center" 
//   },
//   studentText: { 
//     color: "white", 
//     fontWeight: "bold" 
//   },
//   actions: { 
//     flexDirection: "row", 
//     justifyContent: "space-around", 
//     marginVertical: 15 
//   },
//   actionButton: { 
//     paddingHorizontal: 20, 
//     paddingVertical: 10, 
//     borderRadius: 6 
//   },
//   buttonText: { 
//     color: "white", 
//     fontWeight: "bold" 
//   },
//   saveButton: { 
//     backgroundColor: "#007bff", 
//     padding: 15, 
//     marginHorizontal: 15, 
//     borderRadius: 6, 
//     alignItems: "center", 
//     marginBottom: 10 
//   },
//   saveButtonText: { 
//     color: "white", 
//     fontWeight: "bold", 
//     fontSize: 16 
//   },
//   footer: { 
//     flexDirection: "row", 
//     justifyContent: "space-around", 
//     paddingVertical: 12, 
//     backgroundColor: "#343a40" 
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 50,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//   },
// });

// export default TakeAttendance;

// First, install the required dependencies:
// npm install @react-native-async-storage/async-storage axios
// expo install expo-file-system expo-sharing
// npm install xlsx


import React, { useState, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Faculty = {
  name: string;
  _id: string;
};

type RootStackParamList = {
  TakeAttendance: { faculty: Faculty };
};

type TakeAttendanceRouteProp = RouteProp<RootStackParamList, 'TakeAttendance'>;

const API_URL = "http://192.168.231.239:3000/api";

const TakeAttendance = () => {
  const route = useRoute<TakeAttendanceRouteProp>();
  const { faculty } = route.params;
  const facultyId = faculty?._id;
  const navigation = useNavigation();
  
  // 2D array of student roll numbers from API
  const [studentRolls, setStudentRolls] = useState<string[][]>([]);
  const [studentStatus, setStudentStatus] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log('Starting fetch for faculty ID:', facultyId);
        
        const token = await AsyncStorage.getItem('authToken');
        console.log('Retrieved token:', token ? 'Token exists' : 'No token found');
        
        if (!token) {
          Alert.alert('Error', 'You are not logged in');
          setLoading(false);
          return;
        }
        
        const url = `${API_URL}/faculty/${facultyId}/students`;
        console.log('Making request to:', url);
        
        const response = await axios.get(url, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ SUCCESS - Response status:', response.status);
        console.log('✅ Response data:', response.data);
        
        if (response.data && response.data.rollNumbers) {
          console.log('✅ Roll numbers found:', response.data.rollNumbers);
          
          // If rollNumbers is a flat array, convert it to 2D array (chunks of 5)
          const rollNumbers = response.data.rollNumbers;
          if (Array.isArray(rollNumbers) && rollNumbers.length > 0) {
            // Check if it's already 2D or needs to be chunked
            if (Array.isArray(rollNumbers[0])) {
              setStudentRolls(rollNumbers);
            } else {
              // Convert flat array to 2D array (chunks of 5)
              const chunked = [];
              for (let i = 0; i < rollNumbers.length; i += 5) {
                chunked.push(rollNumbers.slice(i, i + 5));
              }
              setStudentRolls(chunked);
            }
          }
        } else {
          console.log('⚠️ No rollNumbers in response data');
          Alert.alert('Info', 'No students found for this faculty');
        }
      } catch (error) {
        console.log('❌ ERROR CAUGHT');
        console.error('❌ Full error:', error);
        
        let errorMessage = 'Failed to load students';
        
        if (axios.isAxiosError(error)) {
          console.error('❌ Axios error response:', error.response);
          console.error('❌ Status:', error.response?.status);
          console.error('❌ Data:', error.response?.data);
          
          if (error.response?.status === 401) {
            errorMessage = 'Authentication failed. Please login again.';
          } else if (error.response?.status === 404) {
            errorMessage = 'Faculty or students not found';
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
        }
        
        Alert.alert('Error', errorMessage);
      } finally {
        console.log('🏁 Request completed, setting loading to false');
        setLoading(false);
      }
    };

    if (facultyId) {
      fetchStudents();
    } else {
      console.error('❌ No faculty ID provided');
      Alert.alert('Error', 'Faculty information is missing');
      setLoading(false);
    }
  }, [facultyId]);

  // Initialize studentStatus whenever studentRolls changes
  useEffect(() => {
    if (studentRolls.length === 0) return;

    // Get all actual roll numbers from the fetched data
    const allRollNumbers = studentRolls.flat();
    
    // Initialize all students as absent (status = 2)
    const initialStatus = Object.fromEntries(
      allRollNumbers.map(roll => [roll, 2])
    );

    setStudentStatus(initialStatus);
  }, [studentRolls]);

  const attendanceStats = useMemo(() => {
    // Only count students that exist in the fetched data
    const allRollNumbers = studentRolls.flat();
    const totalStudents = allRollNumbers.length;
    
    // Only count status for students that actually exist
    const presentCount = allRollNumbers.filter(roll => studentStatus[roll] === 1).length;
    const absentCount = totalStudents - presentCount;
    const presentPercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    return { totalStudents, presentCount, absentCount, presentPercentage };
  }, [studentStatus, studentRolls]);

  const getButtonColor = (roll: string) => {
    return studentStatus[roll] === 1 ? "#28a745" : "#dc3545"; // Green = present, Red = absent
  };

  const toggleStatus = (roll: string) => {
    setStudentStatus(prev => ({
      ...prev,
      [roll]: prev[roll] === 1 ? 2 : 1,
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

  const saveAttendance = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        Alert.alert('Error', 'You are not logged in');
        return;
      }

      // Only include attendance for students that actually exist
      const allRollNumbers = studentRolls.flat();
      const attendanceRecords = allRollNumbers.map(rollNumber => ({
        rollNumber,
        status: studentStatus[rollNumber] === 1 ? 'present' : 'absent'
      }));

      // Get current date and time
      const currentDate = new Date();
      
      const attendanceData = {
        facultyId: facultyId,
        facultyName: faculty?.name || 'Unknown Faculty',
        date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
        time: currentDate.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }), // HH:MM format
        attendanceRecords,
        summary: {
          totalStudents: attendanceStats.totalStudents,
          presentCount: attendanceStats.presentCount,
          absentCount: attendanceStats.absentCount,
          presentPercentage: attendanceStats.presentPercentage
        }
      };

      console.log('Saving attendance data:', attendanceData);

      const response = await axios.post(
        `${API_URL}/attendance/save`,
        attendanceData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Attendance saved successfully:', response.data);
      
      Alert.alert(
        "Success",
        "Attendance data saved successfully!",
        [{ text: "OK", onPress: () => navigation.navigate("FacultyDashboard" as never) }]
      );
    } catch (error) {
      console.error('Error saving attendance:', error);
      
      let errorMessage = 'Failed to save attendance';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

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

      {/* Faculty Info */}
      <View style={styles.facultyInfo}>
        <Text style={styles.facultyName}>Faculty: {faculty?.name || facultyId}</Text>
        <Text style={styles.dateText}>Date: {new Date().toLocaleDateString()}</Text>
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
        {studentRolls.length > 0 ? (
          studentRolls.map((row, rowIndex) => (
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
                  <Text style={styles.studentText}>{roll.slice(-3).toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No students found for this faculty</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {studentRolls.length > 0 && (
        <>
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
        </>
      )}

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("FacultyDashboard" as never)}
          accessibilityLabel="Go to dashboard"
        >
          <FontAwesome name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("FacultyDashboard" as never)}
          accessibilityLabel="Go to profile"
        >
          <FontAwesome name="user" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Settings" as never)}
          accessibilityLabel="Go to settings"
        >
          <FontAwesome name="cog" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "white" 
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#ddd", 
    backgroundColor: "#f8f9fa", 
    elevation: 1 
  },
  backButton: { 
    marginRight: 10, 
    padding: 5 
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  facultyInfo: {
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  facultyName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500"
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2
  },
  summaryContainer: { 
    backgroundColor: "#f8f9fa", 
    padding: 15, 
    flexDirection: "row", 
    justifyContent: "space-around", 
    borderBottomWidth: 1, 
    borderBottomColor: "#ddd" 
  },
  summaryText: { 
    fontSize: 16, 
    fontWeight: "500" 
  },
  studentsContainer: { 
    padding: 15, 
    alignItems: "center" 
  },
  row: { 
    flexDirection: "row", 
    marginBottom: 15, 
    justifyContent: "center" 
  },
  studentButton: { 
    width: 50, 
    height: 50, 
    marginHorizontal: 7, 
    borderRadius: 6, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  studentText: { 
    color: "white", 
    fontWeight: "bold" 
  },
  actions: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginVertical: 15 
  },
  actionButton: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 6 
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold" 
  },
  saveButton: { 
    backgroundColor: "#007bff", 
    padding: 15, 
    marginHorizontal: 15, 
    borderRadius: 6, 
    alignItems: "center", 
    marginBottom: 10 
  },
  saveButtonText: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  footer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    paddingVertical: 12, 
    backgroundColor: "#343a40" 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default TakeAttendance;