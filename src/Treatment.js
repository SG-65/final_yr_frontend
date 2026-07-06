import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from "react-native";

const leafData = [
  {
    id: 1,
    name: "Early Blight",
    image: require("../assets/early_blight_leaf.jpeg"), // replace with your image
    description: "Brown spots with concentric rings (target-like) on older leaves,leading to leaf drop.",
    cause: "Fungus Alternaria solani.",
    treatment:
        {
            organic: "Use compost tea spray, neem oil, crop rotation.",
            chemical: "Use fungicides like Chlorothalonil or Copper oxychloride."
        }
  },
  {
    id: 2,
    name: "Late Blight",
    image: require("../assets/late_blight_leaf.jpeg"), // replace with your image
    description: "Dark brown irregular spots on leaves with white fungal growth on undersides. Spreads rapidly in humid conditions.",
    cause: "Fungus-like organism Phytophthora infestans.",
    treatment:
        {
            organic: "Remove infected leaves, spray neem oil or garlic extract, maintain spacing for airflow.",
            chemical: "Apply fungicides like Mancozeb or Metalaxyl."
        }
  },
  {
    id: 3,
    name: "Potato Leaf Curl",
    image: require("../assets/potato_leaf_curl.jpeg"), // replace with your image
    description: "Leaves curl upwards, plant becomes stunted, reduced yield.",
    cause: "Potato Leaf Curl Virus (PLCV), spread by aphids.",
    treatment:
        {
            organic: "Control aphids with neem oil or ladybird beetles, remove infected plants.",
            chemical: "Spray insecticides like Imidacloprid to manage aphid vectors"
        }
   },
   {
    id: 4,
    name: "Potato Mosaic",
    image: require("../assets/Potato_Mosaic.jpeg"), // replace with your image
    description: "Leaves show mottled light and dark green patches, poor growth.",
    cause: "Potato Mosaic Virus (PMV), transmitted by insects.",
    treatment:
        {
            organic: "Remove infected plants, control insect vectors with neem oil.",
            chemical: "Use systemic insecticides to reduce spread by aphids/whiteflies."
        }
   },
   {
    id: 5,
    name: "Fusarium Wilt",
    image: require("../assets/Fusarium_Wilt.jpeg"), // replace with your image
    description: "Leaves turn yellow and wilt; brown discoloration inside stems.",
    cause: "Soil-borne fungus Fusarium oxysporum.",
    treatment:
        {
            organic: "Solarize soil, use resistant varieties, apply Trichoderma biofungicide.",
            chemical: "Soil drenching with Carbendazim or Thiophanate-methyl."
        }
   },
   {
    id: 6,
    name: "Septoria Leaf Spot",
    image: require("../assets/Septoria_Leaf_Spot.jpeg"), // replace with your image
    description: "Small round brown spots with dark margins on leaves, causing drying.",
    cause: "Fungus Alternaria solani.",
    treatment:
        {
            organic: "Prune affected leaves, spray compost extract.",
            chemical: "Apply Copper fungicides or Mancozeb."
        }
   },
   {
    id: 7,
    name: "Bacterial Leaf Spot",
    image: require("../assets/Bacterial_Leaf_Spot.jpeg"), // replace with your image
    description: "Water-soaked spots that later turn brown/black, spreading by rain splash.",
    cause: "Bacterium Xanthomonas campestris.",
    treatment:
        {
            organic: "Remove infected debris, improve field sanitation, spray neem extract.",
            chemical: "Use Copper-based bactericides or Streptomycin sprays."
        }
   },
];

export default function Treatment() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Treatment Suggestions</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 10 }}
        snapToInterval={Dimensions.get("window").width * 0.82}
        decelerationRate="fast"
      >
        {leafData.map((leaf) => (
          <View key={leaf.id} style={styles.card}>
            <Image source={leaf.image} style={styles.leafImage} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{leaf.name}</Text>
            </View>

            <Text style={styles.label}>Description</Text>
            <Text style={styles.text}>{leaf.description}</Text>

            <Text style={styles.label}>Cause</Text>
            <Text style={styles.text}>{leaf.cause}</Text>

            <Text style={styles.label}>Treatment</Text>
            {typeof leaf.treatment === "string" ? (
              <Text style={styles.text}>{leaf.treatment}</Text>
            ) : (
              <View style={{ marginVertical: 4 }}>
                <Text style={styles.organic}>Organic: {leaf.treatment.organic}</Text>
                <Text style={styles.chemical}>Chemical: {leaf.treatment.chemical}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Chatbot */}
      <View style={styles.chatbotContainer}>
        <Text style={styles.chatbotTitle}>🤖 AI Plant Doctor</Text>
        <Text style={styles.chatbotText}>
          Ask me anything about plant diseases, treatments, or prevention tips.
        </Text>
        <View style={styles.chatInput}>
          <Text style={styles.placeholder}>Type your question here...</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9f7",
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    width: width * 0.82,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    position: "relative",
  },
  leafImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#4caf50",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
    lineHeight: 20,
  },
  organic: {
    fontSize: 14,
    color: "#2e7d32",
    marginTop: 2,
    fontWeight: "600",
  },
  chemical: {
    fontSize: 14,
    color: "#c62828",
    marginTop: 2,
    fontWeight: "600",
  },
  chatbotContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#e8f5e9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  chatbotTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
  },
  chatbotText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  chatInput: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  placeholder: {
    color: "#888",
    fontSize: 14,
  },
});