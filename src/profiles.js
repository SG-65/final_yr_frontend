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
  const [user, setUser] = useState({
    id: "",
    password: "",
    name: "",
    email: "",
    bio: "",
  });
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
    if (!user.id || !user.password || !user.name || !user.email) {
      Alert.alert("Please enter ID, password, name, and email");
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
        setUser({ id: "", password: "", name: "", email: "", bio: "" });
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
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add New User</Text>
          <TextInput
            style={styles.input}
            placeholder="ID"
            value={user.id}
            onChangeText={(text) => setUser({ ...user, id: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={user.password}
            onChangeText={(text) => setUser({ ...user, password: text })}
          />
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

      {/* Existing Users Table */}
      <Text style={styles.heading}>Existing Users</Text>
      {existingUsers && existingUsers.length > 0 ? (
        <ScrollView horizontal={true} style={{ marginBottom: 30 }}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.headerText, { width: 80, }]}>
                ID
              </Text>
              <Text style={[styles.tableCell, styles.headerText, { width: 120,}]}>
                Name
              </Text>
              <Text style={[styles.tableCell, styles.headerText, { width: 180 }]}>
                Email
              </Text>
              <Text style={[styles.tableCell, styles.headerText, { width: 220,}]}>
                Bio
              </Text>
            </View>
            {/* Table Rows */}
            {existingUsers.map((u) => (
              <View key={u._id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: 80 }]}>{u.id}</Text>
                <Text style={[styles.tableCell, { width: 120 }]}>{u.name}</Text>
                <Text style={[styles.tableCell, { width: 180 }]}>{u.email}</Text>
                <Text style={[styles.tableCell, { width: 220 }]}>{u.bio}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
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
    backgroundColor: "#f0f4f7",
  },
  addButton: {
  backgroundColor: "#1976D2", // deep blue
  paddingVertical: 16,
  paddingHorizontal: 25,
  borderRadius: 30,
  alignItems: "center",
  marginBottom: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 4,
},
addButtonText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "700",
  letterSpacing: 0.5,
},

button: {
  backgroundColor: "#1976D2",
  paddingVertical: 16,
  paddingHorizontal: 25,
  borderRadius: 25,
  alignItems: "center",
  marginTop: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
buttonDisabled: {
  backgroundColor: "#90caf9",
},
buttonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
  letterSpacing: 0.3,
},

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#f9f9f9",
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
  table: {
  borderRadius: 12,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "#e0e0e0",
  backgroundColor: "#fff",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
},
tableRow: {
  flexDirection: "row",
  alignItems: "center",
  minHeight: 50,
  borderBottomWidth: 1,
  borderBottomColor: "#e0e0e0",
},
tableHeader: {
  backgroundColor: "#1E88E5",
},
tableCell: {
  paddingVertical: 12,
  paddingHorizontal: 10,
  fontSize: 14,
  color: "#333",
},
  heading: {
  fontSize: 24,
  fontWeight: "700",
  marginVertical: 15,
  color: "#1E88E5",
},
formTitle: {
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 20,
  color: "#333",
  textAlign: "center",
},
tableCell: {
  paddingVertical: 12,
  paddingHorizontal: 10,
  fontSize: 15,
  color: "#555", // slightly muted text
},
headerText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 15,
  textAlign: "center",
},
noUsersText: {
  textAlign: "center",
  marginTop: 20,
  color: "#888",
  fontSize: 16,
},
});


