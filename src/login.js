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
// import { Ionicons } from "@expo/vector-icons";
// import baseURL from "./config";

// export default function Login({ navigation, onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert("Please enter both email and password");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${baseURL}/users`);
//       const users = await response.json();
//       const user = users.find((u) => u.password === password);

//       if (user) {
//         Alert.alert("Login successful!");
//         onLogin();
//       } else {
//         Alert.alert("Invalid email or password");
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error logging in");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         {/* App logo / header */}
//         <View style={styles.logoContainer}>
//           <Image
//             source={require("../assets/logo.png")} // optional app logo
//             style={styles.logo}
//             resizeMode="cover"
//           />
//           <Text style={styles.title}>Welcome Back</Text>
//           <Text style={styles.subtitle}>Sign in to continue</Text>
//         </View>

//         {/* Form container */}
//         <View style={styles.card}>
//           <View style={styles.inputContainer}>
//             <Ionicons name="mail-outline" size={20} color="#1E88E5" style={styles.icon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               placeholderTextColor="#999"
//               value={email}
//               keyboardType="email-address"
//               onChangeText={setEmail}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Ionicons name="lock-closed-outline" size={20} color="#1E88E5" style={styles.icon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor="#999"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.button, loading && styles.buttonDisabled]}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             <Text style={styles.buttonText}>
//               {loading ? "Logging in..." : "Login"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//             <Text style={styles.switchText}>
//               Don’t have an account? <Text style={styles.linkText}>Register</Text>
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     backgroundColor: "linear-gradient(180deg, #2196F3 0%, #6EC6FF 100%)",
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#E3F2FD",
//   },
//   logoContainer: {
//     backgroundColor: "Transparent",
//     alignItems: "center",
//     marginTop: 60,
//     marginBottom: 30,
//   },
//   logo: {
//     width: 90,
//     height: 90,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#1E88E5",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#555",
//     marginTop: 5,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 25,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F8F9FA",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//     paddingHorizontal: 12,
//     marginBottom: 15,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     height: 48,
//     fontSize: 16,
//     color: "#333",
//   },
//   button: {
//     backgroundColor: "#1E88E5",
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 15,
//     shadowColor: "#1E88E5",
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 4,
//     elevation: 4,
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
//     fontSize: 15,
//   },
//   linkText: {
//     color: "#1E88E5",
//     fontWeight: "bold",
//   },
// });





























































































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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "./storage"; // Import custom storage
import baseURL from "./config";

export default function Login({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pin) {
      Alert.alert("Error", "Please enter both email and PIN");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/user/login?email=${encodeURIComponent(email)}&pin=${encodeURIComponent(pin)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const userData = {
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          role: data.role,
        };
        
        // Use custom storage which handles errors gracefully
        await storage.setItem("userToken", "authenticated");
        await storage.setItem("userData", JSON.stringify(userData));
        
        Alert.alert("Success", "Login successful!");
        
        if (onLogin) {
          onLogin(userData, "authenticated");
        }
      } else {
        Alert.alert("Login Failed", data.detail || "Invalid email or PIN");
      }
    } catch (error) {
      console.error("Login error:", error);
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.card}>
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
                placeholder="PIN"
                placeholderTextColor="#999"
                secureTextEntry
                keyboardType="numeric"
                maxLength={6}
                value={pin}
                onChangeText={setPin}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.switchText}>
                Don't have an account? <Text style={styles.linkText}>Register</Text>
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