import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import baseURL from "./config";

export default function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !pin || !confirmPin) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert("Error", "PINs do not match");
      return;
    }

    if (pin.length !== 6) {
      Alert.alert("Error", "PIN must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          pin: pin,
          role: "user",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Registration successful! Please login.", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Registration Failed", data.detail || "Something went wrong");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#E3F2FD", "#90CAF9", "#42A5F5"]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#1E88E5" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#1E88E5" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#1E88E5" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="PIN (6 digits)"
                placeholderTextColor="#999"
                secureTextEntry
                keyboardType="numeric"
                maxLength={6}
                value={pin}
                onChangeText={setPin}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#1E88E5" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm PIN"
                placeholderTextColor="#999"
                secureTextEntry
                keyboardType="numeric"
                maxLength={6}
                value={confirmPin}
                onChangeText={setConfirmPin}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Registering..." : "Register"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.switchText}>
                Already have an account? <Text style={styles.linkText}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0D47A1",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#1565C0",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    shadowColor: "#1565C0",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#90CAF9",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  switchText: {
    textAlign: "center",
    color: "#555",
    fontSize: 15,
  },
  linkText: {
    color: "#1565C0",
    fontWeight: "bold",
  },
});


























































// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   Image,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import baseURL from "./config";

// export default function Register({ navigation }) {
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     pin: "",  // Changed from password to pin
//     role: "user",  // Added role field
//   });
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     // Updated validation
//     if (!user.name || !user.email || !user.pin) {
//       Alert.alert("Error", "Please fill all required fields (Name, Email, PIN)");
//       return;
//     }

//     // Validate PIN length (minimum 4 digits as per typical PIN requirements)
//     if (user.pin.length < 4) {
//       Alert.alert("Error", "PIN must be at least 4 characters long");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${baseURL}/user/`, {  // Updated endpoint
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: user.name,
//           email: user.email,
//           pin: user.pin,
//           role: user.role
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert("Success", "Registration successful!");
//         navigation.navigate("Login");
//       } else {
//         Alert.alert("Registration Failed", data.detail || "Failed to register user");
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient
//       colors={["#E3F2FD", "#90CAF9", "#42A5F5"]}
//       style={styles.gradient}
//     >
//       <ScrollView contentContainerStyle={styles.container}>
//         <Image
//           source={require("../assets/logo.png")}
//           style={styles.logo}
//           resizeMode="contain"
//         />

//         <Text style={styles.heading}>Create Account</Text>
//         <Text style={styles.subText}>
//           Join us and start using the app right away!
//         </Text>

//         {/* Removed User ID field - backend auto-generates it */}
        
//         <View style={styles.inputContainer}>
//           <Ionicons name="person-outline" size={22} color="#1E88E5" />
//           <TextInput
//             style={styles.input}
//             placeholder="Full Name"
//             value={user.name}
//             onChangeText={(text) => setUser({ ...user, name: text })}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Ionicons name="mail-outline" size={22} color="#1E88E5" />
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             keyboardType="email-address"
//             autoCapitalize="none"
//             value={user.email}
//             onChangeText={(text) => setUser({ ...user, email: text })}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Ionicons name="key-outline" size={22} color="#1E88E5" />
//           <TextInput
//             style={styles.input}
//             placeholder="PIN (4+ characters)"
//             secureTextEntry
//             keyboardType="numeric"
//             maxLength={6}
//             value={user.pin}
//             onChangeText={(text) => setUser({ ...user, pin: text })}
//           />
//         </View>

//         {/* Optional Role Selector - if you want to allow role selection */}
//         <View style={styles.roleContainer}>
//           <Text style={styles.roleLabel}>Role:</Text>
//           <TouchableOpacity 
//             style={[styles.roleButton, user.role === "user" && styles.roleButtonActive]}
//             onPress={() => setUser({ ...user, role: "user" })}
//           >
//             <Text style={styles.roleText}>User</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={[styles.roleButton, user.role === "admin" && styles.roleButtonActive]}
//             onPress={() => setUser({ ...user, role: "admin" })}
//           >
//             <Text style={styles.roleText}>Admin</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={[styles.button, loading && styles.buttonDisabled]}
//           onPress={handleRegister}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? "Registering..." : "Register"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//           <Text style={styles.switchText}>
//             Already have an account?{" "}
//             <Text style={styles.link}>Login</Text>
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   container: {
//     flexGrow: 1,
//     padding: 25,
//     justifyContent: "center",
//   },
//   logo: {
//     width: 120,
//     height: 120,
//     alignSelf: "center",
//     marginBottom: 20,
//     backgroundColor: "transparent",
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#0D47A1",
//     textAlign: "center",
//   },
//   subText: {
//     textAlign: "center",
//     color: "#444",
//     fontSize: 15,
//     marginBottom: 25,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#BBDEFB",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//     color: "#333",
//   },
//   roleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   roleLabel: {
//     fontSize: 16,
//     color: "#0D47A1",
//     marginRight: 15,
//     fontWeight: "600",
//   },
//   roleButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: "#E3F2FD",
//     marginHorizontal: 5,
//   },
//   roleButtonActive: {
//     backgroundColor: "#1565C0",
//   },
//   roleText: {
//     color: "#0D47A1",
//     fontWeight: "600",
//   },
//   button: {
//     backgroundColor: "#1565C0",
//     paddingVertical: 15,
//     borderRadius: 30,
//     alignItems: "center",
//     marginTop: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   buttonDisabled: {
//     backgroundColor: "#90CAF9",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   switchText: {
//     textAlign: "center",
//     color: "#555",
//     fontSize: 16,
//     marginTop: 15,
//   },
//   link: {
//     color: "#0D47A1",
//     fontWeight: "700",
//   },
// });