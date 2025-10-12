import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import baseURL from "./config";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translatedWeather, setTranslatedWeather] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("hindi"); // default language

  // ✅ Translation function
  const translateText = async (text, targetLang) => {
    if (!text) return "";
    try {
      const response = await fetch(
        `${baseURL}/translate?text=${encodeURIComponent(text)}&target_language=${targetLang}`
      );
      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();
      return data.translated_text;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // fallback to original text
    }
  };

  // ✅ Fetch Weather — Re-runs whenever targetLanguage changes
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true); // 🟢 reload indicator every time
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
          response = await fetch(`${baseURL}/weather`, {
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

          // ✅ Translate right after fetching
          const translated = {};
          for (let key in data) {
            if (!["City", "Timestamp"].includes(key)) {
              translated[key] = await translateText(data[key].toString(), targetLanguage);
            }
          }
          setTranslatedWeather(translated);
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
    };

    fetchWeather(); // 🟢 Trigger whenever language changes
  }, [targetLanguage]); // 🟢 refetch + translate when language changes

  // ✅ Optional debug: get IP info
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
        <Text style={styles.loadingText}>Fetching & Translating weather data...</Text>
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
  <Text style={styles.title}>🌤️ Weather Dashboard</Text>

  {/* Language Selector */}
  <View style={styles.languageSelectorContainer}>
    <Text style={styles.languageLabel}>Select Language:</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {[
        "bengali","bhojpuri","gujarati","hindi","kannada","maithili",
        "malayalam","marathi","meitei","odia","punjabi","sanskrit",
        "tamil","telugu","urdu","santali","awadhi","bodo","khasi",
        "kokborok","marwadi","tulu",
      ].map((lang) => (
        <TouchableOpacity
          key={lang}
          style={[
            styles.languageButton,
            targetLanguage === lang && styles.languageButtonSelected
          ]}
          onPress={() => setTargetLanguage(lang)}
        >
          <Text style={styles.languageButtonText}>{lang.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>

  <ScrollView style={styles.scroll}>
    {/* Weather Card */}
    <View style={styles.weatherCard}>
      <Text style={styles.cardTitle}>🌡️ Original Weather</Text>
      {Object.entries(weather)
        .filter(([key]) => !["City", "Timestamp"].includes(key))
        .map(([key, value]) => (
          <View key={key} style={styles.fieldCard}>
            <Text style={styles.label}>{key}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
      ))}
    </View>

    {translatedWeather && (
      <View style={[styles.weatherCard, styles.translatedCard]}>
        <Text style={styles.cardTitle}>🌐 Translated Weather ({targetLanguage.toUpperCase()})</Text>
        {Object.entries(translatedWeather).map(([key, value]) => (
          <View key={key} style={styles.fieldCard}>
            <Text style={styles.label}>{key}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
    )}
  </ScrollView>
</View>
  );
}

// 🌿 Styles
const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#eafaf1", // soft gradient feel
  padding: 16,
},
title: {
  fontSize: 28,
  fontWeight: "bold",
  color: "#2e7d32",
  textAlign: "center",
  marginBottom: 20,
},
languageSelectorContainer: {
  marginBottom: 16,
},
languageLabel: {
  fontSize: 16,
  fontWeight: "600",
  color: "#388e3c",
  marginBottom: 6,
},
languageButton: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  marginRight: 8,
  borderRadius: 25,
  backgroundColor: "#c8e6c9",
  transition: "all 0.2s",
},
languageButtonSelected: {
  backgroundColor: "#388e3c",
},
languageButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 14,
},
scroll: {
  marginTop: 10,
},
weatherCard: {
  backgroundColor: "#ffffff",
  borderRadius: 20,
  padding: 20,
  marginBottom: 18,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 6,
},
translatedCard: {
  backgroundColor: "#e3f2fd",
},
cardTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#2E7D32",
  textAlign: "center",
  marginBottom: 16,
},
fieldCard: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#f0fff4",
  padding: 12,
  borderRadius: 14,
  marginBottom: 10,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 2,
},
label: {
  fontSize: 16,
  fontWeight: "600",
  color: "#388E3C",
},
value: {
  fontSize: 16,
  fontWeight: "500",
  color: "#333",
},
loadingContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#eafaf1",
},
loadingText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#388E3C",
  marginTop: 10,
},
});


