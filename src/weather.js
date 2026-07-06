// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   Platform,
//   Alert,
//   TouchableOpacity,
// } from "react-native";
// import * as Location from "expo-location";
// import baseURL from "./config";

// export default function Weather() {
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [translatedWeather, setTranslatedWeather] = useState(null);
//   const [targetLanguage, setTargetLanguage] = useState("hindi"); // default language

//   // ✅ Translation function
//   const translateText = async (text, targetLang) => {
//     if (!text) return "";
//     try {
//       const response = await fetch(
//         `${baseURL}/translate?text=${encodeURIComponent(text)}&target_language=${targetLang}`
//       );
//       if (!response.ok) throw new Error("Translation failed");
//       const data = await response.json();
//       return data.translated_text;
//     } catch (error) {
//       console.error("Translation error:", error);
//       return text; // fallback to original text
//     }
//   };

//   // ✅ Fetch Weather — Re-runs whenever targetLanguage changes
//   useEffect(() => {
//     const fetchWeather = async () => {
//       setLoading(true); // 🟢 reload indicator every time
//       try {
//         let response;

//         if (Platform.OS === "android") {
//           const { status } = await Location.requestForegroundPermissionsAsync();
//           if (status !== "granted") {
//             Alert.alert(
//               "Permission Denied",
//               "Location permission is required to fetch weather data."
//             );
//             setLoading(false);
//             return;
//           }

//           const location = await Location.getCurrentPositionAsync({});
//           const { latitude, longitude } = location.coords;
//           console.log("📍 Android Coordinates:", latitude, longitude);

//           response = await fetch(`${baseURL}/weather`);
//         } else {
//           console.log("🌐 Using IP-based location for Web/Windows...");
//           response = await fetch(`${baseURL}/weather`, {
//             method: "GET",
//             headers: { "Content-Type": "application/json" },
//           });
//         }

//         const text = await response.text();
//         console.log("🌐 Raw server response:", text);

//         try {
//           const data = JSON.parse(text);
//           console.log("✅ Weather data received:", data);
//           setWeather(data);

//           // ✅ Translate right after fetching
//           const translated = {};
//           for (let key in data) {
//             if (!["City", "Timestamp"].includes(key)) {
//               translated[key] = await translateText(data[key].toString(), targetLanguage);
//             }
//           }
//           setTranslatedWeather(translated);
//         } catch (err) {
//           console.error("❌ Response not JSON:", err);
//           console.log("📄 Received content:", text);
//           if (Platform.OS === "web") {
//             alert("Server did not return valid JSON. Check console logs for details.");
//           }
//         }
//       } catch (error) {
//         console.error("🌐 Error fetching weather:", error);
//         if (Platform.OS === "web") {
//           alert("Unable to fetch weather data (CORS or network issue). Check console for details.");
//         } else {
//           Alert.alert("Error", "Unable to fetch weather data. Please try again later.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWeather(); // 🟢 Trigger whenever language changes
//   }, [targetLanguage]); // 🟢 refetch + translate when language changes

//   // ✅ Optional debug: get IP info
//   useEffect(() => {
//     fetch(`${baseURL}/get_ip_location`)
//       .then((res) => res.json())
//       .then((data) => console.log("🌍 Device IP:", data.client_ip))
//       .catch((err) => console.error("Error getting IP:", err));
//   }, []);

//   // ✅ Loading UI
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text style={styles.loadingText}>Fetching & Translating weather data...</Text>
//       </View>
//     );
//   }

//   // ✅ No weather data UI
//   if (!weather) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.noDataText}>No weather data available.</Text>
//       </View>
//     );
//   }

//   // ✅ Main weather UI
//   return (
// <View style={styles.container}>
//   <Text style={styles.title}>🌤️ Weather Dashboard</Text>

