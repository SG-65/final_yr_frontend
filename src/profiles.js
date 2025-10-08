import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import baseURL from "./config";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", bio: "" });
  const [existingUsers, setExistingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${baseURL}/users`);
      const data = await response.json();
      setExistingUsers(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error fetching users");
    }
  };

  const handleSave = async () => {
    if (!user.name || !user.email) {
      Alert.alert("Please enter name and email");
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
        Alert.alert("Profile added successfully!");
        setUser({ name: "", email: "", bio: "" });
        setShowForm(false);
        fetchUsers();
      } else {
        Alert.alert("Failed to add profile");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error adding profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Add User Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.addButtonText}>
          {showForm ? "Cancel" : "Add User"}
        </Text>
      </TouchableOpacity>

      {/* Form */}
      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
          />
          <TextInput
            style={[styles.input, styles.bio]}
            placeholder="Bio"
            multiline
            value={user.bio}
            onChangeText={(text) => setUser({ ...user, bio: text })}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Saving..." : "Save Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Existing Users */}
      <Text style={styles.heading}>Existing Users</Text>
      {existingUsers && existingUsers.length > 0 ? (
        existingUsers
          .filter((u) => u.name || u.email || u.bio)
          .map((u) => (
            <View key={u._id} style={styles.userCard}>
              <Text style={styles.userName}>{u.name}</Text>
              <Text style={styles.userEmail}>{u.email}</Text>
              <Text style={styles.userBio}>{u.bio}</Text>
            </View>
          ))
      ) : (
        <Text style={styles.noUsersText}>No users added yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f4f7", // soft background
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  formContainer: {
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  bio: {
    height: 100,
    textAlignVertical: "top",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
  },
  userCard: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  userEmail: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  userBio: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 5,
  },
  buttonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noUsersText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 16,
  },
});
