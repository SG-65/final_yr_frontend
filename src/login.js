import React, { useState, useRef, useEffect } from "react";
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
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "./storage";
import baseURL from "./config";

const { width, height } = Dimensions.get("window");

export default function Login({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pinFocused, setPinFocused] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
      colors={["#0F0C29", "#302B63", "#24243E"]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Decorative Background Elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />

            {/* Logo and Title */}
            <View style={styles.headerContainer}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <View style={styles.logoWrapper}>
                  <Image
                    source={require("../assets/logo.jpg")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <View style={styles.logoGlow} />
                </View>
              </Animated.View>
              
              <Text style={styles.title}>Leafyfication</Text>
              <Text style={styles.subtitle}>Welcome Back</Text>
              <View style={styles.divider} />
            </View>

            {/* Login Card */}
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.cardTitle}>Sign In</Text>
              <Text style={styles.cardSubtitle}>
                Enter your credentials to access your account
              </Text>

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputLabelContainer}>
                  <Ionicons name="mail-outline" size={18} color="#6C63FF" />
                  <Text style={styles.inputLabel}>Email Address</Text>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    emailFocused && styles.inputContainerFocused,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                  {email.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setEmail("")}
                      style={styles.clearButton}
                    >
                      <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* PIN Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputLabelContainer}>
                  <Ionicons name="lock-closed-outline" size={18} color="#6C63FF" />
                  <Text style={styles.inputLabel}>PIN</Text>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    pinFocused && styles.inputContainerFocused,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your PIN"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    keyboardType="numeric"
                    maxLength={6}
                    value={pin}
                    onChangeText={setPin}
                    onFocus={() => setPinFocused(true)}
                    onBlur={() => setPinFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot PIN */}
              <TouchableOpacity style={styles.forgotContainer}>
                <Text style={styles.forgotText}>Forgot PIN?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#6C63FF", "#5A52D5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Sign In</Text>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Register Link */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                  <Text style={styles.linkText}> Create Account</Text>
                </TouchableOpacity>
              </View>

              {/* Social Login */}
              <View style={styles.socialContainer}>
                <View style={styles.socialDivider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.socialDividerText}>Or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>
                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-google" size={24} color="#EA4335" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-apple" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* Version Info */}
            <Text style={styles.versionText}>Version 2.0.0</Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "center",
    position: "relative",
  },
  // Decorative Elements
  decorativeCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(108, 99, 255, 0.05)",
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(108, 99, 255, 0.03)",
    bottom: -50,
    left: -50,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(108, 99, 255, 0.04)",
    top: height * 0.4,
    right: -30,
  },
  // Header
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "rgba(108, 99, 255, 0.3)",
  },
  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(108, 99, 255, 0.1)",
    top: -15,
    left: -15,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    fontWeight: "500",
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#6C63FF",
    borderRadius: 2,
    marginTop: 12,
  },
  // Card
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 28,
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 24,
    lineHeight: 20,
  },
  // Inputs
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    height: 52,
  },
  inputContainerFocused: {
    borderColor: "#6C63FF",
    backgroundColor: "rgba(108, 99, 255, 0.08)",
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: "#FFFFFF",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  eyeButton: {
    padding: 4,
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    color: "#6C63FF",
    fontWeight: "600",
  },
  // Button
  button: {
    borderRadius: 14,
    overflow: "hidden",
    height: 52,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // Footer
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  linkText: {
    fontSize: 14,
    color: "#6C63FF",
    fontWeight: "700",
  },
  // Social Login
  socialContainer: {
    marginTop: 24,
  },
  socialDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  socialDividerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  versionText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.2)",
    fontSize: 12,
    marginTop: 24,
  },
});