import React from "react";
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header({ onLoginPress }) {
  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
    <View style={styles.container}>
      {/* Logo + App Name */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo.jpg")} // put your logo here
          style={styles.logo}
        />
        <Text style={styles.title}>Leafyfication</Text>
      </View>

      {/* Login button */}
      <TouchableOpacity style={styles.cardButton} title="Login" onPress={onLoginPress}>
        <Text style={{color: "#fff", fontWeight: "bold", textAlign: "center"}}>Login</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    borderRadius: 8,
    width: 60,
  },
});