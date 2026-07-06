// import React from "react";
// import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Header({ onLoginPress }) {
//   return (
//     <SafeAreaView style={{ backgroundColor: "#fff" }}>
//     <View style={styles.container}>
//       {/* Logo + App Name */}
//       <View style={styles.logoContainer}>
//         <Image
//           source={require("../assets/logo.jpg")} // put your logo here
//           style={styles.logo}
//         />
//         <Text style={styles.title}>Leafyfication</Text>
//       </View>

//       {/* Login button */}
//       <TouchableOpacity style={styles.cardButton} title="Login" onPress={onLoginPress}>
//         <Text style={{color: "#fff", fontWeight: "bold", textAlign: "center"}}>Login</Text>
//       </TouchableOpacity>
//     </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   logoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   logo: {
//     width: 70,
//     height: 70,
//     marginRight: 8,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   cardButton: {
//     backgroundColor: "#4caf50",
//     paddingVertical: 12,
//     borderRadius: 8,
//     width: 60,
//   },
// });











































import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Header({ onLoginPress, onProfilePress, onLogout, isLoggedIn, userData }) {
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            if (onLogout) onLogout();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* Logo + App Name */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.jpg")}
            style={styles.logo}
          />
          <Text style={styles.title}>Leafyfication</Text>
        </View>

        {/* Dynamic Button - Login or Profile */}
        {!isLoggedIn ? (
          <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
            <Ionicons name="log-in-outline" size={18} color="#fff" />
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>
              {userData?.name?.split(' ')[0] || 'Profile'}
            </Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
              <Ionicons name="log-out-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  loginButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  profileButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  logoutIcon: {
    marginLeft: 4,
    padding: 2,
  },
});