import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  RefreshControl,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import baseURL from "./config";

const { width } = Dimensions.get("window");

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [translatedWeather, setTranslatedWeather] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("hindi");
  const [locationSource, setLocationSource] = useState(null);
  const [compatibleData, setCompatibleData] = useState(null);
  const [selectedLeaf, setSelectedLeaf] = useState("healthy");
  const [viewMode, setViewMode] = useState("weather");
  const [riskModalVisible, setRiskModalVisible] = useState(false);
  const [riskLevel, setRiskLevel] = useState("");

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
      if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
        translated[key] = {};
        for (let subKey in data[key]) {
          const value = data[key][subKey];
          if (typeof value === 'string' || typeof value === 'number') {
            translated[key][subKey] = await translateText(value.toString(), targetLang);
          } else {
            translated[key][subKey] = value;
          }
        }
      } else if (typeof data[key] === 'string' || typeof data[key] === 'number') {
        translated[key] = await translateText(data[key].toString(), targetLang);
      } else {
        translated[key] = data[key];
      }
    }
    return translated;
  };

  // ✅ Get device location
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
      return location.coords;
    } catch (error) {
      console.error("Error getting GPS location:", error);
      return null;
    }
  };

  // ✅ Fetch Current Weather
  const fetchCurrentWeather = async () => {
    try {
      const response = await fetch(`${baseURL}/weather/current`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWeather(data);
      setLocationSource("gps/ip");
      const translated = await translateWeatherData(data, targetLanguage);
      setTranslatedWeather(translated);
    } catch (error) {
      console.error("❌ Error fetching weather:", error);
      Alert.alert("Error", "Unable to fetch weather data. Please try again later.");
    }
  };

  // ✅ Fetch Compatible Weather
  const fetchCompatibleWeather = async (leafType) => {
    try {
      const response = await fetch(`${baseURL}/weather/compatible?leaf=${leafType}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCompatibleData(data);
      if (data.risk_level) {
        setRiskLevel(data.risk_level);
        setRiskModalVisible(true);
      }
      const translated = await translateWeatherData(data, targetLanguage);
      setTranslatedWeather(translated);
    } catch (error) {
      console.error("❌ Error fetching compatible weather:", error);
      Alert.alert("Error", "Unable to fetch disease analysis data. Please try again later.");
    }
  };

  // ✅ Fetch Threat Prediction
  const fetchThreatPrediction = async () => {
    try {
      const response = await fetch(`${baseURL}/weather/threat`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.Risk_Level) {
        setRiskLevel(data.Risk_Level);
        setRiskModalVisible(true);
      }
      return data;
    } catch (error) {
      console.error("❌ Error fetching threat prediction:", error);
      Alert.alert("Error", "Unable to fetch threat prediction. Please try again later.");
      return null;
    }
  };

  // ✅ Main data fetch
  const fetchData = async () => {
    setLoading(true);
    try {
      if (viewMode === "weather") {
        await fetchCurrentWeather();
      } else if (viewMode === "compatible") {
        await fetchCompatibleWeather(selectedLeaf);
      } else if (viewMode === "threat") {
        await fetchThreatPrediction();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ Refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [viewMode, selectedLeaf]);

  useEffect(() => {
    const reTranslate = async () => {
      if (viewMode === "weather" && weather) {
        const translated = await translateWeatherData(weather, targetLanguage);
        setTranslatedWeather(translated);
      } else if ((viewMode === "compatible" || viewMode === "threat") && compatibleData) {
        const translated = await translateWeatherData(compatibleData, targetLanguage);
        setTranslatedWeather(translated);
      }
    };
    if (weather || compatibleData) {
      reTranslate();
    }
  }, [targetLanguage]);

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Critical': return '#d32f2f';
      case 'High': return '#f44336';
      case 'Moderate': return '#FF9800';
      case 'Low': return '#4CAF50';
      case 'Very Low': return '#2E7D32';
      default: return '#666';
    }
  };

  const getRiskEmoji = (risk) => {
    switch(risk) {
      case 'Critical': return '🔴';
      case 'High': return '🟠';
      case 'Moderate': return '🟡';
      case 'Low': return '🟢';
      case 'Very Low': return '✅';
      default: return '⚪';
    }
  };

  const getRiskDescription = (risk) => {
    switch(risk) {
      case 'Critical': return '🚨 Immediate action required! Disease outbreak highly likely.';
      case 'High': return '⚠️ High risk conditions. Monitor closely and consider preventive measures.';
      case 'Moderate': return '⚡ Moderate risk. Regular monitoring recommended.';
      case 'Low': return '✅ Low risk. Standard care is sufficient.';
      case 'Very Low': return '🌟 Optimal conditions. Minimal disease threat.';
      default: return 'Risk level not available.';
    }
  };

  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain') || cond.includes('shower')) return 'rainy';
    if (cond.includes('cloud')) return 'cloudy';
    if (cond.includes('sun') || cond.includes('clear')) return 'sunny';
    if (cond.includes('snow')) return 'snow';
    if (cond.includes('fog') || cond.includes('mist')) return 'cloudy-night';
    return 'partly-sunny';
  };

  const renderNestedData = (obj, indent = 0) => {
    if (!obj || typeof obj !== 'object') return null;
    const entries = Object.entries(obj);
    return entries.map(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
          <View key={key} style={[styles.nestedContainer, { marginLeft: indent * 10 }]}>
            <Text style={styles.nestedLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
            {renderNestedData(value, indent + 1)}
          </View>
        );
      }
      return (
        <View key={key} style={[styles.fieldCard, { marginLeft: indent * 10 }]}>
          <Text style={styles.fieldLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          <Text style={styles.fieldValue}>{String(value)}</Text>
        </View>
      );
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (!weather && !compatibleData) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cloud-offline-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Weather Data</Text>
        <Text style={styles.emptyText}>Unable to fetch weather information.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
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

  const currentData = viewMode === "weather" ? weather : compatibleData;

  return (
    <View style={styles.container}>
      {/* Risk Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={riskModalVisible}
        onRequestClose={() => setRiskModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderColor: getRiskColor(riskLevel), borderWidth: 3 }]}>
            <Text style={styles.modalEmoji}>{getRiskEmoji(riskLevel)}</Text>
            <Text style={[styles.modalTitle, { color: getRiskColor(riskLevel) }]}>
              {riskLevel} Risk Level
            </Text>
            <View style={styles.modalDivider} />
            <Text style={styles.modalDescription}>
              {getRiskDescription(riskLevel)}
            </Text>
            <View style={styles.riskIndicators}>
              {['Critical', 'High', 'Moderate', 'Low', 'Very Low'].map((level) => (
                <View key={level} style={[
                  styles.riskIndicator,
                  getRiskIndicatorStyle(level),
                  riskLevel === level && styles.riskActive
                ]}>
                  <Text style={styles.riskIndicatorText}>{level}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: getRiskColor(riskLevel) }]}
              onPress={() => setRiskModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <LinearGradient
        colors={['#6C63FF', '#5A52D5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>🌤️ Weather Assistant</Text>
        <Text style={styles.headerSubtitle}>Real-time weather for potato farming</Text>
      </LinearGradient>

      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        {['weather', 'compatible', 'threat'].map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.modeButton, viewMode === mode && styles.modeButtonActive]}
            onPress={() => setViewMode(mode)}
          >
            <Text style={[styles.modeButtonText, viewMode === mode && styles.modeButtonTextActive]}>
              {mode === 'weather' ? 'Weather' : mode === 'compatible' ? 'Analysis' : 'Threat'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Leaf Selector */}
        {viewMode === "compatible" && (
          <View style={styles.leafSelector}>
            <Text style={styles.leafLabel}>🌿 Leaf Condition</Text>
            <View style={styles.leafButtons}>
              {["healthy", "early blight", "late blight"].map((leaf) => (
                <TouchableOpacity
                  key={leaf}
                  style={[styles.leafButton, selectedLeaf === leaf && styles.leafButtonActive]}
                  onPress={() => setSelectedLeaf(leaf)}
                >
                  <Text style={[styles.leafButtonText, selectedLeaf === leaf && styles.leafButtonTextActive]}>
                    {leaf === "healthy" ? "Healthy" : leaf === "early blight" ? "Early" : "Late"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

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

        {/* Weather Card */}
        <View style={styles.weatherCard}>
          <Text style={styles.cardTitle}>
            {viewMode === "weather" ? "🌡️ Current Weather" :
             viewMode === "threat" ? "🚨 Threat Prediction" :
             "🌡️ Disease Analysis"}
          </Text>

          {currentData && Object.entries(currentData).map(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              return (
                <View key={key} style={styles.nestedContainer}>
                  <Text style={styles.nestedTitle}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                  {renderNestedData(value)}
                </View>
              );
            }

            let displayKey = key.replace(/([A-Z])/g, ' $1').trim();
            displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1);

            const specialLabels = {
              "Potato Suitability": "🥔 Suitability",
              "Risk Level": "⚠️ Risk",
              "average_risk_score": "📊 Avg Risk",
              "maximum_risk_score": "📈 Max Risk",
              "risk_level": "⚠️ Risk",
              "critical_period": "⏰ Critical",
              "mode_risk_score": "📊 Mode",
              "median_risk_score": "📊 Median",
              "forecast_records_analyzed": "📋 Records",
              "Disease_Threat": "🦠 Threat",
            };
            displayKey = specialLabels[key] || displayKey;

            let valueStyle = {};
            let isRiskField = false;

            if (key === "risk_level" || key === "Risk Level") {
              isRiskField = true;
              if (value === "Low" || value === "Very Low") valueStyle = styles.lowRisk;
              else if (value === "High" || value === "Critical") valueStyle = styles.highRisk;
              else valueStyle = styles.mediumRisk;
            } else if (key === "average_risk_score" || key === "maximum_risk_score") {
              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
                if (numValue >= 70) valueStyle = styles.highRisk;
                else if (numValue >= 50) valueStyle = styles.mediumRisk;
                else valueStyle = styles.lowRisk;
              }
            } else if (key === "Potato Suitability") {
              if (value === "Suitable") valueStyle = styles.suitable;
              else if (value === "Unsuitable") valueStyle = styles.unsuitable;
            }

            return (
              <TouchableOpacity
                key={key}
                style={[styles.fieldCard, isRiskField && styles.riskFieldCard]}
                onPress={() => {
                  if (isRiskField && value) {
                    setRiskLevel(value);
                    setRiskModalVisible(true);
                  }
                }}
              >
                <Text style={styles.fieldLabel}>{displayKey}</Text>
                <Text style={[styles.fieldValue, valueStyle]}>{String(value)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Translated Card */}
        {translatedWeather && Object.keys(translatedWeather).length > 0 && (
          <View style={[styles.weatherCard, styles.translatedCard]}>
            <Text style={[styles.cardTitle, { color: '#0d47a1' }]}>
              🌐 Translated ({targetLanguage.toUpperCase()})
            </Text>
            {Object.entries(translatedWeather).map(([key, value]) => {
              if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return (
                  <View key={key} style={styles.nestedContainer}>
                    <Text style={styles.nestedTitle}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    {renderNestedData(value)}
                  </View>
                );
              }
              let displayKey = key.replace(/([A-Z])/g, ' $1').trim();
              displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1);
              return (
                <View key={key} style={styles.fieldCard}>
                  <Text style={styles.fieldLabel}>{displayKey}</Text>
                  <Text style={styles.fieldValue}>{String(value)}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#6C63FF" />
            <Text style={styles.infoText}>
              {currentData?.City || "Auto-detected"}
            </Text>
          </View>
          {currentData?.Timestamp && (
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#6C63FF" />
              <Text style={styles.infoText}>{currentData.Timestamp}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Ionicons name="navigate-outline" size={16} color="#6C63FF" />
            <Text style={styles.infoText}>Source: {locationSource || "Auto-detected"}</Text>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const getRiskIndicatorStyle = (level) => {
  switch(level) {
    case 'Critical': return styles.riskCritical;
    case 'High': return styles.riskHigh;
    case 'Moderate': return styles.riskModerate;
    case 'Low': return styles.riskLow;
    case 'Very Low': return styles.riskVeryLow;
    default: return {};
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  // Header
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
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
  // Mode Selector
  modeSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -15,
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: '#fff',
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#6C63FF',
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  // Scroll
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // Leaf Selector
  leafSelector: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  leafLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  leafButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  leafButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F5',
  },
  leafButtonActive: {
    backgroundColor: '#6C63FF',
  },
  leafButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  leafButtonTextActive: {
    color: '#fff',
  },
  // Language
  languageContainer: {
    marginBottom: 12,
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
  // Weather Card
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  translatedCard: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
    textAlign: 'center',
  },
  fieldCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  riskFieldCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB300',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
    flex: 1,
  },
  fieldValue: {
    fontSize: 13,
    color: '#1A1A2E',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  nestedContainer: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
  },
  nestedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  nestedLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginTop: 2,
  },
  suitable: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  unsuitable: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  lowRisk: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  highRisk: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  mediumRisk: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  // Info Card
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
  bottomSpacer: {
    height: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalDivider: {
    width: '100%',
    height: 2,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  riskIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 12,
    width: '100%',
  },
  riskIndicator: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    margin: 3,
    opacity: 0.5,
  },
  riskActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  riskIndicatorText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  riskCritical: {
    backgroundColor: '#d32f2f',
  },
  riskHigh: {
    backgroundColor: '#f44336',
  },
  riskModerate: {
    backgroundColor: '#FF9800',
  },
  riskLow: {
    backgroundColor: '#4CAF50',
  },
  riskVeryLow: {
    backgroundColor: '#2E7D32',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});