//   {/* Language Selector */}
//   <View style={styles.languageSelectorContainer}>
//     <Text style={styles.languageLabel}>Select Language:</Text>
//     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//       {[
//         "bengali","bhojpuri","gujarati","hindi","kannada","maithili",
//         "malayalam","marathi","meitei","odia","punjabi","sanskrit",
//         "tamil","telugu","urdu","santali","awadhi","bodo","khasi",
//         "kokborok","marwadi","tulu",
//       ].map((lang) => (
//         <TouchableOpacity
//           key={lang}
//           style={[
//             styles.languageButton,
//             targetLanguage === lang && styles.languageButtonSelected
//           ]}
//           onPress={() => setTargetLanguage(lang)}
//         >
//           <Text style={styles.languageButtonText}>{lang.toUpperCase()}</Text>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   </View>

//   <ScrollView style={styles.scroll}>
//     {/* Weather Card */}
//     <View style={styles.weatherCard}>
//       <Text style={styles.cardTitle}>🌡️ Original Weather</Text>
//       {Object.entries(weather)
//         .filter(([key]) => !["City", "Timestamp"].includes(key))
//         .map(([key, value]) => (
//           <View key={key} style={styles.fieldCard}>
//             <Text style={styles.label}>{key}</Text>
//             <Text style={styles.value}>{value}</Text>
//           </View>
//       ))}
//     </View>

//     {translatedWeather && (
//       <View style={[styles.weatherCard, styles.translatedCard]}>
//         <Text style={styles.cardTitle}>🌐 Translated Weather ({targetLanguage.toUpperCase()})</Text>
//         {Object.entries(translatedWeather).map(([key, value]) => (
//           <View key={key} style={styles.fieldCard}>
//             <Text style={styles.label}>{key}</Text>
//             <Text style={styles.value}>{value}</Text>
//           </View>
//         ))}
//       </View>
//     )}
//   </ScrollView>
// </View>
//   );
// }

// // 🌿 Styles
// const styles = StyleSheet.create({
// container: {
//   flex: 1,
//   backgroundColor: "#eafaf1", // soft gradient feel
//   padding: 16,
// },
// title: {
//   fontSize: 28,
//   fontWeight: "bold",
//   color: "#2e7d32",
//   textAlign: "center",
//   marginBottom: 20,
// },
// languageSelectorContainer: {
//   marginBottom: 16,
// },
// languageLabel: {
//   fontSize: 16,
//   fontWeight: "600",
//   color: "#388e3c",
//   marginBottom: 6,
// },
// languageButton: {
//   paddingVertical: 8,
//   paddingHorizontal: 16,
//   marginRight: 8,
//   borderRadius: 25,
//   backgroundColor: "#c8e6c9",
//   transition: "all 0.2s",
// },
// languageButtonSelected: {
//   backgroundColor: "#388e3c",
// },
// languageButtonText: {
//   color: "#fff",
//   fontWeight: "700",
//   fontSize: 14,
// },
// scroll: {
//   marginTop: 10,
// },
// weatherCard: {
//   backgroundColor: "#ffffff",
//   borderRadius: 20,
//   padding: 20,
//   marginBottom: 18,
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 6 },
//   shadowOpacity: 0.12,
//   shadowRadius: 12,
//   elevation: 6,
// },
// translatedCard: {
//   backgroundColor: "#e3f2fd",
// },
// cardTitle: {
//   fontSize: 20,
//   fontWeight: "bold",
//   color: "#2E7D32",
//   textAlign: "center",
//   marginBottom: 16,
// },
// fieldCard: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "center",
//   backgroundColor: "#f0fff4",
//   padding: 12,
//   borderRadius: 14,
//   marginBottom: 10,
//   shadowColor: "#000",
//   shadowOpacity: 0.05,
//   shadowOffset: { width: 0, height: 2 },
//   shadowRadius: 4,
//   elevation: 2,
// },
// label: {
//   fontSize: 16,
//   fontWeight: "600",
//   color: "#388E3C",
// },
// value: {
//   fontSize: 16,
//   fontWeight: "500",
//   color: "#333",
// },
// loadingContainer: {
//   flex: 1,
//   justifyContent: "center",
//   alignItems: "center",
//   backgroundColor: "#eafaf1",
// },
// loadingText: {
//   fontSize: 16,
//   fontWeight: "600",
//   color: "#388E3C",
//   marginTop: 10,
// },
// });





































// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   Platform,
//   Alert,
//   TouchableOpacity,
// } from "react-native";
// import * as Location from "expo-location";
// import baseURL from "./config";

