import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import baseURL from './config'

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let response;

        if (Platform.OS === "android") {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission Denied",
              "Location permission is required to fetch weather data."
            );
            setLoading(false);
            return;
          }

          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          console.log("📍 Android Coordinates:", latitude, longitude);

          response = await fetch(`${baseURL}/weather`);
        } else {
          console.log("🌐 Using IP-based location for Web/Windows...");
          response = await fetch(`http://localhost:8000/weather`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
        }

        const text = await response.text();
        console.log("🌐 Raw server response:", text);

        try {
          const data = JSON.parse(text);
          console.log("✅ Weather data received:", data);
          setWeather(data);
        } catch (err) {
          console.error("❌ Response not JSON:", err);
          console.log("📄 Received content:", text);
          if (Platform.OS === "web") {
            alert("Server did not return valid JSON. Check console logs for details.");
          }
        }
      } catch (error) {
        console.error("🌐 Error fetching weather:", error);
        if (Platform.OS === "web") {
          alert("Unable to fetch weather data (CORS or network issue). Check console for details.");
        } else {
          Alert.alert("Error", "Unable to fetch weather data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Optional: check IP info (debugging)
  useEffect(() => {
    fetch(`${baseURL}/get_ip_location`)
      .then((res) => res.json())
      .then((data) => console.log("🌍 Device IP:", data.client_ip))
      .catch((err) => console.error("Error getting IP:", err));
  }, []);

  // ✅ Loading UI
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Fetching weather data...</Text>
      </View>
    );
  }

  // ✅ No weather data UI
  if (!weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No weather data available.</Text>
      </View>
    );
  }

  // ✅ Main weather UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤️ Weather Information</Text>

      <ScrollView style={styles.scroll}>
        {Object.entries(weather)
        .filter(([key])=>!["City","Timestamp"].includes(key)) //exclude specific keys
        .map(([key, value]) => (
          <View key={key} style={styles.card}>
            <Text style={styles.label}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </Text>
            <Text style={styles.value}>{value.toString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// 🌿 Color Palette: White, Light Green, and Emerald Green
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5fff7", // soft white-green
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#388E3C",
    fontWeight: "500",
  },
  noDataText: {
    fontSize: 18,
    color: "#2e7d32",
    textAlign: "center",
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 20,
  },
  scroll: {
    marginTop: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: "#74b577",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#388E3C",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
});
