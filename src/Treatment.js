import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView
} from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import baseURL from './config';

const { width } = Dimensions.get("window");

// Fallback descriptions and causes for the three main diseases
const DISEASE_INFO = {
  "Early Blight": {
    description: "Brown spots with concentric rings (target-like) on older leaves, leading to leaf drop.",
    cause: "Fungus Alternaria solani."
  },
  "Late Blight": {
    description: "Dark brown irregular spots on leaves with white fungal growth on undersides. Spreads rapidly in humid conditions.",
    cause: "Fungus-like organism Phytophthora infestans."
  },
  "Healthy": {
    description: "Plant appears healthy with no visible disease symptoms.",
    cause: "No disease detected."
  }
};

export default function Treatment() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("english");
  const [translatedTreatment, setTranslatedTreatment] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [expandedDisease, setExpandedDisease] = useState(null);

  // Fetch all treatments from backend
  const fetchTreatments = async () => {
    try {
      setLoading(true);
      console.log("Fetching treatments from:", `${baseURL}/treatment/`);
      
      const response = await fetch(`${baseURL}/treatment/`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch treatments: ${response.status}`);
      }

      const data = await response.json();
      console.log("Treatments data received:", data);

      if (data.success && data.data) {
        const mainDiseases = ["early_blight", "late_blight", "healthy"];
        
        const formattedData = Object.keys(data.data)
          .filter(key => mainDiseases.includes(key.toLowerCase()))
          .map((key, index) => {
            const diseaseData = data.data[key];
            const diseaseName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const diseaseInfo = DISEASE_INFO[diseaseName] || {};
            
            return {
              id: index + 1,
              name: diseaseName,
              disease_key: key,
              description: diseaseInfo.description || "No description available.",
              cause: diseaseInfo.cause || "Unknown cause.",
              treatment: {
                organic: diseaseData.organic || diseaseData.organic_treatment || "Not specified",
                chemical: diseaseData.chemical || diseaseData.chemical_treatment || "Not specified"
              },
              preventive_measures: diseaseData.preventive_measures || [],
              resistant_varieties: diseaseData.resistant_varieties || [],
            };
          });
        
        setTreatments(formattedData);
      } else {
        Alert.alert("Error", "No treatment data available from the server.");
        setTreatments([]);
      }
    } catch (error) {
      console.error("Error fetching treatments:", error);
      Alert.alert("Error", "Could not fetch treatment data from server.");
      setTreatments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch disease-specific treatment
  const fetchDiseaseTreatment = async (diseaseName) => {
    try {
      setTranslating(true);
      console.log("Fetching detailed treatment for:", diseaseName);
      
      const response = await fetch(`${baseURL}/treatment/${encodeURIComponent(diseaseName)}`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch treatment: ${response.status}`);
      }

      const data = await response.json();
      console.log("Detailed treatment data received:", JSON.stringify(data, null, 2));
      
      const diseaseInfo = DISEASE_INFO[diseaseName] || {};
      if (!data.description) data.description = diseaseInfo.description || "No description available.";
      if (!data.cause) data.cause = diseaseInfo.cause || "Unknown cause.";
      
      setSelectedDisease(data);
      
      if (targetLanguage !== "english") {
        await translateTreatment(data);
      }
      
      if (expandedDisease === diseaseName) {
        setExpandedDisease(null);
        setSelectedDisease(null);
      } else {
        setExpandedDisease(diseaseName);
      }
      
    } catch (error) {
      console.error("Error fetching disease treatment:", error);
      Alert.alert("Error", `Could not fetch detailed treatment: ${error.message}`);
    } finally {
      setTranslating(false);
    }
  };

  // Translate text
  const translateText = async (text, targetLang) => {
    if (!text || targetLang === "english") return text;
    try {
      const response = await fetch(
        `${baseURL}/translate/?text=${encodeURIComponent(text)}&target_language=${targetLang}`
      );
      if (!response.ok) return text;
      const data = await response.json();
      return data.translated_text || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  // Translate treatment data
  const translateTreatment = async (treatmentData) => {
    if (!treatmentData || targetLanguage === "english") {
      setTranslatedTreatment(null);
      return;
    }

    try {
      const translated = {};
      
      if (treatmentData.disease) {
        translated.disease = await translateText(treatmentData.disease, targetLanguage);
      }
      if (treatmentData.description) {
        translated.description = await translateText(treatmentData.description, targetLanguage);
      }
      if (treatmentData.cause) {
        translated.cause = await translateText(treatmentData.cause, targetLanguage);
      }
      if (treatmentData.risk_level) {
        translated.risk_level = await translateText(treatmentData.risk_level, targetLanguage);
      }
      if (treatmentData.weather_based_treatment) {
        translated.weather_based_treatment = {};
        for (let key in treatmentData.weather_based_treatment) {
          const value = treatmentData.weather_based_treatment[key];
          if (Array.isArray(value)) {
            translated.weather_based_treatment[key] = await Promise.all(
              value.map(item => translateText(item, targetLanguage))
            );
          } else {
            translated.weather_based_treatment[key] = await translateText(
              String(value), 
              targetLanguage
            );
          }
        }
      }
      if (treatmentData.preventive_measures) {
        translated.preventive_measures = await Promise.all(
          treatmentData.preventive_measures.map(item => translateText(item, targetLanguage))
        );
      }
      if (treatmentData.resistant_varieties) {
        translated.resistant_varieties = await Promise.all(
          treatmentData.resistant_varieties.map(item => translateText(item, targetLanguage))
        );
      }
      if (treatmentData.average_risk_score !== undefined) {
        translated.average_risk_score = String(treatmentData.average_risk_score);
      }
      if (treatmentData.critical_period) {
        translated.critical_period = await translateText(treatmentData.critical_period, targetLanguage);
      }
      
      setTranslatedTreatment(translated);
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  useEffect(() => {
    if (selectedDisease && targetLanguage !== "english") {
      translateTreatment(selectedDisease);
    }
  }, [targetLanguage]);

  useEffect(() => {
    fetchTreatments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTreatments();
  };

  const getRiskColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f44336';
      case 'moderate': return '#FF9800';
      case 'low': return '#4CAF50';
      case 'very low': return '#2E7D32';
      default: return '#666';
    }
  };

  const getRiskBgColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'critical': return '#ffebee';
      case 'high': return '#fce4ec';
      case 'moderate': return '#fff3e0';
      case 'low': return '#e8f5e9';
      case 'very low': return '#e8f5e9';
      default: return '#f5f5f5';
    }
  };

  const getRiskEmoji = (level) => {
    switch(level?.toLowerCase()) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'moderate': return '🟡';
      case 'low': return '🟢';
      case 'very low': return '✅';
      default: return '⚪';
    }
  };

  const getRiskIcon = (level) => {
    switch(level?.toLowerCase()) {
      case 'critical': return 'alert-circle';
      case 'high': return 'alert-circle';
      case 'moderate': return 'warning';
      case 'low': return 'checkmark-circle';
      case 'very low': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };

  // Render expanded treatment details
  const renderTreatmentDetails = () => {
    if (!selectedDisease || expandedDisease !== selectedDisease.disease) return null;

    const displayData = (translatedTreatment && targetLanguage !== "english") ? translatedTreatment : selectedDisease;

    return (
      <View style={styles.detailContainer}>
        {/* Description */}
        {selectedDisease.description && (
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={18} color="#6C63FF" />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{displayData.description || selectedDisease.description}</Text>
            </View>
          </View>
        )}

        {/* Cause */}
        {selectedDisease.cause && (
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle-outline" size={18} color="#6C63FF" />
              <Text style={styles.sectionTitle}>Cause</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{displayData.cause || selectedDisease.cause}</Text>
            </View>
          </View>
        )}

        {/* Risk Level */}
        {selectedDisease.risk_level && (
          <View style={[styles.riskCard, { backgroundColor: getRiskBgColor(selectedDisease.risk_level) }]}>
            <View style={styles.riskRow}>
              <View style={styles.riskIconContainer}>
                <Ionicons 
                  name={getRiskIcon(selectedDisease.risk_level)} 
                  size={24} 
                  color={getRiskColor(selectedDisease.risk_level)} 
                />
              </View>
              <View style={styles.riskInfo}>
                <Text style={styles.riskLabel}>Risk Level</Text>
                <Text style={[styles.riskValue, { color: getRiskColor(selectedDisease.risk_level) }]}>
                  {displayData.risk_level || selectedDisease.risk_level}
                </Text>
              </View>
              {selectedDisease.average_risk_score !== undefined && (
                <View style={styles.riskScore}>
                  <Text style={styles.riskScoreLabel}>Score</Text>
                  <Text style={styles.riskScoreValue}>{selectedDisease.average_risk_score}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Critical Period */}
        {selectedDisease.critical_period && (
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={18} color="#6C63FF" />
              <Text style={styles.sectionTitle}>Critical Period</Text>
            </View>
            <View style={styles.periodCard}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.periodText}>{displayData.critical_period || selectedDisease.critical_period}</Text>
            </View>
          </View>
        )}

        {/* Weather-Based Treatment */}
        {selectedDisease.weather_based_treatment && Object.keys(selectedDisease.weather_based_treatment).length > 0 && (
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cloud-outline" size={18} color="#6C63FF" />
              <Text style={styles.sectionTitle}>Weather-Based Treatment</Text>
            </View>
            <View style={styles.weatherCard}>
              {Object.entries(selectedDisease.weather_based_treatment).map(([key, value]) => {
                const displayValue = displayData.weather_based_treatment?.[key] || value;
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                return (
                  <View key={key} style={styles.weatherItem}>
                    <Text style={styles.weatherItemLabel}>{label}</Text>
                    {Array.isArray(displayValue) ? (
                      <View style={styles.weatherItemList}>
                        {displayValue.map((item, index) => (
                          <View key={index} style={styles.weatherListItem}>
                            <View style={styles.weatherBullet} />
                            <Text style={styles.weatherItemText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.weatherItemText}>{String(displayValue)}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Preventive Measures */}
        {selectedDisease.preventive_measures && selectedDisease.preventive_measures.length > 0 && (
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#6C63FF" />
              <Text style={styles.sectionTitle}>Preventive Measures</Text>
            </View>
            <View style={styles.measuresCard}>
              {selectedDisease.preventive_measures.map((measure, index) => {
                const displayMeasure = displayData.preventive_measures?.[index] || measure;
                return (
                  <View key={index} style={styles.measureItem}>
                    <View style={styles.measureBullet} />
                    <Text style={styles.measureText}>{displayMeasure}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Resistant Varieties */}
        {selectedDisease.resistant_varieties && selectedDisease.resistant_varieties.length > 0 && (
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="leaf-outline" size={18} color="#6C63FF" />
              <Text style={styles.sectionTitle}>Resistant Varieties</Text>
            </View>
            <View style={styles.varietiesCard}>
              {selectedDisease.resistant_varieties.map((variety, index) => {
                const displayVariety = displayData.resistant_varieties?.[index] || variety;
                return (
                  <View key={index} style={styles.varietyItem}>
                    <View style={styles.varietyBullet} />
                    <Text style={styles.varietyText}>{displayVariety}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {translating && (
          <View style={styles.translatingContainer}>
            <ActivityIndicator size="small" color="#6C63FF" />
            <Text style={styles.translatingText}>Translating...</Text>
          </View>
        )}
      </View>
    );
  };

  const renderDiseaseCard = ({ item }) => {
    const isExpanded = expandedDisease === item.name;
    const isLoading = selectedDisease && expandedDisease === item.name && translating;

    return (
      <TouchableOpacity 
        style={[styles.card, isExpanded && styles.cardExpanded]} 
        onPress={() => fetchDiseaseTreatment(item.name)}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={[styles.cardBadge, isExpanded && styles.cardBadgeExpanded]}>
              <Text style={styles.cardBadgeText}>
                {isExpanded ? '▲ Close' : '▼ Details'}
              </Text>
            </View>
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-up-circle" : "chevron-down-circle"} 
            size={28} 
            color={isExpanded ? "#6C63FF" : "#4CAF50"} 
          />
        </View>

        {!isExpanded && (
          <View style={styles.cardBody}>
            <View style={styles.cardInfoRow}>
              <Ionicons name="document-text-outline" size={14} color="#888" />
              <Text style={styles.cardInfoLabel}>Description</Text>
            </View>
            <Text style={styles.cardInfoText} numberOfLines={2}>{item.description}</Text>

            <View style={styles.cardInfoRow}>
              <Ionicons name="alert-circle-outline" size={14} color="#888" />
              <Text style={styles.cardInfoLabel}>Cause</Text>
            </View>
            <Text style={styles.cardInfoText} numberOfLines={1}>{item.cause}</Text>

            <View style={styles.treatmentOptions}>
              <Text style={styles.treatmentOptionsLabel}>Treatment Options</Text>
              <View style={styles.treatmentOptionsTags}>
                <View style={[styles.tag, styles.organicTag]}>
                  <FontAwesome5 name="leaf" size={12} color="#2e7d32" />
                  <Text style={[styles.tagText, styles.organicTagText]}>Organic</Text>
                </View>
                <View style={[styles.tag, styles.chemicalTag]}>
                  <FontAwesome5 name="flask" size={12} color="#c62828" />
                  <Text style={[styles.tagText, styles.chemicalTagText]}>Chemical</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {isExpanded && isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6C63FF" />
            <Text style={styles.loadingText}>Loading details...</Text>
          </View>
        )}

        {isExpanded && !isLoading && renderTreatmentDetails()}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading treatments...</Text>
      </View>
    );
  }

  if (treatments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="medical-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Treatments Available</Text>
        <Text style={styles.emptyText}>Unable to load treatment data from the server.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTreatments}>
          <LinearGradient
            colors={['#6C63FF', '#5A52D5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.retryGradient}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Selector */}
      <View style={styles.languageContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.languageLabelContainer}>
            <Ionicons name="language-outline" size={16} color="#6C63FF" />
            <Text style={styles.languageLabel}>Language</Text>
          </View>
          {["english", "hindi", "bengali", "tamil", "telugu", "marathi", "gujarati", "punjabi"].map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.languageButton, targetLanguage === lang && styles.languageSelected]}
              onPress={() => setTargetLanguage(lang)}
            >
              <Text style={[styles.languageButtonText, targetLanguage === lang && styles.languageSelectedText]}>
                {lang.slice(0, 3).toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>🌿 Treatment Guide</Text>
          <Text style={styles.subtitle}>Tap a card to view detailed treatment</Text>
        </View>

        <View style={styles.cardsContainer}>
          {treatments.map((item) => (
            <View key={item.id}>
              {renderDiseaseCard({ item })}
            </View>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EEF0FF' }]}>
              <Ionicons name="medical-outline" size={20} color="#6C63FF" />
            </View>
            <Text style={styles.statNumber}>{treatments.length}</Text>
            <Text style={styles.statLabel}>Diseases</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.statNumber}>🌱</Text>
            <Text style={styles.statLabel}>Organic</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="flask-outline" size={20} color="#f44336" />
            </View>
            <Text style={styles.statNumber}>🧪</Text>
            <Text style={styles.statLabel}>Chemical</Text>
          </View>
        </View>

        {/* Chatbot Section */}
        <View style={styles.chatbotContainer}>
          <View style={styles.chatbotHeader}>
            <Text style={styles.chatbotTitle}>🤖 AI Plant Doctor</Text>
            <View style={styles.chatbotBadge}>
              <Text style={styles.chatbotBadgeText}>24/7</Text>
            </View>
          </View>
          <Text style={styles.chatbotText}>
            Ask me anything about plant diseases, treatments, or prevention tips.
          </Text>
          <TouchableOpacity style={styles.chatButton}>
            <LinearGradient
              colors={['#6C63FF', '#5A52D5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.chatGradient}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
              <Text style={styles.chatButtonText}>Start Chat</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    flex: 1,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '600',
  },
  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Language
  languageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#F0F0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  languageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
    marginLeft: 4,
  },
  languageButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F0F0F5',
    marginRight: 6,
  },
  languageSelected: {
    backgroundColor: '#6C63FF',
  },
  languageButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  languageSelectedText: {
    color: '#fff',
  },
  // Header
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '400',
  },
  // Cards
  cardsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardExpanded: {
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  cardBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  cardBadgeExpanded: {
    backgroundColor: '#EEF0FF',
  },
  cardBadgeText: {
    fontSize: 10,
    color: '#2e7d32',
    fontWeight: '600',
  },
  cardBody: {
    gap: 4,
    marginTop: 8,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  cardInfoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  cardInfoText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
    paddingLeft: 20,
  },
  treatmentOptions: {
    marginTop: 8,
  },
  treatmentOptionsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  treatmentOptionsTags: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  organicTag: {
    backgroundColor: '#E8F5E9',
  },
  chemicalTag: {
    backgroundColor: '#FFEBEE',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  organicTagText: {
    color: '#2e7d32',
  },
  chemicalTagText: {
    color: '#c62828',
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  // Chatbot
  chatbotContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  chatbotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatbotTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  chatbotBadge: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  chatbotBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatbotText: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    marginBottom: 12,
  },
  chatButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  chatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Detail styles
  detailContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailSection: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  infoCard: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  riskCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  riskInfo: {
    flex: 1,
  },
  riskLabel: {
    fontSize: 11,
    color: '#666',
  },
  riskValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  riskScore: {
    alignItems: 'center',
  },
  riskScoreLabel: {
    fontSize: 9,
    color: '#666',
  },
  riskScoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  periodCard: {
    backgroundColor: '#F5F7FA',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  weatherCard: {
    backgroundColor: '#F5F7FA',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  weatherItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    paddingBottom: 6,
  },
  weatherItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
    marginBottom: 3,
  },
  weatherItemList: {
    gap: 3,
  },
  weatherListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#6C63FF',
  },
  weatherItemText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  measuresCard: {
    backgroundColor: '#F5F7FA',
    padding: 10,
    borderRadius: 8,
    gap: 3,
  },
  measureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  measureBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#4CAF50',
  },
  measureText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  varietiesCard: {
    backgroundColor: '#F5F7FA',
    padding: 10,
    borderRadius: 8,
    gap: 3,
  },
  varietyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  varietyBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#6C63FF',
  },
  varietyText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  translatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  translatingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '500',
  },
});