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






























import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Platform, Alert } from "react-native";
import * as Location from "expo-location";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let response;

        if (Platform.OS === "android") {
          // ✅ ANDROID: Use GPS-based location
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission denied", "Location permission is required for weather data.");
            setLoading(false);
            return;
          }

          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          console.log("📍 Android Coordinates:", latitude, longitude);

          response = await fetch(`https://3844a028445d.ngrok-free.app/weather`);
        } else {
          // ✅ WEB/WINDOWS: Use IP-based location
          console.log("🌐 Using IP-based location for Web/Windows...");
          response = await fetch(`https://3844a028445d.ngrok-free.app/weather`);
        }

        if (!response.ok) {
          const text = await response.text();
          console.error("❌ Server responded with non-OK:", response.status, text);
          throw new Error("Failed to fetch weather data.");
        }

        // Validate JSON content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("❌ Non-JSON response:", text);
          throw new Error("Response is not JSON");
        }

        const data = await response.json();
        console.log("✅ Weather data:", data);
        setWeather(data);
      } catch (error) {
        console.error("Error getting weather:", error);
        Alert.alert("Error", "Unable to fetch weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // IP check (optional)
  useEffect(() => {
    fetch("https://3844a028445d.ngrok-free.app/get_ip_location")
      .then((res) => res.json())
      .then((data) => console.log("Device IP:", data.client_ip))
      .catch((err) => console.error("Error getting IP:", err));
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#74b577ff" />
        <Text style={styles.text}>Fetching weather data...</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No weather data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Information</Text>
      <ScrollView>
        {Object.entries(weather).map(([key, value]) => (
          <View key={key} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </Text>
            <Text style={{ fontSize: 16 }}>{value.toString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#74b577ff",
    textAlign: "center",
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
