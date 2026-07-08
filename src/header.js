import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData?.name) return "U";
    const names = userData.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.container}
      >
        {/* Logo + App Name */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../assets/logo.jpg")}
              style={styles.logo}
            />
            <View style={styles.logoGlow} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Leafyfication</Text>
            <Text style={styles.subtitle}>Plant Care</Text>
          </View>
        </View>

        {/* Dynamic Button - Login or Profile */}
        {!isLoggedIn ? (
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={onLoginPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6C63FF', '#5A52D5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginGradient}
            >
              <Ionicons name="log-in-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.profileContainer}>
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={onProfilePress}
              activeOpacity={0.8}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getUserInitials()}</Text>
                </View>
                <View style={styles.avatarBadge} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {userData?.name?.split(' ')[0] || 'User'}
                </Text>
                <Text style={styles.userRole}>{userData?.role || 'User'}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoWrapper: {
    position: "relative",
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#6C63FF",
  },
  logoGlow: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(108, 99, 255, 0.08)",
    top: -5,
    left: -5,
  },
  titleContainer: {
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A2E",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    color: "#6C63FF",
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: -2,
  },
  // Login Button
  loginButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: "#6C63FF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  loginGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  // Profile Container
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(108, 99, 255, 0.06)",
    borderRadius: 50,
    paddingVertical: 4,
    paddingRight: 14,
    paddingLeft: 4,
    borderWidth: 1,
    borderColor: "rgba(108, 99, 255, 0.1)",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    marginLeft: 8,
  },
  userName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  userRole: {
    fontSize: 10,
    color: "#6C63FF",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  logoutButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 107, 107, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.1)",
  },
});