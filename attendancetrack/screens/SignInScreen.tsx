// // SignInScreen.js
// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const SignInScreen = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
  
//   const navigation = useNavigation();
  
//   const handleLogin = async () => {
//     if (!username || !password) {
//       Alert.alert("Error", "Please enter both username and password");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       console.log("Attempting to connect to:", "http://192.168.231.239:3000/api/login");
      
//       const response = await axios.post("https://anveshak-hx6p.onrender.com/api/login", {
//         username,
//         password,
//       });
      
//       console.log("Login response:", response.data); // Debug the response
      
//       // Navigate to the appropriate dashboard based on user role
//       const { role, token, student, faculty, admin } = response.data;
      
//       // Store token in AsyncStorage
//       await AsyncStorage.setItem('authToken', token);
//       console.log("Token saved to AsyncStorage:", token);
      
//       if (role === 'student') {
//         // CRITICAL: This must match the name in App.js
//         navigation.navigate('StudentDashboard', { student });
//         console.log("Navigating to StudentDashboard with:", student);
//       } else if (role === 'faculty') {
//         navigation.navigate('FacultyDashboard', { faculty });
//       } else if (role === 'admin') {
//         navigation.navigate('AdminDashboard', { admin });
//       }
      
//       Alert.alert("Success", "Login successful");
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.log("Axios error:", error.message);
//         if (error.response) {
//           console.log("Error response:", error.response.data);
//           Alert.alert("Error", error.response.data.message);
//         } else {
//           Alert.alert("Error", "Server not responding.");
//         }
//       } else {
//         console.error("Unexpected error:", error);
//         Alert.alert("Error", "Unexpected error occurred.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>KMIT ANVESHA</Text>
      
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your Username"
//         placeholderTextColor="#aaa"
//         value={username}
//         onChangeText={setUsername}
//       />
      
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="#aaa"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
      
//       <TouchableOpacity
//         style={[styles.signInButton, (loading || !username || !password) && { opacity: 0.5 }]}
//         onPress={handleLogin}
//         disabled={loading || !username || !password}
//       >
//         <Text style={styles.signInText}>{loading ? "SIGNING IN..." : "SIGN IN"}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   title: {
//     color: "#fff",
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 30,
//   },
//   input: {
//     width: "90%",
//     backgroundColor: "#333",
//     color: "#fff",
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     borderRadius: 25,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   signInButton: {
//     backgroundColor: "#fff",
//     paddingVertical: 10,
//     paddingHorizontal: 35,
//     borderRadius: 30,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 2, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     marginBottom: 15,
//   },
//   signInText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#000",
//   },
// });

// export default SignInScreen;
// SignInScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, BackHandler } from "react-native";
import axios from "axios";
import { useNavigation, useIsFocused, CommonActions } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

function SignInScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Clear inputs when screen is focused (e.g., after logout)
  useEffect(() => {
    if (isFocused) {
      setUsername("");
      setPassword("");
    }
  }, [isFocused]);

  // Optional: Confirm exit on Android back button when on login screen
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Do you want to exit the app?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true; // prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting to connect to:", "http://192.168.29.170:3000/api/login");

      const response = await axios.post("https://anveshak-hx6p.onrender.com/api/login", {
        username,
        password,
      });

      console.log("Login response:", response.data);

      const { role, token, student, faculty, admin } = response.data;

      // Store token in AsyncStorage
      await AsyncStorage.setItem("authToken", token);
      console.log("Token saved to AsyncStorage:", token);

      // Reset navigation stack on login
      if (role === "student") {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "StudentDashboard", params: { student } }],
          })
        );
      } else if (role === "faculty") {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "FacultyDashboard", params: { faculty } }],
          })
        );
      } else if (role === "admin") {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "AdminDashboard", params: { admin } }],
          })
        );
      }

      Alert.alert("Success", "Login successful");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error.message);
        if (error.response) {
          console.log("Error response:", error.response.data);
          Alert.alert("Error", error.response.data.message);
        } else {
          Alert.alert("Error", "Server not responding.");
        }
      } else {
        console.error("Unexpected error:", error);
        Alert.alert("Error", "Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KMIT ANVESHA</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.signInButton, (loading || !username || !password) && { opacity: 0.5 }]}
        onPress={handleLogin}
        disabled={loading || !username || !password}
      >
        <Text style={styles.signInText}>{loading ? "SIGNING IN..." : "SIGN IN"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "90%",
    backgroundColor: "#333",
    color: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 15,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 15,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default SignInScreen;