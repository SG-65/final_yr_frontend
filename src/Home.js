import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Welcome Message */}
        <Text style={styles.welcomeText}>Welcome to Leafyfication!</Text>

        {/* Diagnose Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diagnose Your Plant</Text>
          <Text style={styles.cardSubtitle}>Detect disease from your plant's leaves</Text>
          <TouchableOpacity 
            style={styles.cardButton} 
            onPress={() => navigation.navigate("Diagnose")}
          >
            <Text style={styles.cardButtonText}>Go to Diagnose</Text>
          </TouchableOpacity>
        </View>

        {/* Treatment Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Get Treatment Suggestions</Text>
          <Text style={styles.cardSubtitle}>Learn how to treat your plant effectively</Text>
          <TouchableOpacity 
            style={styles.cardButton} 
            onPress={() => navigation.navigate("Treatment")}
          >
            <Text style={styles.cardButtonText}>Go to Treatment</Text>
          </TouchableOpacity>
        </View>
        
        {/* Profile Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Profile</Text>
          <Text style={styles.cardSubtitle}>View and edit your information</Text>
          <TouchableOpacity 
            style={styles.cardButton} 
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.cardButtonText}>Go to Profile</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, // for Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2e7d32",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  cardButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    borderRadius: 8,
  },
  cardButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
