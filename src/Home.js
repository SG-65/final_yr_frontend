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

        {/* logbook Card */}
        <TouchableOpacity 
          style={[styles.card, styles.cardShadow]} 
          onPress={() => navigation.navigate("Logbook")}
        >
          <View style={styles.cardContent}>
            <MaterialIcons name="person" size={40} color="#2196f3" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Your Logbook</Text>
              <Text style={styles.cardSubtitle}>View and edit your information</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardButtonText}>Go to Logbook</Text>
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
































// import React, { useEffect } from "react";
// import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
// import { useLanguage } from "./globalLanguage";
// import { Picker } from "@react-native-picker/picker";

// const defaultText = {
//   welcome: "Welcome to Leafyfication!",
//   subText: "Take care of your plants with ease.",
//   diagnoseTitle: "Diagnose Your Plant",
//   diagnoseSubtitle: "Detect disease from your plant's leaves",
//   diagnoseButton: "Go to Diagnose",
//   treatmentTitle: "Get Treatment Suggestions",
//   treatmentSubtitle: "Learn how to treat your plant effectively",
//   treatmentButton: "Go to Treatment",
//   profileTitle: "Your Profile",
//   profileSubtitle: "View and edit your information",
//   profileButton: "Go to Profile",
// };

// export default function Home({ navigation }) {
//   const { language, switchLanguage, translations, translateBulk, refreshKey } = useLanguage();

//   // translate UI labels on app load or language change
//   useEffect(() => {
//     translateBulk(defaultText);
//   }, [refreshKey]);

//   const t = (key) => translations[key] || defaultText[key];

//   return (
//     <SafeAreaView style={styles.safeArea} key={refreshKey}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Picker selectedValue={language} onValueChange={(value) => switchLanguage(value)} style={styles.picker}>
//           <Picker.Item label="English" value="english" />
//           <Picker.Item label="Hindi" value="hindi" />
//           <Picker.Item label="Bengali" value="bengali" />
//           <Picker.Item label="Tamil" value="tamil" />
//           <Picker.Item label="Telugu" value="telugu" />
//           <Picker.Item label="Marathi" value="marathi" />
//         </Picker>

//         <Text style={styles.welcomeText}>{t("welcome")}</Text>
//         <Text style={styles.subText}>{t("subText")}</Text>

//         {/* Diagnose Card */}
//         <TouchableOpacity style={[styles.card, styles.cardShadow]} onPress={() => navigation.navigate("Diagnose")}>
//           <View style={styles.cardContent}>
//             <MaterialIcons name="local-florist" size={40} color="#4caf50" />
//             <View style={{ flex: 1, marginLeft: 12 }}>
//               <Text style={styles.cardTitle}>{t("diagnoseTitle")}</Text>
//               <Text style={styles.cardSubtitle}>{t("diagnoseSubtitle")}</Text>
//             </View>
//           </View>
//           <View style={styles.cardFooter}>
//             <Text style={styles.cardButtonText}>{t("diagnoseButton")}</Text>
//           </View>
//         </TouchableOpacity>

//         {/* Treatment Card */}
//         <TouchableOpacity style={[styles.card, styles.cardShadow]} onPress={() => navigation.navigate("Treatment")}>
//           <View style={styles.cardContent}>
//             <FontAwesome5 name="pills" size={40} color="#f57c00" />
//             <View style={{ flex: 1, marginLeft: 12 }}>
//               <Text style={styles.cardTitle}>{t("treatmentTitle")}</Text>
//               <Text style={styles.cardSubtitle}>{t("treatmentSubtitle")}</Text>
//             </View>
//           </View>
//           <View style={styles.cardFooter}>
//             <Text style={styles.cardButtonText}>{t("treatmentButton")}</Text>
//           </View>
//         </TouchableOpacity>

//         {/* Profile Card */}
//         <TouchableOpacity style={[styles.card, styles.cardShadow]} onPress={() => navigation.navigate("Profile")}>
//           <View style={styles.cardContent}>
//             <MaterialIcons name="person" size={40} color="#2196f3" />
//             <View style={{ flex: 1, marginLeft: 12 }}>
//               <Text style={styles.cardTitle}>{t("profileTitle")}</Text>
//               <Text style={styles.cardSubtitle}>{t("profileSubtitle")}</Text>
//             </View>
//           </View>
//           <View style={styles.cardFooter}>
//             <Text style={styles.cardButtonText}>{t("profileButton")}</Text>
//           </View>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // styles remain the same
// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#f2f6f9" },
//   container: { padding: 16 },
//   welcomeText: { fontSize: 26, fontWeight: "bold", color: "#2e7d32", marginBottom: 4 },
//   subText: { fontSize: 16, color: "#666", marginBottom: 20 },
//   card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 20 },
//   cardShadow: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 6 },
//   cardContent: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
//   cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 4 },
//   cardSubtitle: { fontSize: 14, color: "#555" },
//   cardFooter: { marginTop: 8, backgroundColor: "#4caf50", paddingVertical: 10, borderRadius: 12, alignItems: "center" },
//   cardButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   picker: { marginBottom: 16 },
// });







