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
  TextInput,
  RefreshControl,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import baseURL from "./config";

const { width } = Dimensions.get("window");

export default function Logbook() {
  const [userId, setUserId] = useState(null);
  const [history, setHistory] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userIdModalVisible, setUserIdModalVisible] = useState(false);
  const [tempUserId, setTempUserId] = useState("");
  const [filterDisease, setFilterDisease] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [newPrediction, setNewPrediction] = useState({
    predicted_class: "",
    confidence: "",
    severity: "",
    ratio: "",
  });

  // Load user ID from SecureStore
  useEffect(() => {
    loadUserId();
  }, []);

  const loadUserId = async () => {
    try {
      const storedUserId = await SecureStore.getItemAsync("userId");
      if (storedUserId) {
        setUserId(storedUserId);
        fetchData(storedUserId);
      } else {
        setUserIdModalVisible(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading user ID:", error);
      setUserIdModalVisible(true);
      setLoading(false);
    }
  };

  const saveUserId = async () => {
    if (!tempUserId.trim()) {
      Alert.alert("Error", "Please enter a User ID");
      return;
    }
    try {
      await SecureStore.setItemAsync("userId", tempUserId);
      setUserId(tempUserId);
      setUserIdModalVisible(false);
      fetchData(tempUserId);
    } catch (error) {
      console.error("Error saving user ID:", error);
      Alert.alert("Error", "Failed to save User ID");
    }
  };

  const fetchData = async (uid) => {
    try {
      setLoading(true);
      const historyResponse = await fetch(`${baseURL}/log/history/${uid}`);
      const historyData = await historyResponse.json();
      setHistory(historyData);
      const dashboardResponse = await fetch(`${baseURL}/log/dashboard/${uid}`);
      const dashboardData = await dashboardResponse.json();
      setDashboardData(dashboardData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch prediction history");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(userId);
    setRefreshing(false);
  };

  const savePredictionFromDiagnose = async (predictionData) => {
    try {
      const response = await fetch(`${baseURL}/log/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          predicted_class: predictionData.class || predictionData.predicted_class,
          confidence: parseFloat(predictionData.confidence || 0),
          severity: predictionData.severity || "Medium",
          ratio: parseFloat(predictionData.infected_ratio || 0),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Prediction saved successfully from diagnose page");
        fetchData(userId);
        return true;
      } else {
        console.error("Failed to save prediction:", data.detail);
        return false;
      }
    } catch (error) {
      console.error("Error saving prediction:", error);
      return false;
    }
  };

  const handleSavePrediction = async () => {
    if (!newPrediction.predicted_class || !newPrediction.confidence || 
        !newPrediction.severity || !newPrediction.ratio) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      const response = await fetch(`${baseURL}/log/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          predicted_class: newPrediction.predicted_class,
          confidence: parseFloat(newPrediction.confidence),
          severity: newPrediction.severity,
          ratio: parseFloat(newPrediction.ratio),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Prediction saved successfully");
        setSaveModalVisible(false);
        setNewPrediction({
          predicted_class: "",
          confidence: "",
          severity: "",
          ratio: "",
        });
        fetchData(userId);
      } else {
        Alert.alert("Error", data.detail || "Failed to save prediction");
      }
    } catch (error) {
      console.error("Error saving prediction:", error);
      Alert.alert("Error", "Failed to save prediction");
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "low": return styles.severityLow;
      case "medium": return styles.severityMedium;
      case "high": return styles.severityHigh;
      default: return styles.severityLow;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return styles.confidenceHigh;
    if (confidence >= 60) return styles.confidenceMedium;
    return styles.confidenceLow;
  };

  const getSeverityEmoji = (severity) => {
    switch (severity?.toLowerCase()) {
      case "low": return "🟢";
      case "medium": return "🟡";
      case "high": return "🔴";
      default: return "⚪";
    }
  };

  const getFilteredHistory = () => {
    let filtered = history;
    if (filterDisease !== "All") {
      filtered = filtered.filter(item => 
        item.class?.toLowerCase().includes(filterDisease.toLowerCase())
      );
    }
    if (sortOrder === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.prediction_date) - new Date(a.prediction_date));
    } else {
      filtered = filtered.sort((a, b) => new Date(a.prediction_date) - new Date(b.prediction_date));
    }
    return filtered;
  };

  const getUniqueDiseases = () => {
    const diseases = history.map(item => item.class).filter(Boolean);
    return ["All", ...new Set(diseases)];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading your prediction history...</Text>
      </View>
    );
  }

  const filteredHistory = getFilteredHistory();
  const uniqueDiseases = getUniqueDiseases();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6C63FF', '#5A52D5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>📒 Logbook</Text>
            <Text style={styles.headerSubtitle}>Your prediction history</Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.userBadge}>
              <Ionicons name="person-outline" size={14} color="#fff" />
              <Text style={styles.userIdText}>{userId}</Text>
            </View>
            <TouchableOpacity 
              style={styles.changeUserButton}
              onPress={() => setUserIdModalVisible(true)}
            >
              <Ionicons name="refresh-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {dashboardData && (
          <View style={styles.dashboardContainer}>
            <Text style={styles.sectionTitle}>📊 Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#EEF0FF' }]}>
                  <Ionicons name="analytics-outline" size={24} color="#6C63FF" />
                </View>
                <Text style={styles.statNumber}>{dashboardData.total_predictions}</Text>
                <Text style={styles.statLabel}>Total Predictions</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="calendar-outline" size={24} color="#FF9800" />
                </View>
                <Text style={styles.statNumber}>
                  {history.length > 0 ? new Date(history[0]?.prediction_date).toLocaleDateString() : "N/A"}
                </Text>
                <Text style={styles.statLabel}>Latest</Text>
              </View>
            </View>

            {dashboardData.disease_stats && dashboardData.disease_stats.length > 0 && (
              <View style={styles.chartCard}>
                <Text style={styles.subsectionTitle}>Disease Distribution</Text>
                {dashboardData.disease_stats.map((disease, index) => (
                  <View key={index} style={styles.diseaseBar}>
                    <Text style={styles.diseaseName}>{disease._id}</Text>
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            width: `${(disease.count / dashboardData.total_predictions) * 100}%`,
                            backgroundColor: getDiseaseColor(disease._id)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.diseaseCount}>{disease.count}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>📜 History</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setSaveModalVisible(true)}
            >
              <LinearGradient
                colors={['#6C63FF', '#5A52D5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addGradient}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addButtonText}>Add</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {history.length > 0 && (
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {uniqueDiseases.map((disease) => (
                  <TouchableOpacity
                    key={disease}
                    style={[
                      styles.filterButton,
                      filterDisease === disease && styles.filterButtonActive,
                    ]}
                    onPress={() => setFilterDisease(disease)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterDisease === disease && styles.filterButtonTextActive,
                    ]}>
                      {disease === "All" ? "All" : disease}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              >
                <Ionicons name="swap-vertical" size={18} color="#666" />
                <Text style={styles.sortButtonText}>
                  {sortOrder === "newest" ? "Newest" : "Oldest"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {filteredHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={64} color="#ddd" />
              <Text style={styles.emptyStateText}>No predictions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Save your first prediction to see it here
              </Text>
            </View>
          ) : (
            filteredHistory.map((prediction, index) => (
              <TouchableOpacity
                key={prediction._id || index}
                style={styles.predictionCard}
                onPress={() => {
                  setSelectedPrediction(prediction);
                  setModalVisible(true);
                }}
                activeOpacity={0.9}
              >
                <View style={styles.predictionHeader}>
                  <View style={styles.predictionDateContainer}>
                    <Ionicons name="calendar-outline" size={14} color="#888" />
                    <Text style={styles.predictionDate}>{prediction.prediction_date}</Text>
                  </View>
                  <View style={styles.predictionTimeContainer}>
                    <Ionicons name="time-outline" size={14} color="#888" />
                    <Text style={styles.predictionTime}>{prediction.prediction_time}</Text>
                  </View>
                </View>

                <View style={styles.predictionBody}>
                  <View style={styles.diseaseInfo}>
                    <View style={styles.diseaseTag}>
                      <Text style={styles.diseaseTagText}>{prediction.class}</Text>
                    </View>
                    <View style={[
                      styles.severityTag,
                      getSeverityColor(prediction.severity)
                    ]}>
                      <Text style={styles.severityTagText}>
                        {getSeverityEmoji(prediction.severity)} {prediction.severity}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.predictionStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statItemLabel}>Confidence</Text>
                      <Text 
                        style={[
                          styles.statItemValue,
                          getConfidenceColor(prediction.confidence)
                        ]}
                      >
                        {prediction.confidence}%
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statItemLabel}>Infected Ratio</Text>
                      <Text style={styles.statItemValue}>{prediction.infected_ratio}%</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Total: {history.length} predictions</Text>
        </View>
      </ScrollView>

      {/* Prediction Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Prediction Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#888" />
              </TouchableOpacity>
            </View>

            {selectedPrediction && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailCard}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>🦠 Disease</Text>
                    <Text style={[styles.detailValue, { fontWeight: 'bold' }]}>
                      {selectedPrediction.class}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>📊 Confidence</Text>
                    <Text style={[
                      styles.detailValue,
                      getConfidenceColor(selectedPrediction.confidence)
                    ]}>
                      {selectedPrediction.confidence}%
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>⚠️ Severity</Text>
                    <Text style={[
                      styles.detailValue,
                      getSeverityColor(selectedPrediction.severity)
                    ]}>
                      {getSeverityEmoji(selectedPrediction.severity)} {selectedPrediction.severity}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>📈 Infected Ratio</Text>
                    <Text style={styles.detailValue}>{selectedPrediction.infected_ratio}%</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>📅 Date</Text>
                    <Text style={styles.detailValue}>{selectedPrediction.prediction_date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>⏰ Time</Text>
                    <Text style={styles.detailValue}>{selectedPrediction.prediction_time}</Text>
                  </View>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Save Prediction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={saveModalVisible}
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Save Prediction</Text>
              <TouchableOpacity onPress={() => setSaveModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#888" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Predicted Class *</Text>
                <View style={styles.diseaseButtons}>
                  {["Early Blight", "Late Blight", "Healthy"].map((disease) => (
                    <TouchableOpacity
                      key={disease}
                      style={[
                        styles.diseaseButton,
                        newPrediction.predicted_class === disease && styles.diseaseButtonActive,
                      ]}
                      onPress={() => setNewPrediction({...newPrediction, predicted_class: disease})}
                    >
                      <Text style={[
                        styles.diseaseButtonText,
                        newPrediction.predicted_class === disease && styles.diseaseButtonTextActive,
                      ]}>
                        {disease === "Early Blight" ? "Early" : disease === "Late Blight" ? "Late" : "Healthy"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Or type custom disease name"
                  placeholderTextColor="#999"
                  value={newPrediction.predicted_class}
                  onChangeText={(text) => setNewPrediction({...newPrediction, predicted_class: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confidence (%) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0-100"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={newPrediction.confidence}
                  onChangeText={(text) => setNewPrediction({...newPrediction, confidence: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Severity *</Text>
                <View style={styles.severityButtons}>
                  {["Low", "Medium", "High"].map((severity) => (
                    <TouchableOpacity
                      key={severity}
                      style={[
                        styles.severityButton,
                        newPrediction.severity === severity && styles.severityButtonActive,
                        severity === "Low" && styles.severityButtonLow,
                        severity === "Medium" && styles.severityButtonMedium,
                        severity === "High" && styles.severityButtonHigh,
                      ]}
                      onPress={() => setNewPrediction({...newPrediction, severity})}
                    >
                      <Text style={[
                        styles.severityButtonText,
                        newPrediction.severity === severity && styles.severityButtonTextActive
                      ]}>
                        {severity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Infected Ratio (%) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0-100"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={newPrediction.ratio}
                  onChangeText={(text) => setNewPrediction({...newPrediction, ratio: text})}
                />
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSavePrediction}
            >
              <LinearGradient
                colors={['#6C63FF', '#5A52D5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveGradient}
              >
                <Ionicons name="save-outline" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Prediction</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* User ID Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={userIdModalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.userIdModalContent}>
            <LinearGradient
              colors={['#6C63FF', '#5A52D5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.userIdGradient}
            >
              <Ionicons name="person-circle-outline" size={64} color="#fff" />
            </LinearGradient>
            <Text style={styles.modalTitle}>Welcome!</Text>
            <Text style={styles.modalSubtitle}>
              Enter your User ID to view your prediction history
            </Text>
            
            <TextInput
              style={styles.userIdInput}
              placeholder="Enter User ID"
              placeholderTextColor="#999"
              value={tempUserId}
              onChangeText={setTempUserId}
              autoCapitalize="none"
            />
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={saveUserId}
            >
              <LinearGradient
                colors={['#6C63FF', '#5A52D5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getDiseaseColor = (disease) => {
  const colors = {
    "Early Blight": "#FF9800",
    "Late Blight": "#f44336",
    "Healthy": "#4CAF50",
  };
  return colors[disease] || "#9C27B0";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
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
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  userIdText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  changeUserButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  // Dashboard
  dashboardContainer: {
    padding: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  diseaseBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  diseaseName: {
    width: 90,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  barContainer: {
    flex: 1,
    height: 18,
    backgroundColor: '#f0f0f0',
    borderRadius: 9,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  bar: {
    height: '100%',
    borderRadius: 9,
  },
  diseaseCount: {
    width: 30,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  // History
  historyContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 6,
  },
  filterButtonActive: {
    backgroundColor: '#6C63FF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sortButtonText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999',
    marginTop: 12,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
  },
  predictionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  predictionDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  predictionDate: {
    fontSize: 12,
    color: '#888',
  },
  predictionTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  predictionTime: {
    fontSize: 12,
    color: '#888',
  },
  predictionBody: {
    gap: 10,
  },
  diseaseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diseaseTag: {
    backgroundColor: '#EEF0FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  diseaseTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
  },
  severityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  predictionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statItemLabel: {
    fontSize: 11,
    color: '#999',
  },
  statItemValue: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e8e8e8',
  },
  confidenceHigh: {
    color: '#4CAF50',
  },
  confidenceMedium: {
    color: '#FF9800',
  },
  confidenceLow: {
    color: '#f44336',
  },
  severityLow: {
    backgroundColor: '#E8F5E9',
  },
  severityMedium: {
    backgroundColor: '#FFF3E0',
  },
  severityHigh: {
    backgroundColor: '#FFEBEE',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#999',
  },
  // Modals
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
    width: '92%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  detailCard: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  // Inputs
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  diseaseButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  diseaseButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  diseaseButtonActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  diseaseButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  diseaseButtonTextActive: {
    color: '#fff',
  },
  severityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  severityButtonActive: {
    borderWidth: 2,
  },
  severityButtonLow: {
    backgroundColor: '#E8F5E9',
  },
  severityButtonMedium: {
    backgroundColor: '#FFF3E0',
  },
  severityButtonHigh: {
    backgroundColor: '#FFEBEE',
  },
  severityButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  severityButtonTextActive: {
    color: '#333',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // User ID Modal
  userIdModalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '90%',
    alignItems: 'center',
  },
  userIdGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  userIdInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  submitGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});