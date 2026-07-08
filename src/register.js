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
import baseURL from "./config";

const { width, height } = Dimensions.get("window");

export default function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pinFocused, setPinFocused] = useState(false);
  const [confirmPinFocused, setConfirmPinFocused] = useState(false);

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
      const response = await fetch(`${baseURL}/user/`, {
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
              <Text style={styles.subtitle}>Create Account</Text>
              <View style={styles.divider} />
            </View>

            {/* Register Card */}
            <Animated.View
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.cardTitle}>Get Started</Text>
              <Text style={styles.cardSubtitle}>
                Create your account to access all features
              </Text>

              {/* Name Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputLabelContainer}>
                  <Ionicons name="person-outline" size={18} color="#6C63FF" />
                  <Text style={styles.inputLabel}>Full Name</Text>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    nameFocused && styles.inputContainerFocused,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                  />
                  {name.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setName("")}
                      style={styles.clearButton}
                    >
                      <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

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
                  <Text style={styles.inputLabel}>PIN (6 digits)</Text>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    pinFocused && styles.inputContainerFocused,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit PIN"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPin}
                    keyboardType="numeric"
                    maxLength={6}
                    value={pin}
                    onChangeText={setPin}
                    onFocus={() => setPinFocused(true)}
                    onBlur={() => setPinFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPin(!showPin)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showPin ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm PIN Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputLabelContainer}>
                  <Ionicons name="lock-closed-outline" size={18} color="#6C63FF" />
                  <Text style={styles.inputLabel}>Confirm PIN</Text>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    confirmPinFocused && styles.inputContainerFocused,
                    pin && confirmPin && pin !== confirmPin && styles.inputContainerError,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your PIN"
                    placeholderTextColor="#999"
                    secureTextEntry={!showConfirmPin}
                    keyboardType="numeric"
                    maxLength={6}
                    value={confirmPin}
                    onChangeText={setConfirmPin}
                    onFocus={() => setConfirmPinFocused(true)}
                    onBlur={() => setConfirmPinFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPin(!showConfirmPin)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showConfirmPin ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
                {pin && confirmPin && pin !== confirmPin && (
                  <Text style={styles.errorText}>PINs do not match</Text>
                )}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
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
                      <Text style={styles.buttonText}>Create Account</Text>
                      <Ionicons name="person-add-outline" size={20} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.linkText}> Sign In</Text>
                </TouchableOpacity>
              </View>

              {/* Terms and Privacy */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By registering, you agree to our
                </Text>
                <TouchableOpacity>
                  <Text style={styles.termsLink}> Terms of Service</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}> and</Text>
                <TouchableOpacity>
                  <Text style={styles.termsLink}> Privacy Policy</Text>
                </TouchableOpacity>
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
    marginBottom: 24,
  },
  logoWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "rgba(108, 99, 255, 0.3)",
  },
  logoGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
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
    padding: 24,
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
    marginBottom: 20,
    lineHeight: 20,
  },
  // Inputs
  inputWrapper: {
    marginBottom: 14,
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
    height: 50,
  },
  inputContainerFocused: {
    borderColor: "#6C63FF",
    backgroundColor: "rgba(108, 99, 255, 0.08)",
  },
  inputContainerError: {
    borderColor: "#FF4444",
    backgroundColor: "rgba(255, 68, 68, 0.08)",
  },
  input: {
    flex: 1,
    height: 50,
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
  errorText: {
    fontSize: 12,
    color: "#FF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  // Button
  button: {
    borderRadius: 14,
    overflow: "hidden",
    height: 50,
    marginTop: 6,
    marginBottom: 14,
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
  // Terms
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
  },
  termsText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  termsLink: {
    fontSize: 12,
    color: "#6C63FF",
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.2)",
    fontSize: 12,
    marginTop: 20,
  },
});