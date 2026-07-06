// Logbook.js (Updated with SecureStore for Expo)
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import baseURL from "./config";

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
      
      // Fetch history
      const historyResponse = await fetch(`${baseURL}/log/history/${uid}`);
      const historyData = await historyResponse.json();
      setHistory(historyData);
      
      // Fetch dashboard data
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

  const handleSavePrediction = async () => {
    if (!newPrediction.predicted_class || !newPrediction.confidence || 
        !newPrediction.severity || !newPrediction.ratio) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    
    try {
      const response = await fetch(`${baseURL}/log/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      case "low":
        return styles.severityLow;
      case "medium":
        return styles.severityMedium;
      case "high":
        return styles.severityHigh;
      default:
        return styles.severityLow;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return styles.confidenceHigh;
    if (confidence >= 60) return styles.confidenceMedium;
    return styles.confidenceLow;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your prediction history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📒 Prediction Logbook</Text>
        <Text style={styles.userIdText}>User ID: {userId}</Text>
        <TouchableOpacity 
          style={styles.changeUserButton}
          onPress={() => setUserIdModalVisible(true)}
        >
          <Text style={styles.changeUserText}>Change User</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {dashboardData && (
          <View style={styles.dashboardContainer}>
            <Text style={styles.sectionTitle}>📊 Dashboard Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="analytics-outline" size={32} color="#4CAF50" />
                <Text style={styles.statNumber}>{dashboardData.total_predictions}</Text>
                <Text style={styles.statLabel}>Total Predictions</Text>
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
            <Text style={styles.sectionTitle}>📜 Prediction History</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setSaveModalVisible(true)}
            >
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
              <Text style={styles.addButtonText}>Add Prediction</Text>
            </TouchableOpacity>
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateText}>No predictions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Save your first prediction to see it here
              </Text>
            </View>
          ) : (
            history.map((prediction, index) => (
              <TouchableOpacity
                key={prediction._id || index}
                style={styles.predictionCard}
                onPress={() => {
                  setSelectedPrediction(prediction);
                  setModalVisible(true);
                }}
              >
                <View style={styles.predictionHeader}>
                  <View style={styles.predictionDateContainer}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.predictionDate}>{prediction.prediction_date}</Text>
                  </View>
                  <View style={styles.predictionTimeContainer}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.predictionTime}>{prediction.prediction_time}</Text>
                  </View>
                </View>

                <View style={styles.predictionBody}>
                  <View style={styles.diseaseInfo}>
                    <Text style={styles.diseaseLabel}>Disease:</Text>
                    <Text style={styles.diseaseValue}>{prediction.class}</Text>
                  </View>

                  <View style={styles.confidenceInfo}>
                    <Text style={styles.confidenceLabel}>Confidence:</Text>
                    <Text 
                      style={[
                        styles.confidenceValue,
                        getConfidenceColor(prediction.confidence)
                      ]}
                    >
                      {prediction.confidence}%
                    </Text>
                  </View>

                  <View style={styles.severityInfo}>
                    <Text style={styles.severityLabel}>Severity:</Text>
                    <Text 
                      style={[
                        styles.severityValue,
                        getSeverityColor(prediction.severity)
                      ]}
                    >
                      {prediction.severity}
                    </Text>
                  </View>

                  <View style={styles.ratioInfo}>
                    <Text style={styles.ratioLabel}>Infected Ratio:</Text>
                    <Text style={styles.ratioValue}>{prediction.infected_ratio}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
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
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedPrediction && (
              <ScrollView>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Disease:</Text>
                  <Text style={styles.detailValue}>{selectedPrediction.class}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Confidence:</Text>
                  <Text style={styles.detailValue}>{selectedPrediction.confidence}%</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Severity:</Text>
                  <Text style={[
                    styles.detailValue,
                    getSeverityColor(selectedPrediction.severity)
                  ]}>
                    {selectedPrediction.severity}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Infected Ratio:</Text>
                  <Text style={styles.detailValue}>{selectedPrediction.infected_ratio}%</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{selectedPrediction.prediction_date}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Time:</Text>
                  <Text style={styles.detailValue}>{selectedPrediction.prediction_time}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Prediction ID:</Text>
                  <Text style={styles.detailValue}>{selectedPrediction._id}</Text>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Save New Prediction</Text>
              <TouchableOpacity onPress={() => setSaveModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Predicted Class *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Early Blight, Late Blight, Healthy"
                  value={newPrediction.predicted_class}
                  onChangeText={(text) => setNewPrediction({...newPrediction, predicted_class: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confidence (%) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0-100"
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
              <Text style={styles.saveButtonText}>Save Prediction</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter User ID</Text>
            <Text style={styles.modalSubtitle}>
              Please enter your User ID to view your prediction history
            </Text>
            
            <TextInput
              style={styles.userIdInput}
              placeholder="Enter User ID"
              value={tempUserId}
              onChangeText={setTempUserId}
              autoCapitalize="none"
            />
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={saveUserId}
            >
              <Text style={styles.submitButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#4CAF50",
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  userIdText: {
    fontSize: 14,
    color: "#e8f5e9",
    marginBottom: 8,
  },
  changeUserButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  changeUserText: {
    color: "#fff",
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  dashboardContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  statsGrid: {
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 3,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  diseaseBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  diseaseName: {
    width: 100,
    fontSize: 14,
    color: "#333",
  },
  barContainer: {
    flex: 1,
    height: 24,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  bar: {
    height: "100%",
    borderRadius: 12,
  },
  diseaseCount: {
    width: 40,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
  },
  historyContainer: {
    padding: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: "#4CAF50",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 8,
  },
  predictionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  predictionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  predictionDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  predictionDate: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  predictionTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  predictionTime: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  predictionBody: {
    gap: 8,
  },
  diseaseInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  diseaseLabel: {
    fontSize: 14,
    color: "#666",
  },
  diseaseValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  confidenceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confidenceLabel: {
    fontSize: 14,
    color: "#666",
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  confidenceHigh: {
    color: "#4CAF50",
  },
  confidenceMedium: {
    color: "#FF9800",
  },
  confidenceLow: {
    color: "#f44336",
  },
  severityInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  severityLabel: {
    fontSize: 14,
    color: "#666",
  },
  severityValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  severityLow: {
    color: "#4CAF50",
  },
  severityMedium: {
    color: "#FF9800",
  },
  severityHigh: {
    color: "#f44336",
  },
  ratioInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratioLabel: {
    fontSize: 14,
    color: "#666",
  },
  ratioValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  userIdInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  severityButtons: {
    flexDirection: "row",
    gap: 10,
  },
  severityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  severityButtonActive: {
    borderWidth: 2,
  },
  severityButtonLow: {
    backgroundColor: "#e8f5e9",
  },
  severityButtonMedium: {
    backgroundColor: "#fff3e0",
  },
  severityButtonHigh: {
    backgroundColor: "#ffebee",
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  severityButtonTextActive: {
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});