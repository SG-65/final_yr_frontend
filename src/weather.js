// import React, {useEffect, useState} from "react";
// import { View, Text, Image, StyleSheet, ScrollView, Dimensions, Alert , ActivityIndicator} from "react-native";
// import * as Location from 'expo-location';

// export default function Weather() {
//     const [weather, setWeather] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(()=>{
//         (async () => {
//             try{
//             // Request location permissions
//               const { status } = await Location.requestForegroundPermissionsAsync();
//               if (status !== 'granted') {
//                 console.log('Permission to access location was denied');
//                 setLoading(false);
//                 return;
//               }
//               // Get current location
//               const location = await Location.getCurrentPositionAsync({});
//               const response = await fetch(`https://8edbff1d3a8b.ngrok-free.app/weather`);

//               if (!response.ok) {
//                 throw new Error('Network response was not ok');
//               }
//               const data = await response.json();
//               setWeather(data);
//               console.log('Weather data:', data);
//             } catch (error) {
//               console.log('Error getting location:', error);
//               Alert.alert("Error fetching weather data. Please try again later.");
//               setLoading(false);
//             }finally{
//                 setLoading(false);
//             }
//         })();
//     },[]);

//     useEffect(() => {
//         fetch("https://8edbff1d3a8b.ngrok-free.app/get_ip_location")
//        .then(res => res.json())
//       .then(data => console.log("Device IP:", data.client_ip))
//        .catch(err => console.error(err));

//     },[]);

//     if (loading) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#74b577ff" />
//                 <Text style={styles.text}>Fetching weather data...</Text>
//             </View>
//         );
//     }
//     // if (!weather) {
//     //     return (
//     //         <View style={styles.container}>
//     //         <ScrollView>
//     //             {Object.entries(weather).map(([key, value]) => (
//     //                 <View key={key} style={{marginBottom: 10}}>
//     //                     <Text style={{fontWeight: 'bold', fontSize: 16}}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
//     //                     <Text style={{fontSize: 16}}>{value.toString()}</Text>
//     //                 </View>
//     //             ))}
//     //         </ScrollView>
//     //         <Text style={styles.text}>No weather data available.</Text>
//     //         </View>
//     //     );
//     // }
//     if (!weather) {
//     return (
//         <View style={styles.container}>
//             <Text style={styles.text}>No weather data available.</Text>
//         </View>
//     );
// }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Weather Information</Text>
//             <ScrollView>
//                 {Object.entries(weather).map(([key, value]) => (
//                     <View key={key} style={{marginBottom: 10}}>
//                         <Text style={{fontWeight: 'bold', fontSize: 16}}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
//                         <Text style={{fontSize: 16}}>{value.toString()}</Text>
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#f9f9f9',
//     },
//     title: {
//         fontSize: 26,
//         fontWeight: 'bold',
//         color: '#74b577ff',
//         textAlign: 'center',
//         marginVertical: 20,
//     },
//     text: {
//         fontSize: 16,
//         color: '#333',
//         textAlign: 'center',
//     },
// });






























// import React, { useEffect, useState } from "react";
// import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Platform, Alert } from "react-native";
// import * as Location from "expo-location";

// export default function Weather() {
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         let response;

//         if (Platform.OS === "android") {
//           // ✅ ANDROID: Use GPS-based location
//           const { status } = await Location.requestForegroundPermissionsAsync();
//           if (status !== "granted") {
//             Alert.alert("Permission denied", "Location permission is required for weather data.");
//             setLoading(false);
//             return;
//           }

//           const location = await Location.getCurrentPositionAsync({});
//           const { latitude, longitude } = location.coords;

//           console.log("📍 Android Coordinates:", latitude, longitude);

//           response = await fetch(`https://3844a028445d.ngrok-free.app/weather`);
//         } else {
//           // ✅ WEB/WINDOWS: Use IP-based location
//           console.log("🌐 Using IP-based location for Web/Windows...");
//           response = await fetch(`https://3844a028445d.ngrok-free.app/weather`);
//         }

//         if (!response.ok) {
//           const text = await response.text();
//           console.error("❌ Server responded with non-OK:", response.status, text);
//           throw new Error("Failed to fetch weather data.");
//         }

//         // Validate JSON content type
//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//           const text = await response.text();
//           console.error("❌ Non-JSON response:", text);
//           throw new Error("Response is not JSON");
//         }

//         const data = await response.json();
//         console.log("✅ Weather data:", data);
//         setWeather(data);
//       } catch (error) {
//         console.error("Error getting weather:", error);
//         Alert.alert("Error", "Unable to fetch weather data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // IP check (optional)
//   useEffect(() => {
//     fetch("https://3844a028445d.ngrok-free.app/get_ip_location")
//       .then((res) => res.json())
//       .then((data) => console.log("Device IP:", data.client_ip))
//       .catch((err) => console.error("Error getting IP:", err));
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#74b577ff" />
//         <Text style={styles.text}>Fetching weather data...</Text>
//       </View>
//     );
//   }

//   if (!weather) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>No weather data available.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Weather Information</Text>
//       <ScrollView>
//         {Object.entries(weather).map(([key, value]) => (
//           <View key={key} style={{ marginBottom: 10 }}>
//             <Text style={{ fontWeight: "bold", fontSize: 16 }}>
//               {key.charAt(0).toUpperCase() + key.slice(1)}:
//             </Text>
//             <Text style={{ fontSize: 16 }}>{value.toString()}</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f9f9f9",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#74b577ff",
//     textAlign: "center",
//     marginVertical: 20,
//   },
//   text: {
//     fontSize: 16,
//     color: "#333",
//     textAlign: "center",
//   },
// });












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

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let response;
        const baseUrl = "https://fb74d7daea6c.ngrok-free.app";

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

          response = await fetch(`${baseUrl}/weather`);
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
    const baseUrl = "https://fb74d7daea6c.ngrok-free.app";
    fetch(`${baseUrl}/get_ip_location`)
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