// export default function Weather() {
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [translatedWeather, setTranslatedWeather] = useState(null);
//   const [targetLanguage, setTargetLanguage] = useState("hindi"); // default language
//   const [location, setLocation] = useState(null);

//   // ✅ Translation function
//   const translateText = async (text, targetLang) => {
//     if (!text) return "";
//     try {
//       const response = await fetch(
//         `${baseURL}/translate?text=${encodeURIComponent(text)}&target_language=${targetLang}`
//       );
//       if (!response.ok) throw new Error("Translation failed");
//       const data = await response.json();
//       return data.translated_text;
//     } catch (error) {
//       console.error("Translation error:", error);
//       return text; // fallback to original text
//     }
//   };

//   // ✅ Get device location
//   const getDeviceLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission Denied",
//           "Location permission is required to fetch weather data."
//         );
//         return null;
//       }

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });
      
//       console.log("📍 Device Coordinates:", location.coords.latitude, location.coords.longitude);
//       return location.coords;
//     } catch (error) {
//       console.error("Error getting location:", error);
//       Alert.alert("Error", "Unable to get your location. Using approximate location instead.");
//       return null;
//     }
//   };

//   // ✅ Fetch Weather with location
//   useEffect(() => {
//     const fetchWeather = async () => {
//       setLoading(true);
//       try {
//         // Get device location first
//         const coords = await getDeviceLocation();
        
//         let url = `${baseURL}/weather`;
        
//         // If we have coordinates, add them as query parameters
//         if (coords) {
//           url += `?lat=${coords.latitude}&lon=${coords.longitude}`;
//         }
        
//         console.log("🌐 Fetching from:", url);
        
//         const response = await fetch(url, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });

//         const text = await response.text();
//         console.log("🌐 Raw server response:", text);

//         try {
//           const data = JSON.parse(text);
//           console.log("✅ Weather data received:", data);
//           setWeather(data);
//           setLocation(coords);

//           // ✅ Translate right after fetching
//           const translated = {};
//           for (let key in data) {
//             if (!["City", "Timestamp"].includes(key)) {
//               translated[key] = await translateText(data[key].toString(), targetLanguage);
//             }
//           }
//           setTranslatedWeather(translated);
//         } catch (err) {
//           console.error("❌ Response not JSON:", err);
//           console.log("📄 Received content:", text);
//           Alert.alert("Error", "Server returned invalid data. Please try again.");
//         }
//       } catch (error) {
//         console.error("🌐 Error fetching weather:", error);
//         Alert.alert("Error", "Unable to fetch weather data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWeather();
//   }, [targetLanguage]);

//   // ✅ Optional debug: get IP info
//   useEffect(() => {
//     fetch(`${baseURL}/get_ip_location`)
//       .then((res) => res.json())
//       .then((data) => console.log("🌍 Device IP:", data.client_ip))
//       .catch((err) => console.error("Error getting IP:", err));
//   }, []);

//   // ✅ Loading UI
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text style={styles.loadingText}>Getting your location & fetching weather...</Text>
//       </View>
//     );
//   }

//   // ✅ No weather data UI
//   if (!weather) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.noDataText}>No weather data available.</Text>
//       </View>
//     );
//   }

//   // ✅ Main weather UI
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🌤️ Weather Dashboard</Text>
      
//       {/* Location indicator */}
//       {location && (
//         <View style={styles.locationIndicator}>
//           <Text style={styles.locationText}>
//             📍 Using precise GPS location
//           </Text>
//         </View>
//       )}

