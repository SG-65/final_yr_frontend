import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  Image, 
  Platform, 
  ScrollView,
  Dimensions,
  RefreshControl
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import baseURL from './config';

const { width } = Dimensions.get('window');

export default function DiagnosePage() {
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [compatibleWeather, setCompatibleWeather] = useState(null);
  const [treatmentResult, setTreatmentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("hindi");
  const [translatedDetection, setTranslatedDetection] = useState(null);
  const [translatedPrediction, setTranslatedPrediction] = useState(null);
  const [translatedWeather, setTranslatedWeather] = useState(null);
  const [translatedTreatment, setTranslatedTreatment] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [diagnosisComplete, setDiagnosisComplete] = useState(false);
  const [isPotatoLeaf, setIsPotatoLeaf] = useState(false);
  const [showTreatment, setShowTreatment] = useState(false);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  
  const predict_detect_url = "https://server2-production-ce4d.up.railway.app";

  const languages = [
    "bengali", "bhojpuri", "gujarati", "hindi", "kannada", 
    "maithili", "malayalam", "marathi", "meitei", "odia", 
    "punjabi", "sanskrit", "tamil", "telugu", "urdu", 
    "santali", "awadhi", "bodo", "khasi", "kokborok", 
    "marwadi", "tulu"
  ];

  useEffect(() => {
    loadUserId();
  }, []);

  const loadUserId = async () => {
    try {
      const storedUserId = await SecureStore.getItemAsync("userId");
      if (storedUserId) {
        setUserId(storedUserId);
        console.log("User ID loaded:", storedUserId);
      }
    } catch (error) {
      console.error("Error loading user ID:", error);
    }
  };

  const savePredictionToLogbook = async (predictionData) => {
    if (!userId) {
      console.warn("No user ID found, skipping logbook save");
      return false;
    }

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
        console.log("Prediction saved to logbook successfully");
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

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant gallery access to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        if (Platform.OS === 'web') {
          const uri = selectedAsset.uri;
          const response = await fetch(uri);
          const blob = await response.blob();
          const file = new File([blob], "upload.jpg", { type: blob.type });
          setImage(file);
          setImageUri(uri);
        } else {
          setImage(selectedAsset);
          setImageUri(selectedAsset.uri);
        }
        resetResults();
      }
    } catch (error) {
      console.error("Gallery Error:", error);
      Alert.alert("Error", "Something went wrong while accessing the gallery.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera access to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        if (Platform.OS === 'web') {
          const uri = selectedAsset.uri;
          const response = await fetch(uri);
          const blob = await response.blob();
          const file = new File([blob], "upload.jpg", { type: blob.type });
          setImage(file);
          setImageUri(uri);
        } else {
          setImage(selectedAsset);
          setImageUri(selectedAsset.uri);
        }
        resetResults();
      }
    } catch (error) {
      console.error("Camera Error:", error);
      Alert.alert("Error", "Something went wrong while accessing the camera.");
    }
  };

  const resetResults = () => {
    setDetectionResult(null);
    setPredictionResult(null);
    setCompatibleWeather(null);
    setTreatmentResult(null);
    setTranslatedDetection(null);
    setTranslatedPrediction(null);
    setTranslatedWeather(null);
    setTranslatedTreatment(null);
    setDiagnosisComplete(false);
    setIsPotatoLeaf(false);
    setShowTreatment(false);
  };

  const handleImageUpload = () => {
    const options = ['📸 Take Photo', '🖼️ Choose from Gallery', '❌ Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) takePhoto();
        if (buttonIndex === 1) pickImage();
        if (buttonIndex === cancelButtonIndex) {
          resetResults();
          setImage(null);
          setImageUri(null);
        }
      }
    );
  };

  const createFormData = () => {
    const formData = new FormData();
    if (Platform.OS === "web") {
      formData.append("file", image);
    } else {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append("file", {
        uri: imageUri,
        name: filename || 'image.jpg',
        type: fileType,
      });
    }
    return formData;
  };

  const createFormDataBlob = async () => {
    const formData = new FormData();
    try {
      if (Platform.OS === 'web') {
        formData.append("file", image);
      } else {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const fileType = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append("file", {
          uri: imageUri,
          name: filename,
          type: fileType,
        });
      }
      return formData;
    } catch (error) {
      console.error("Error creating form data:", error);
      return createFormData();
    }
  };

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

  const fetchTreatment = async (diseaseName) => {
    try {
      console.log("Fetching treatment for:", diseaseName);
      const treatmentURL = `${baseURL}/treatment/${encodeURIComponent(diseaseName)}`;
      const treatmentResponse = await fetch(treatmentURL);
      if (treatmentResponse.ok) {
        const treatmentData = await treatmentResponse.json();
        setTreatmentResult(treatmentData);
        setShowTreatment(true);
        return treatmentData;
      }
      return null;
    } catch (treatmentError) {
      console.error("Error fetching treatment:", treatmentError);
      return null;
    }
  };

  const translateResults = async () => {
    if (targetLanguage === "english") {
      setTranslatedDetection(null);
      setTranslatedPrediction(null);
      setTranslatedWeather(null);
      setTranslatedTreatment(null);
      return;
    }

    setTranslating(true);
    try {
      if (detectionResult) {
        const detectionText = detectionResult.label || 
                             detectionResult.final_decision || 
                             JSON.stringify(detectionResult);
        const translated = await translateText(detectionText, targetLanguage);
        setTranslatedDetection(translated);
      }

      if (predictionResult) {
        const translatedClass = await translateText(predictionResult.class || predictionResult.predicted_class, targetLanguage);
        const translatedSeverity = await translateText(predictionResult.severity || "Unknown", targetLanguage);
        const translatedConfidence = await translateText(
          `${((predictionResult.confidence || 0) * 100).toFixed(2)}%`,
          targetLanguage
        );
        const translatedInfectedRatio = await translateText(
          `${predictionResult.infected_ratio || 0}%`, 
          targetLanguage
        );

        setTranslatedPrediction({
          class: translatedClass,
          severity: translatedSeverity,
          confidence: translatedConfidence,
          infected_ratio: translatedInfectedRatio
        });
      }

      if (compatibleWeather) {
        const translatedWeatherObj = {};
        for (let key in compatibleWeather) {
          const value = compatibleWeather[key];
          translatedWeatherObj[key] = typeof value === 'string' || typeof value === 'number' 
            ? await translateText(String(value), targetLanguage) 
            : value;
        }
        setTranslatedWeather(translatedWeatherObj);
      }

      if (treatmentResult) {
        const translatedTreatmentObj = {};
        for (let key in treatmentResult) {
          const value = treatmentResult[key];
          if (typeof value === 'string') {
            translatedTreatmentObj[key] = await translateText(value, targetLanguage);
          } else if (Array.isArray(value)) {
            translatedTreatmentObj[key] = await Promise.all(
              value.map(item => translateText(item, targetLanguage))
            );
          } else if (typeof value === 'object' && value !== null) {
            const translatedNested = {};
            for (let nestedKey in value) {
              const nestedValue = value[nestedKey];
              if (typeof nestedValue === 'string') {
                translatedNested[nestedKey] = await translateText(nestedValue, targetLanguage);
              } else if (Array.isArray(nestedValue)) {
                translatedNested[nestedKey] = await Promise.all(
                  nestedValue.map(item => translateText(item, targetLanguage))
                );
              } else {
                translatedNested[nestedKey] = nestedValue;
              }
            }
            translatedTreatmentObj[key] = translatedNested;
          } else {
            translatedTreatmentObj[key] = value;
          }
        }
        setTranslatedTreatment(translatedTreatmentObj);
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    if (detectionResult || predictionResult || compatibleWeather || treatmentResult) {
      translateResults();
    }
  }, [targetLanguage, detectionResult, predictionResult, compatibleWeather, treatmentResult]);

  const handleDiagnosis = async () => {
    if (!image || !imageUri) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setDiagnosisComplete(false);
      resetResults();
      
      const formData = await createFormDataBlob();

      // Detection
      const detectResponse = await fetch(`${predict_detect_url}/detect/`, {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (!detectResponse.ok) {
        throw new Error(`Detection failed: ${detectResponse.status}`);
      }

      const detectData = await detectResponse.json();
      setDetectionResult(detectData);

      const label = detectData.label || "";
      const isPotato = label.toLowerCase() === "potato";
      
      setIsPotatoLeaf(isPotato);
      setDiagnosisComplete(true);

      if (!isPotato) {
        Alert.alert(
          "Not a Potato Leaf",
          `Detection: ${label}\nConfidence: ${(detectData.confidence * 100).toFixed(1)}%\n\nPlease upload a clear potato leaf image.`,
          [{ text: "OK" }]
        );
        setLoading(false);
        return;
      }

      // Prediction
      const formData2 = await createFormDataBlob();
      const predictResponse = await fetch(`${predict_detect_url}/predict/`, {
        method: "POST",
        body: formData2,
        headers: { 'Accept': 'application/json' },
      });

      if (!predictResponse.ok) {
        throw new Error(`Prediction failed: ${predictResponse.status}`);
      }

      const predictData = await predictResponse.json();
      setPredictionResult(predictData);

      const leafClass = predictData.class || "";

      // Weather
      if (leafClass) {
        try {
          const weatherURL = `${baseURL}/weather/compatible?leaf=${encodeURIComponent(leafClass)}`;
          const weatherResponse = await fetch(weatherURL);
          if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            setCompatibleWeather(weatherData);
          }
        } catch (weatherError) {
          console.error("Weather error:", weatherError);
        }
      }

      // Treatment
      if (leafClass) {
        await fetchTreatment(leafClass);
      }

      // Save to Logbook
      if (predictData) {
        await savePredictionToLogbook({
          class: predictData.class || leafClass,
          confidence: predictData.confidence || 0,
          severity: predictData.severity || "Medium",
          infected_ratio: predictData.infected_ratio || 0
        });
      }

      Alert.alert("Success", "✅ Diagnosis complete!");

    } catch (error) {
      console.error("Diagnosis error:", error);
      Alert.alert("Error", `Diagnosis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    resetResults();
    setImage(null);
    setImageUri(null);
    setRefreshing(false);
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'Critical': return '#d32f2f';
      case 'High': return '#f44336';
      case 'Moderate': return '#FF9800';
      case 'Low': return '#4CAF50';
      case 'Very Low': return '#2E7D32';
      default: return '#666';
    }
  };

  const getRiskEmoji = (level) => {
    switch(level) {
      case 'Critical': return '🔴';
      case 'High': return '🟠';
      case 'Moderate': return '🟡';
      case 'Low': return '🟢';
      case 'Very Low': return '✅';
      default: return '⚪';
    }
  };

  const renderLanguageSelector = () => (
    <View style={styles.languageContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.languageLabelContainer}>
          <Ionicons name="language-outline" size={16} color="#6C63FF" />
          <Text style={styles.languageLabel}>Language</Text>
        </View>
        {languages.map(lang => (
          <TouchableOpacity 
            key={lang} 
            style={[styles.languageButton, targetLanguage === lang && styles.languageSelected]} 
            onPress={() => setTargetLanguage(lang)}
          >
            <Text style={[styles.languageText, targetLanguage === lang && styles.languageSelectedText]}>
              {lang.slice(0, 3).toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderImageUpload = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <MaterialIcons name="photo-camera" size={22} color="#6C63FF" />
        </View>
        <Text style={styles.cardTitle}>Upload Image</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={handleImageUpload}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#6C63FF', '#5A52D5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.uploadGradient}
        >
          <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Select Image</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity 
            style={styles.removeImageButton}
            onPress={() => {
              setImage(null);
              setImageUri(null);
              resetResults();
            }}
          >
            <Ionicons name="close-circle" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderDiagnosisButton = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconContainer, { backgroundColor: '#FFF3E0' }]}>
          <FontAwesome5 name="stethoscope" size={20} color="#FF6B6B" />
        </View>
        <Text style={styles.cardTitle}>Diagnose</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.actionButton, (!imageUri || loading) && styles.disabledButton]} 
        onPress={handleDiagnosis}
        disabled={!imageUri || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={!imageUri || loading ? ['#ccc', '#bbb'] : ['#FF6B6B', '#EE5A24']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.actionGradient}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <FontAwesome5 name="search-plus" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Run Diagnosis</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Analyzing your plant...</Text>
        </View>
      )}
    </View>
  );

  const renderResults = () => {
    if (!diagnosisComplete) return null;

    return (
      <View style={styles.resultsContainer}>
        {/* Detection Result */}
        {detectionResult && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>🔬 Detection Result</Text>
            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>Status</Text>
              <Text style={[styles.resultValue, { 
                fontWeight: 'bold', 
                color: isPotatoLeaf ? '#4CAF50' : '#f44336',
                fontSize: 16
              }]}>
                {isPotatoLeaf ? '✅ Potato Leaf' : '❌ Not Potato Leaf'}
              </Text>
              <Text style={styles.resultLabel}>Confidence</Text>
              <Text style={styles.resultValue}>
                {(detectionResult.confidence * 100).toFixed(1)}%
              </Text>
              <Text style={styles.resultLabel}>Label</Text>
              <Text style={styles.resultValue}>{detectionResult.label || 'N/A'}</Text>
            </View>
          </View>
        )}

        {/* Prediction Result */}
        {predictionResult && isPotatoLeaf && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>🧠 Disease Prediction</Text>
            <View style={styles.resultSection}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Class</Text>
                <Text style={[styles.resultValue, { fontWeight: 'bold', color: '#2e7d32' }]}>
                  {predictionResult.class || "Unknown"}
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Confidence</Text>
                <Text style={styles.resultValue}>
                  {((predictionResult.confidence || 0) * 100).toFixed(2)}%
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Severity</Text>
                <Text style={styles.resultValue}>{predictionResult.severity || "Unknown"}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Infected Ratio</Text>
                <Text style={styles.resultValue}>{predictionResult.infected_ratio || 0}%</Text>
              </View>
            </View>
          </View>
        )}

        {/* Weather Result */}
        {compatibleWeather && isPotatoLeaf && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>🌦️ Weather Conditions</Text>
            <View style={styles.resultSection}>
              {Object.entries(compatibleWeather).map(([key, value]) => (
                <View key={key} style={styles.resultRow}>
                  <Text style={styles.resultLabel}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                  <Text style={styles.resultValue}>{String(value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Treatment Result */}
        {treatmentResult && isPotatoLeaf && showTreatment && (
          <View style={[styles.resultBox, styles.treatmentBox]}>
            <Text style={styles.resultTitle}>💊 Treatment Recommendation</Text>
            
            <View style={styles.resultSection}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Disease</Text>
                <Text style={[styles.resultValue, { fontWeight: 'bold', color: '#2e7d32' }]}>
                  {treatmentResult.disease}
                </Text>
              </View>
              
              {treatmentResult.risk_level && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Risk Level</Text>
                  <Text style={[
                    styles.resultValue, 
                    { 
                      fontWeight: 'bold',
                      color: getRiskColor(treatmentResult.risk_level)
                    }
                  ]}>
                    {getRiskEmoji(treatmentResult.risk_level)} {treatmentResult.risk_level}
                  </Text>
                </View>
              )}

              {treatmentResult.average_risk_score !== undefined && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Risk Score</Text>
                  <Text style={styles.resultValue}>{treatmentResult.average_risk_score}</Text>
                </View>
              )}

              {treatmentResult.critical_period && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Critical Period</Text>
                  <Text style={styles.resultValue}>{treatmentResult.critical_period}</Text>
                </View>
              )}
            </View>

            {treatmentResult.weather_based_treatment && (
              <View style={styles.resultSubSection}>
                <Text style={styles.resultSubTitle}>🌡️ Weather-Based Treatment</Text>
                {Object.entries(treatmentResult.weather_based_treatment).map(([key, value]) => (
                  <View key={key} style={styles.resultRow}>
                    <Text style={styles.resultSubLabel}>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                    <Text style={styles.resultValue}>{String(value)}</Text>
                  </View>
                ))}
              </View>
            )}

            {treatmentResult.preventive_measures?.length > 0 && (
              <View style={styles.resultSubSection}>
                <Text style={styles.resultSubTitle}>🛡️ Preventive Measures</Text>
                {treatmentResult.preventive_measures.map((measure, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.resultValue}>{measure}</Text>
                  </View>
                ))}
              </View>
            )}

            {treatmentResult.resistant_varieties?.length > 0 && (
              <View style={styles.resultSubSection}>
                <Text style={styles.resultSubTitle}>🌱 Resistant Varieties</Text>
                {treatmentResult.resistant_varieties.map((variety, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.resultValue}>{variety}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Translated Results */}
        {(translating || translatedDetection || translatedPrediction || translatedWeather || translatedTreatment) && 
         targetLanguage !== "english" && isPotatoLeaf && (
          <View style={[styles.resultBox, styles.translatedBox]}>
            <Text style={[styles.resultTitle, { color: '#0d47a1' }]}>
              🌐 Translated ({targetLanguage.toUpperCase()})
            </Text>
            
            {translating && (
              <View style={styles.translatingContainer}>
                <ActivityIndicator size="small" color="#6C63FF" />
                <Text style={styles.translatingText}>Translating...</Text>
              </View>
            )}

            {!translating && translatedDetection && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Detection</Text>
                <Text style={styles.resultValue}>{translatedDetection}</Text>
              </View>
            )}

            {!translating && translatedPrediction && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Prediction</Text>
                <Text style={styles.resultValue}>Class: {translatedPrediction.class}</Text>
                <Text style={styles.resultValue}>Confidence: {translatedPrediction.confidence}</Text>
                <Text style={styles.resultValue}>Severity: {translatedPrediction.severity}</Text>
                <Text style={styles.resultValue}>Infected Ratio: {translatedPrediction.infected_ratio}</Text>
              </View>
            )}

            {!translating && translatedWeather && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Weather</Text>
                {Object.entries(translatedWeather).map(([key, value]) => (
                  <Text key={key} style={styles.resultValue}>{key}: {String(value)}</Text>
                ))}
              </View>
            )}

            {!translating && translatedTreatment && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Treatment</Text>
                {translatedTreatment.disease && (
                  <Text style={styles.resultValue}>Disease: {translatedTreatment.disease}</Text>
                )}
                {translatedTreatment.risk_level && (
                  <Text style={styles.resultValue}>Risk: {translatedTreatment.risk_level}</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Not Potato Warning */}
        {detectionResult && !isPotatoLeaf && (
          <View style={[styles.resultBox, styles.warningBox]}>
            <Text style={[styles.resultTitle, { color: '#c62828' }]}>⚠️ Not a Potato Leaf</Text>
            <Text style={styles.warningText}>
              The uploaded image is not recognized as a potato leaf. 
              Please upload a clear potato leaf image for disease diagnosis.
            </Text>
            {detectionResult.label && (
              <Text style={styles.warningDetail}>
                Detection: {detectionResult.label} ({(detectionResult.confidence * 100).toFixed(1)}% confidence)
              </Text>
            )}
          </View>
        )}

        {/* Bottom spacer for better scrolling */}
        <View style={styles.bottomSpacer} />
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>🔬 Plant Diagnosis</Text>
      <Text style={styles.subtitle}>Upload a leaf image for instant disease detection</Text>

      {renderLanguageSelector()}
      {renderImageUpload()}
      {renderDiagnosisButton()}
      {renderResults()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    fontWeight: '400',
  },
  // Language
  languageContainer: {
    marginBottom: 16,
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
  languageText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  languageSelectedText: {
    color: '#fff',
  },
  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  // Upload
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginTop: 12,
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 4,
  },
  // Action Button
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '500',
  },
  // Results
  resultsContainer: {
    marginTop: 4,
    gap: 12,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  resultSection: {
    gap: 6,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  resultLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 13,
    color: '#1A1A2E',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  resultSubSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
  },
  resultSubTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 6,
  },
  resultSubLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  bulletItem: {
    flexDirection: 'row',
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  bullet: {
    fontSize: 14,
    color: '#6C63FF',
    marginRight: 8,
    width: 14,
  },
  treatmentBox: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  translatedBox: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  warningBox: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: '#f44336',
  },
  warningText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  warningDetail: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  translatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  translatingText: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 20,
  },
});