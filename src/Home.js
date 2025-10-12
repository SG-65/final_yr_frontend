// import React from "react";
// import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Home({ navigation }) {
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.container}>

//         {/* Welcome Message */}
//         <Text style={styles.welcomeText}>Welcome to Leafyfication!</Text>

//         {/* Diagnose Card */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Diagnose Your Plant</Text>
//           <Text style={styles.cardSubtitle}>Detect disease from your plant's leaves</Text>
//           <TouchableOpacity 
//             style={styles.cardButton} 
//             onPress={() => navigation.navigate("Diagnose")}
//           >
//             <Text style={styles.cardButtonText}>Go to Diagnose</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Treatment Card */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Get Treatment Suggestions</Text>
//           <Text style={styles.cardSubtitle}>Learn how to treat your plant effectively</Text>
//           <TouchableOpacity 
//             style={styles.cardButton} 
//             onPress={() => navigation.navigate("Treatment")}
//           >
//             <Text style={styles.cardButtonText}>Go to Treatment</Text>
//           </TouchableOpacity>
//         </View>
        
//         {/* Profile Card */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Your Profile</Text>
//           <Text style={styles.cardSubtitle}>View and edit your information</Text>
//           <TouchableOpacity 
//             style={styles.cardButton} 
//             onPress={() => navigation.navigate("Profile")}
//           >
//             <Text style={styles.cardButtonText}>Go to Profile</Text>
//           </TouchableOpacity>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f9f9f9",
//   },
//   container: {
//     padding: 16,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   logo: {
//     width: 50,
//     height: 50,
//     marginRight: 12,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#2e7d32",
//   },
//   welcomeText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 4,
//   },
//   subText: {
//     fontSize: 16,
//     color: "#555",
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3, // for Android shadow
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 8,
//     color: "#2e7d32",
//   },
//   cardSubtitle: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 12,
//   },
//   cardButton: {
//     backgroundColor: "#4caf50",
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   cardButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     textAlign: "center",
//     fontWeight: "bold",
//   },
// });






import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Icons for more visual appeal

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Welcome Message */}
        <Text style={styles.welcomeText}>Welcome to Leafyfication!</Text>
        <Text style={styles.subText}>Take care of your plants with ease.</Text>

        {/* Diagnose Card */}
        <TouchableOpacity 
          style={[styles.card, styles.cardShadow]} 
          onPress={() => navigation.navigate("Diagnose")}
        >
          <View style={styles.cardContent}>
            <MaterialIcons name="local-florist" size={40} color="#4caf50" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Diagnose Your Plant</Text>
              <Text style={styles.cardSubtitle}>Detect disease from your plant's leaves</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardButtonText}>Go to Diagnose</Text>
          </View>
        </TouchableOpacity>

        {/* Treatment Card */}
        <TouchableOpacity 
          style={[styles.card, styles.cardShadow]} 
          onPress={() => navigation.navigate("Treatment")}
        >
          <View style={styles.cardContent}>
            <FontAwesome5 name="pills" size={40} color="#f57c00" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Get Treatment Suggestions</Text>
              <Text style={styles.cardSubtitle}>Learn how to treat your plant effectively</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardButtonText}>Go to Treatment</Text>
          </View>
        </TouchableOpacity>

        {/* Profile Card */}
        <TouchableOpacity 
          style={[styles.card, styles.cardShadow]} 
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.cardContent}>
            <MaterialIcons name="person" size={40} color="#2196f3" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Your Profile</Text>
              <Text style={styles.cardSubtitle}>View and edit your information</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardButtonText}>Go to Profile</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f6f9",
  },
  container: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  cardFooter: {
    marginTop: 8,
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