//       {/* Language Selector */}
//       <View style={styles.languageSelectorContainer}>
//         <Text style={styles.languageLabel}>Select Language:</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {[
//             "bengali","bhojpuri","gujarati","hindi","kannada","maithili",
//             "malayalam","marathi","meitei","odia","punjabi","sanskrit",
//             "tamil","telugu","urdu","santali","awadhi","bodo","khasi",
//             "kokborok","marwadi","tulu",
//           ].map((lang) => (
//             <TouchableOpacity
//               key={lang}
//               style={[
//                 styles.languageButton,
//                 targetLanguage === lang && styles.languageButtonSelected
//               ]}
//               onPress={() => setTargetLanguage(lang)}
//             >
//               <Text style={[
//                 styles.languageButtonText,
//                 targetLanguage === lang && styles.languageButtonTextSelected
//               ]}>
//                 {lang.toUpperCase()}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       <ScrollView style={styles.scroll}>
//         {/* Weather Card */}
//         <View style={styles.weatherCard}>
//           <Text style={styles.cardTitle}>🌡️ Original Weather</Text>
//           {Object.entries(weather)
//             .filter(([key]) => !["City", "Timestamp"].includes(key))
//             .map(([key, value]) => (
//               <View key={key} style={styles.fieldCard}>
//                 <Text style={styles.label}>{key}</Text>
//                 <Text style={styles.value}>{value}</Text>
//               </View>
//           ))}
//         </View>

//         {translatedWeather && (
//           <View style={[styles.weatherCard, styles.translatedCard]}>
//             <Text style={styles.cardTitle}>🌐 Translated Weather ({targetLanguage.toUpperCase()})</Text>
//             {Object.entries(translatedWeather).map(([key, value]) => (
//               <View key={key} style={styles.fieldCard}>
//                 <Text style={styles.label}>{key}</Text>
//                 <Text style={styles.value}>{value}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// // 🌿 Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#eafaf1",
//     padding: 16,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#2e7d32",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   locationIndicator: {
//     backgroundColor: "#4CAF50",
//     padding: 8,
//     borderRadius: 20,
//     marginBottom: 16,
//     alignSelf: "center",
//   },
//   locationText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   languageSelectorContainer: {
//     marginBottom: 16,
//   },
//   languageLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#388e3c",
//     marginBottom: 6,
//   },
//   languageButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     marginRight: 8,
//     borderRadius: 25,
//     backgroundColor: "#c8e6c9",
//   },
//   languageButtonSelected: {
//     backgroundColor: "#388e3c",
//   },
//   languageButtonText: {
//     color: "#2e7d32",
//     fontWeight: "700",
//     fontSize: 14,
//   },
//   languageButtonTextSelected: {
//     color: "#fff",
//   },
//   scroll: {
//     marginTop: 10,
//   },
//   weatherCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 18,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   translatedCard: {
//     backgroundColor: "#e3f2fd",
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#2E7D32",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   fieldCard: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#f0fff4",
//     padding: 12,
//     borderRadius: 14,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#388E3C",
//   },
//   value: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#333",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#eafaf1",
//   },
//   loadingText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#388E3C",
//     marginTop: 10,
//   },
//   noDataText: {
//     fontSize: 18,
//     color: "#666",
//     textAlign: "center",
//     marginTop: 50,
//   },
// });











































