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
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!user.id || !user.name || !user.email || !user.password) {
      Alert.alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        Alert.alert("Registration successful!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Failed to register");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#E3F2FD", "#90CAF9", "#42A5F5"]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* App Logo */}
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subText}>
          Join us and start using the app right away!
        </Text>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Ionicons name="card-outline" size={22} color="#1E88E5" />
          <TextInput
            style={styles.input}
            placeholder="User ID"
            value={user.id}
            onChangeText={(text) => setUser({ ...user, id: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={22} color="#1E88E5" />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={22} color="#1E88E5" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={22} color="#1E88E5" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={user.password}
            onChangeText={(text) => setUser({ ...user, password: text })}
          />
        </View>

        <View style={[styles.inputContainer, styles.bioContainer]}>
          <Ionicons name="create-outline" size={22} color="#1E88E5" />
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Bio (optional)"
            multiline
            value={user.bio}
            onChangeText={(text) => setUser({ ...user, bio: text })}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        {/* Switch to Login */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.switchText}>
            Already have an account?{" "}
            <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 25,
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0D47A1",
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
    color: "#444",
    fontSize: 15,
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#BBDEFB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  bioContainer: {
    alignItems: "flex-start",
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#1565C0",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    fontSize: 16,
    marginTop: 15,
  },
  link: {
    color: "#0D47A1",
    fontWeight: "700",
  },
});