import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import baseURL from "./config";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translatedWeather, setTranslatedWeather] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("hindi");
  const [locationSource, setLocationSource] = useState(null);
  const [compatibleData, setCompatibleData] = useState(null); // For /compatible endpoint
  const [selectedLeaf, setSelectedLeaf] = useState("healthy"); // For disease analysis
  const [viewMode, setViewMode] = useState("weather"); // "weather" or "compatible"

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
      return text;
    }
  };

  // ✅ Translate weather data
  const translateWeatherData = async (data, targetLang) => {
    const translated = {};
    for (let key in data) {
      if (typeof data[key] === 'string' || typeof data[key] === 'number') {
        translated[key] = await translateText(data[key].toString(), targetLang);
      } else {
        translated[key] = data[key];
      }
    }
    return translated;
  };

  // ✅ Get device location (GPS)
  const getDeviceLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required for accurate weather. Using IP-based location instead."
        );
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      console.log("📍 Device GPS Coordinates:", location.coords.latitude, location.coords.longitude);
      return location.coords;
    } catch (error) {
      console.error("Error getting GPS location:", error);
      return null;
    }
  };

  // ✅ Fetch Current Weather (using /weather/current)
  const fetchCurrentWeather = async () => {
    try {
      console.log("🌐 Fetching current weather from:", `${baseURL}/weather/current`);
      
      const response = await fetch(`${baseURL}/weather/current`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Weather data received:", data);
      
      setWeather(data);
      setLocationSource("gps/ip"); // Backend auto-detects
      
      // Translate the data
      const translated = await translateWeatherData(data, targetLanguage);
      setTranslatedWeather(translated);
      
    } catch (error) {
      console.error("❌ Error fetching weather:", error);
      Alert.alert("Error", "Unable to fetch weather data. Please try again later.");
    }
  };

  // ✅ Fetch Compatible Weather (for potato disease analysis)
  const fetchCompatibleWeather = async (leafType) => {
    try {
      console.log("🌐 Fetching compatible weather from:", `${baseURL}/weather/compatible?leaf=${leafType}`);
      
      const response = await fetch(`${baseURL}/weather/compatible?leaf=${leafType}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Compatible weather data received:", data);
      
      setCompatibleData(data);
      
      // Translate the data
      const translated = await translateWeatherData(data, targetLanguage);
      setTranslatedWeather(translated);
      
    } catch (error) {
      console.error("❌ Error fetching compatible weather:", error);
      Alert.alert("Error", "Unable to fetch disease analysis data. Please try again later.");
    }
  };

  // ✅ Main data fetch based on view mode
  const fetchData = async () => {
    setLoading(true);
    try {
      if (viewMode === "weather") {
        await fetchCurrentWeather();
      } else {
        await fetchCompatibleWeather(selectedLeaf);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh data when view mode, leaf type, or language changes
  useEffect(() => {
    fetchData();
  }, [viewMode, selectedLeaf]);

  // ✅ Re-translate when language changes
  useEffect(() => {
    const reTranslate = async () => {
      if (viewMode === "weather" && weather) {
        const translated = await translateWeatherData(weather, targetLanguage);
        setTranslatedWeather(translated);
      } else if (viewMode === "compatible" && compatibleData) {
        const translated = await translateWeatherData(compatibleData, targetLanguage);
        setTranslatedWeather(translated);
      }
    };
    
    if (weather || compatibleData) {
      reTranslate();
    }
  }, [targetLanguage]);

  // ✅ Loading UI
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  // ✅ No data UI
  if (!weather && !compatibleData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No weather data available.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Get current display data
  const currentData = viewMode === "weather" ? weather : compatibleData;

  // ✅ Main weather UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤️ Potato Weather Assistant</Text>
      
      {/* View Mode Selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === "weather" && styles.modeButtonActive]}
          onPress={() => setViewMode("weather")}
        >
          <Text style={[styles.modeButtonText, viewMode === "weather" && styles.modeButtonTextActive]}>
            Current Weather
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modeButton, viewMode === "compatible" && styles.modeButtonActive]}
          onPress={() => setViewMode("compatible")}
        >
          <Text style={[styles.modeButtonText, viewMode === "compatible" && styles.modeButtonTextActive]}>
            Disease Analysis
          </Text>
        </TouchableOpacity>
      </View>

      {/* Leaf Type Selector (only for compatible mode) */}
      {viewMode === "compatible" && (
        <View style={styles.leafSelector}>
          <Text style={styles.leafLabel}>Select Leaf Condition:</Text>
          <View style={styles.leafButtons}>
            {["healthy", "early blight", "late blight"].map((leaf) => (
              <TouchableOpacity
                key={leaf}
                style={[styles.leafButton, selectedLeaf === leaf && styles.leafButtonActive]}
                onPress={() => setSelectedLeaf(leaf)}
              >
                <Text style={[styles.leafButtonText, selectedLeaf === leaf && styles.leafButtonTextActive]}>
                  {leaf.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

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
              <Text style={[
                styles.languageButtonText,
                targetLanguage === lang && styles.languageButtonTextSelected
              ]}>
                {lang.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Original Weather Data Card */}
        <View style={styles.weatherCard}>
          <Text style={styles.cardTitle}>
            {viewMode === "weather" ? "🌡️ Current Weather Information" : "🌡️ Weather & Disease Analysis"}
          </Text>
          
          {currentData && Object.entries(currentData).map(([key, value]) => {
            // Skip internal fields for weather mode
            if (viewMode === "weather" && ["City", "Timestamp"].includes(key)) {
              return null;
            }
            
            // Format the display label
            let displayKey = key.replace(/([A-Z])/g, ' $1').trim();
            displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1);
            
            // Special formatting for specific fields
            if (key === "Potato Suitability") {
              displayKey = "🥔 Potato Suitability";
            } else if (key === "Risk Level") {
              displayKey = "⚠️ Risk Level";
            } else if (key === "Disease Analysis") {
              displayKey = "🔬 Disease Analysis";
            } else if (key === "Feels Like") {
              displayKey = "🌡️ Feels Like";
            } else if (key === "Dew Point") {
              displayKey = "💧 Dew Point";
            } else if (key === "Wind Speed") {
              displayKey = "💨 Wind Speed";
            }
            
            // Color code based on values
            let valueStyle = {};
            if (key === "Potato Suitability") {
              if (value === "Suitable") valueStyle = styles.suitable;
              else if (value === "Unsuitable") valueStyle = styles.unsuitable;
              else valueStyle = styles.moderate;
            } else if (key === "Risk Level") {
              if (value === "Low") valueStyle = styles.lowRisk;
              else if (value === "High" || value === "Very High") valueStyle = styles.highRisk;
              else valueStyle = styles.mediumRisk;
            }
            
            return (
              <View key={key} style={styles.fieldCard}>
                <Text style={styles.label}>{displayKey}</Text>
                <Text style={[styles.value, valueStyle]}>{value}</Text>
              </View>
            );
          })}
        </View>

        {/* Translated Data Card */}
        {translatedWeather && Object.keys(translatedWeather).length > 0 && (
          <View style={[styles.weatherCard, styles.translatedCard]}>
            <Text style={styles.cardTitle}>🌐 Translated ({targetLanguage.toUpperCase()})</Text>
            {Object.entries(translatedWeather).map(([key, value]) => {
              // Skip internal fields
              if (viewMode === "weather" && ["City", "Timestamp"].includes(key)) {
                return null;
              }
              
              let displayKey = key.replace(/([A-Z])/g, ' $1').trim();
              displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1);
              
              return (
                <View key={key} style={styles.fieldCard}>
                  <Text style={styles.label}>{displayKey}</Text>
                  <Text style={styles.value}>{value}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Location Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            📍 Location: {currentData?.City || "Auto-detected"}
          </Text>
          {currentData?.Timestamp && (
            <Text style={styles.infoText}>
              🕐 Last Updated: {currentData.Timestamp}
            </Text>
          )}
          <Text style={styles.infoText}>
            🎯 Location Source: {locationSource || "Auto-detected by server"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// 🌿 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eafaf1",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
    marginBottom: 16,
  },
  modeSelector: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#c8e6c9",
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#4CAF50",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e7d32",
  },
  modeButtonTextActive: {
    color: "#fff",
  },
  leafSelector: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  leafLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#388e3c",
    marginBottom: 8,
  },
  leafButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  leafButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e8f5e9",
  },
  leafButtonActive: {
    backgroundColor: "#4CAF50",
  },
  leafButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2e7d32",
  },
  leafButtonTextActive: {
    color: "#fff",
  },
  languageSelectorContainer: {
    marginBottom: 16,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#388e3c",
    marginBottom: 6,
  },
  languageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
    borderRadius: 20,
    backgroundColor: "#c8e6c9",
  },
  languageButtonSelected: {
    backgroundColor: "#388e3c",
  },
  languageButtonText: {
    color: "#2e7d32",
    fontWeight: "600",
    fontSize: 11,
  },
  languageButtonTextSelected: {
    color: "#fff",
  },
  scroll: {
    marginTop: 10,
  },
  weatherCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  translatedCard: {
    backgroundColor: "#e3f2fd",
  },
  cardTitle: {
    fontSize: 18,
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
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#388E3C",
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  suitable: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  unsuitable: {
    color: "#f44336",
    fontWeight: "bold",
  },
  moderate: {
    color: "#FF9800",
    fontWeight: "bold",
  },
  lowRisk: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  highRisk: {
    color: "#f44336",
    fontWeight: "bold",
  },
  mediumRisk: {
    color: "#FF9800",
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
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
  noDataText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});