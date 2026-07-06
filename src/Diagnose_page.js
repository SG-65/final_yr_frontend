// import react, { useState, useEffect, useContext,} from 'react';
// import * as ImagePicker from 'expo-image-picker';
// import { TouchableOpacity, StyleSheet, Text, View, Alert, Image, Platform, ScrollView } from 'react-native';
// import { useActionSheet } from '@expo/react-native-action-sheet';
// import { ActivityIndicator } from 'react-native';
// import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Icons for more visual appeal
// import baseURL from './config'

// export default function DiagnosePage() {
//   const [image, setImage] = useState(null);
//   const [detectionResult, setDetectionResult] = useState(null);
//   const [predictionResult, setPredictionResult] = useState(null);
//   const [compatibleWeather, setCompatibleWeather] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [targetLanguage, setTargetLanguage] = useState("hindi"); // default
//   const [translatedDetection, setTranslatedDetection] = useState(null);
//   const [translatedPrediction, setTranslatedPrediction] = useState(null);
//   const [translatedWeather, setTranslatedWeather] = useState(null);
//   const { showActionSheetWithOptions } = useActionSheet();







//   // Function to handle image picking from gallery
//   const pickImage = async () => {
//      const result = await ImagePicker.launchImageLibraryAsync({
//        mediaTypes: ImagePicker.MediaTypeOptions.Images,
//        allowsEditing: true,
//        aspect: [4, 3],
//        quality: 1,
//      });

//      if (!result.canceled) {
//       if(Platform.OS === 'web'){
//         // On web, fetch blob from URI and convert to File
//         const uri = result.assets[0].uri;
//         const response = await fetch(uri);
//         const blob = await response.blob();
//         const file = new File([blob], "upload.jpg", { type: blob.type });
//         setImage(file); // store File object for web
//       }else{
//         // On mobile, use the URI directly
//         setImage(result.assets[0].uri);
//       }
//      }
//   }








//   // Function to handle taking a photo with camera
//   const takePhoto = async () => {
//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       if(Platform.OS === 'web'){
//         // On web, fetch blob from URI and convert to File
//         const uri = result.assets[0].uri;
//         const response = await fetch(uri);
//         const blob = await response.blob();
//         const file = new File([blob], "upload.jpg", { type: blob.type });
//         setImage(file); // store File object for web
//       }
//       else{
//         // On mobile, use the URI directly
//         setImage(result.assets[0].uri);
//       }
//     }
//   } 






//   // Function to handle image upload
//   const handleImageUpload = () => {
//     const options = ['pick from gallery', 'take a photo', 'Cancel'];
//     const cancelButtonIndex = 2;

//     showActionSheetWithOptions(
//       {
//         options,
//         cancelButtonIndex,
//       },
//       (buttonIndex) => {
//         if (buttonIndex === 0) 
//           pickImage();
//         if (buttonIndex === 1) 
//           takePhoto();
//         if (buttonIndex === cancelButtonIndex){
//           setImage(null);
//           setDetectionResult(null);
//           setPredictionResult(null);
//           setCompatibleWeather(null);
//           setTranslatedDetection(null);
//           setTranslatedPrediction(null);
//           setTranslatedWeather(null);
//         }
//       }
//     );
//   };
  




// const createFormData = (image) => {
//   const formData = new FormData();

//   if (Platform.OS === "web") {
//     // On web we already stored File in state
//     formData.append("file", image);
//   } else {
//     const fileuri = image;
//     const filename = fileuri.split("/").pop();
//     let ext = filename.split(".").pop().toLowerCase();

//     // Map extension to MIME types
//     let mimeType = "image/jpeg";
//     if (ext === "png") mimeType = "image/png";
//     else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";

//     formData.append("file", {
//       uri: fileuri,
//       name: filename,
//       type: mimeType,
//     });
//   }

//   return formData;
// };


// // Function to translate text using backend API
// const translateText = async (text, targetLang) => {
//   if (!text) return "";
//   try {
//     const response = await fetch(
//       `${baseURL}/translate?text=${encodeURIComponent(text)}&target_language=${targetLang}`
//     );
//     if (!response.ok) throw new Error("Translation failed");
//     const data = await response.json();
//     return data.translated_text;
//   } catch (error) {
//     console.error("Translation error:", error);
//     return text; // fallback to original text
//   }
// };

// // Function to handle the full diagnosis process(detection, prediction, weather)
// const handleDiagnosis = async () => {
//   if (!image) {
//     Platform.OS === 'web'
//       ? alert("Please select an image first.")
//       : Alert.alert("No image selected");
//     return;
//   }

//   try {
//     setLoading(true); // 🌀 Start loading
//     console.log("🚀 Starting full diagnosis...");

//     // Prepare FormData
//     const formData = createFormData(image);

//     // 1️⃣ Detect leaf type
//     const detectResponse = await fetch(`${baseURL}/detect`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!detectResponse.ok) {
//       throw new Error(`Detection request failed: ${detectResponse.status}`);
//     }

//     const detectData = await detectResponse.json();
//     console.log("🪴 Detection Result:", detectData);
//     setDetectionResult(detectData);

//     // 2️⃣ Check if it's a potato leaf
//     if (detectData.final_decision === "Not Potato") {
//       Platform.OS === 'web'
//         ? alert("❌ Not a potato leaf.")
//         : Alert.alert("Not a Potato Leaf", "Please upload a potato leaf image.");
//       return;
//     }

//     // 3️⃣ Predict disease
//     console.log("🧠 Running prediction...");
//     const predictResponse = await fetch(`${baseURL}/predict`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!predictResponse.ok) {
//       throw new Error(`Prediction request failed: ${predictResponse.status}`);
//     }

//     const predictData = await predictResponse.json();
//     console.log("✅ Prediction Result:", predictData);
//     setPredictionResult(predictData);

//     const leafClass = predictData.class;
//     if (!leafClass) {
//       console.log("⚠️ No leaf class found in prediction response.");
//       return;
//     }

//     // 4️⃣ Fetch compatible weather data
//     console.log("🌦 Fetching compatible weather...");
//     const weatherURL = `${baseURL}/compatible_weather?leaf=${encodeURIComponent(leafClass)}`;
//     const weatherResponse = await fetch(weatherURL);

//     if (!weatherResponse.ok) {
//       throw new Error(`Weather fetch failed: ${weatherResponse.status}`);
//     }

//     const weatherData = await weatherResponse.json();
//     console.log("✅ Compatible Weather Data:", weatherData);
//     setCompatibleWeather(weatherData);

//     if(detectData) {
//   const translated = await translateText(detectData.final_decision, targetLanguage);
//   setTranslatedDetection(translated);
// }

//     // Translate prediction fields individually
//     if(predictData) {
//       const translatedClass = await translateText(predictData.class, targetLanguage);
//       const translatedSeverity = await translateText(predictData.severity, targetLanguage);
//       const translatedConfidence = await translateText(
//         `${(predictData.confidence*100).toFixed(2)}%`,
//         targetLanguage
//       );
//       const translatedInfectedRatio = await translateText(predictData.infected_ratio.toString(), targetLanguage);

//       setTranslatedPrediction({
//         class: translatedClass,
//         severity: translatedSeverity,
//         confidence: translatedConfidence,
//         infected_ratio: translatedInfectedRatio
//       });
//     }

//     // Translate weather fields individually
//     if(weatherData) {
//       const translatedWeather = {
//         Weather: await translateText(weatherData.Weather, targetLanguage),
//         Temperature: await translateText(weatherData.Temperature, targetLanguage),
//         Humidity: await translateText(weatherData.Humidity, targetLanguage),
//         PotatoSuitability: await translateText(weatherData["Potato Suitability"], targetLanguage),
//         RiskLevel: await translateText(weatherData["Risk Level"], targetLanguage),
//         DiseaseAnalysis: await translateText(weatherData["Disease Analysis"], targetLanguage)
//       };
//       setTranslatedWeather(translatedWeather);
//     }

//     // ✅ Done
//     Platform.OS === 'web'
//       ? alert("✅ Diagnosis complete!")
//       : Alert.alert("Success", "Diagnosis completed successfully!");
//   } catch (error) {
//     console.error("❌ Error during diagnosis:", error);
//     if (Platform.OS === 'web') {
//       alert("Something went wrong. Check console for details.");
//     } else {
//       Alert.alert("Error", "Diagnosis failed. Please try again.");
//     }
//   } finally {
//     setLoading(false); // 🛑 Stop loading
//   }
// };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Diagnose Your Plant</Text>

//       {/* Language Selector */}
//       <View style={styles.languageContainer}>
//         <Text style={styles.sectionLabel}>🌐 Select Language</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {["bengali","bhojpuri","gujarati","hindi","kannada","maithili","malayalam","marathi","meitei","odia","punjabi","sanskrit","tamil","telugu","urdu","santali","awadhi","bodo","khasi","kokborok","marwadi","tulu"].map(lang => (
//             <TouchableOpacity key={lang} style={[styles.languageButton, targetLanguage===lang && styles.languageSelected]} onPress={()=>setTargetLanguage(lang)}>
//               <Text style={[styles.languageText, targetLanguage===lang && {color:'#fff'}]}>{lang.toUpperCase()}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Step 1: Upload */}
//       <View style={[styles.card, styles.shadow]}>
//         <View style={styles.cardHeader}>
//           <MaterialIcons name="photo-camera" size={28} color="#388e3c"/>
//           <Text style={styles.cardTitle}>Step 1: Upload Image</Text>
//         </View>
//         <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
//           <Text style={styles.uploadButtonText}>Select Image</Text>
//         </TouchableOpacity>
//         {image && (
//           <Image source={{ uri: Platform.OS==='web'? URL.createObjectURL(image): image }} style={styles.imagePreview} />
//         )}
//       </View>

//       {/* Step 2: Diagnosis */}
//       <View style={[styles.card, styles.shadow]}>
//         <View style={styles.cardHeader}>
//           <FontAwesome5 name="stethoscope" size={28} color="#f57c00"/>
//           <Text style={styles.cardTitle}>Step 2: Full Diagnosis</Text>
//         </View>
//         <TouchableOpacity style={styles.actionButton} onPress={handleDiagnosis}>
//           <Text style={styles.actionButtonText}>Run Diagnosis</Text>
//         </TouchableOpacity>

//         {/* Original Results */}
// {(detectionResult || predictionResult || compatibleWeather) && (
//   <View style={[styles.resultBox, styles.shadow]}>
//     <Text style={styles.resultTitle}>🟢 Original Results</Text>

//     {detectionResult && (
//       <View style={styles.resultSection}>
//         <Text style={styles.resultLabel}>🪴 Detection:</Text>
//         <Text style={styles.resultValue}>{detectionResult.final_decision}</Text>
//       </View>
//     )}

//     {predictionResult && (
//       <View style={styles.resultSection}>
//         <Text style={styles.resultLabel}>🧠 Prediction:</Text>
//         <Text style={styles.resultValue}>Class: {predictionResult.class}</Text>
//         <Text style={styles.resultValue}>Confidence: {(predictionResult.confidence*100).toFixed(2)}%</Text>
//         <Text style={styles.resultValue}>Severity: {predictionResult.severity}</Text>
//         <Text style={styles.resultValue}>Infected Ratio: {predictionResult.infected_ratio}</Text>
//       </View>
//     )}

//     {compatibleWeather && (
//       <View style={styles.resultSection}>
//         <Text style={styles.resultLabel}>🌦 Compatible Weather:</Text>
//         <Text style={styles.resultValue}>Weather: {compatibleWeather.Weather}</Text>
//         <Text style={styles.resultValue}>Temperature: {compatibleWeather.Temperature}</Text>
//         <Text style={styles.resultValue}>Humidity: {compatibleWeather.Humidity}</Text>
//         <Text style={styles.resultValue}>Potato Suitability: {compatibleWeather["Potato Suitability"]}</Text>
//         <Text style={styles.resultValue}>Risk Level: {compatibleWeather["Risk Level"]}</Text>
//         <Text style={styles.resultValue}>Disease Analysis: {compatibleWeather["Disease Analysis"]}</Text>
//       </View>
//     )}
//   </View>
// )}

// {/* Translated Results */}
// {(translatedDetection || translatedPrediction || translatedWeather) && (
//   <View style={[styles.resultBox, {backgroundColor:'#e3f2fd'}, styles.shadow]}>
//     <Text style={styles.resultTitle}>🌐 Translated Results ({targetLanguage.toUpperCase()})</Text>

//     {translatedDetection && (
//       <View style={styles.resultSection}>
//         <Text style={styles.resultLabel}>🪴 Detection:</Text>
//         <Text style={styles.resultValue}>{translatedDetection}</Text>
//       </View>
//     )}

//     {translatedPrediction && (
//       <View style={styles.resultSection}>
//         <Text style={styles.resultLabel}>🧠 Prediction:</Text>
//         <Text style={styles.resultValue}>Class: {translatedPrediction.class}</Text>
//         <Text style={styles.resultValue}>Confidence: {translatedPrediction.confidence}</Text>
//         <Text style={styles.resultValue}>Severity: {translatedPrediction.severity}</Text>
//         <Text style={styles.resultValue}>Infected Ratio: {translatedPrediction.infected_ratio}</Text>
//       </View>
//     )}

//     {translatedWeather && (
//       <View style={styles.resultSection}>
//         <Text style={styles.resultLabel}>🌦 Compatible Weather:</Text>
//         <Text style={styles.resultValue}>Weather: {translatedWeather.Weather}</Text>
//         <Text style={styles.resultValue}>Temperature: {translatedWeather.Temperature}</Text>
//         <Text style={styles.resultValue}>Humidity: {translatedWeather.Humidity}</Text>
//         <Text style={styles.resultValue}>Potato Suitability: {translatedWeather.PotatoSuitability}</Text>
//         <Text style={styles.resultValue}>Risk Level: {translatedWeather.RiskLevel}</Text>
//         <Text style={styles.resultValue}>Disease Analysis: {translatedWeather.DiseaseAnalysis}</Text>
//       </View>
//     )}
//   </View>
// )}


//         {loading && (
//           <View style={styles.loadingOverlay}>
//             <ActivityIndicator size="large" color="#4CAF50"/>
//             <Text style={styles.loadingText}>Diagnosing your plant...</Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding:16, backgroundColor:'#f2f6f9' },

//   title: { fontSize:26, fontWeight:'bold', textAlign:'center', marginVertical:16, color:'#388e3c' },

//   languageContainer:{ marginVertical:12 },

//   sectionLabel:{ fontWeight:'600', marginBottom:8, fontSize:16, color:'#333' },

//   languageButton:{ paddingVertical:6, paddingHorizontal:14, borderRadius:20, backgroundColor:'#ccc', marginRight:8 },

//   languageSelected:{ backgroundColor:'#388e3c' },

//   languageText:{ color:'#333', fontWeight:'600' },

//   card:{ backgroundColor:'#fff', borderRadius:16, padding:16, marginBottom:20, position:'relative' },

//   shadow:{ shadowColor:'#000', shadowOffset:{width:0,height:6}, shadowOpacity:0.1, shadowRadius:10, elevation:6 },

//   cardHeader:{ flexDirection:'row', alignItems:'center', marginBottom:12 },

//   cardTitle:{ fontSize:18, fontWeight:'bold', marginLeft:8, color:'#333' },

//   uploadButton:{ backgroundColor:'#388e3c', paddingVertical:12, borderRadius:12, marginBottom:10 },

//   uploadButtonText:{ color:'#fff', textAlign:'center', fontWeight:'600', fontSize:16 },

//   actionButton:{ backgroundColor:'#f57c00', paddingVertical:12, borderRadius:12, marginVertical:10 },

//   actionButtonText:{ color:'#fff', textAlign:'center', fontSize:16, fontWeight:'600' },

//   imagePreview:{ width:'100%', height:300, borderRadius:12, marginTop:10 },

//   loadingOverlay:{ position:'absolute', top:0,left:0,right:0,bottom:0, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(255,255,255,0.8)', borderRadius:16 },
  
//   loadingText:{ marginTop:10, fontSize:16, fontWeight:'600', color:'#388e3c' },

//   resultBox: {
//   marginTop: 12,
//   backgroundColor: '#fff',
//   padding: 16,
//   borderRadius: 16,
//   borderWidth: 1,
//   borderColor: '#d0d0d0',
// },

// shadow: {
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 6 },
//   shadowOpacity: 0.1,
//   shadowRadius: 10,
//   elevation: 6,
// },

// resultTitle: {
//   fontSize: 18,
//   fontWeight: '700',
//   marginBottom: 12,
//   color: '#2e7d32',
// },

// resultSection: {
//   marginBottom: 10,
//   paddingBottom: 8,
//   borderBottomWidth: 1,
//   borderBottomColor: '#eee',
// },

// resultLabel: {
//   fontSize: 16,
//   fontWeight: '600',
//   color: '#388e3c',
//   marginBottom: 4,
// },

// resultValue: {
//   fontSize: 15,
//   color: '#333',
//   marginLeft: 6,
//   lineHeight: 20,
// },

// });









































import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Image, Platform, ScrollView } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import baseURL from './config'

export default function DiagnosePage() {
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [compatibleWeather, setCompatibleWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("hindi");
  const [translatedDetection, setTranslatedDetection] = useState(null);
  const [translatedPrediction, setTranslatedPrediction] = useState(null);
  const [translatedWeather, setTranslatedWeather] = useState(null);
  const [translating, setTranslating] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const predict_detect_url="https://server2-production-ce4d.up.railway.app"

  const languages = [
    "bengali", "bhojpuri", "gujarati", "hindi", "kannada", 
    "maithili", "malayalam", "marathi", "meitei", "odia", 
    "punjabi", "sanskrit", "tamil", "telugu", "urdu", 
    "santali", "awadhi", "bodo", "khasi", "kokborok", 
    "marwadi", "tulu"
  ];

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
      }
    } catch (error) {
      console.error("Gallery Error:", error);
      Alert.alert("Error", "Something went wrong while accessing the gallery.");
    }
  }

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
      }
    } catch (error) {
      console.error("Camera Error:", error);
      Alert.alert("Error", "Something went wrong while accessing the camera.");
    }
  }

  const handleImageUpload = () => {
    const options = ['Pick from gallery', 'Take a photo', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) pickImage();
        if (buttonIndex === 1) takePhoto();
        if (buttonIndex === cancelButtonIndex) {
          setImage(null);
          setImageUri(null);
          setDetectionResult(null);
          setPredictionResult(null);
          setCompatibleWeather(null);
          setTranslatedDetection(null);
          setTranslatedPrediction(null);
          setTranslatedWeather(null);
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
      
      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: fileType,
      });
    }

    return formData;
  };

  // FIXED: Updated translateText function with trailing slash and better error handling
  const translateText = async (text, targetLang) => {
    if (!text || targetLang === "english") return text;
    
    try {
      // ADDED trailing slash to match your backend endpoint
      const response = await fetch(
        `${baseURL}/translate/?text=${encodeURIComponent(text)}&target_language=${targetLang}`
      );
      
      if (!response.ok) {
        console.warn(`Translation failed with status: ${response.status}`);
        return text; // Return original text on failure
      }
      
      const data = await response.json();
      return data.translated_text || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original text instead of failing
    }
  };

  const translateResults = async () => {
    if (targetLanguage === "english") {
      setTranslatedDetection(null);
      setTranslatedPrediction(null);
      setTranslatedWeather(null);
      return;
    }

    setTranslating(true);
    try {
      if (detectionResult) {
        const translated = await translateText(detectionResult.final_decision, targetLanguage);
        setTranslatedDetection(translated);
      }

      if (predictionResult) {
        const translatedClass = await translateText(predictionResult.class, targetLanguage);
        const translatedSeverity = await translateText(predictionResult.severity, targetLanguage);
        const translatedConfidence = await translateText(
          `${(predictionResult.confidence * 100).toFixed(2)}%`,
          targetLanguage
        );
        const translatedInfectedRatio = await translateText(
          `${predictionResult.infected_ratio}%`, 
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
        const translatedWeatherObj = {
          Weather: await translateText(compatibleWeather.Weather, targetLanguage),
          Temperature: await translateText(compatibleWeather.Temperature, targetLanguage),
          Humidity: await translateText(compatibleWeather.Humidity, targetLanguage),
          PotatoSuitability: await translateText(compatibleWeather["Potato Suitability"], targetLanguage),
          RiskLevel: await translateText(compatibleWeather["Risk Level"], targetLanguage),
          DiseaseAnalysis: await translateText(compatibleWeather["Disease Analysis"], targetLanguage)
        };
        setTranslatedWeather(translatedWeatherObj);
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    if (detectionResult || predictionResult || compatibleWeather) {
      translateResults();
    }
  }, [targetLanguage, detectionResult, predictionResult, compatibleWeather]);

  // FIXED: Updated handleDiagnosis with trailing slashes
  const handleDiagnosis = async () => {
    if (!image || !imageUri) {
      Alert.alert("No image selected", "Please select an image before diagnosing.");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting full diagnosis...");

      const formData = createFormData();

      // ADDED trailing slash to /detect/
      const detectResponse = await fetch(`${predict_detect_url}/detect/`, {
        method: "POST",
        body: formData,
      });

      if (!detectResponse.ok) {
        throw new Error(`Detection request failed: ${detectResponse.status}`);
      }

      const detectData = await detectResponse.json();
      console.log("Detection Result:", detectData);
      setDetectionResult(detectData);

      if (detectData.final_decision === "Not Potato") {
        Alert.alert("Not a Potato Leaf", "Please upload a potato leaf image.");
        setLoading(false);
        return;
      }

      const formData2 = createFormData();

      // ADDED trailing slash to /predict/
      const predictResponse = await fetch(`${predict_detect_url}/predict/`, {
        method: "POST",
        body: formData2,
      });

      if (!predictResponse.ok) {
        throw new Error(`Prediction request failed: ${predictResponse.status}`);
      }

      const predictData = await predictResponse.json();
      console.log("Prediction Result:", predictData);
      setPredictionResult(predictData);

      const leafClass = predictData.class;
      if (leafClass) {
        const weatherURL = `${baseURL}/weather/compatible?leaf=${encodeURIComponent(leafClass)}`;
        const weatherResponse = await fetch(weatherURL);

        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          console.log("Weather Data:", weatherData);
          setCompatibleWeather(weatherData);
        }
      }

      Alert.alert("Success", "Diagnosis completed successfully!");
    } catch (error) {
      console.error("Error during diagnosis:", error);
      Alert.alert("Error", `Diagnosis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Diagnose Your Plant</Text>

      <View style={styles.languageContainer}>
        <Text style={styles.sectionLabel}>🌐 Select Language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {languages.map(lang => (
            <TouchableOpacity 
              key={lang} 
              style={[styles.languageButton, targetLanguage === lang && styles.languageSelected]} 
              onPress={() => setTargetLanguage(lang)}
            >
              <Text style={[styles.languageText, targetLanguage === lang && { color: '#fff' }]}>
                {lang.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.card, styles.shadow]}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="photo-camera" size={28} color="#388e3c" />
          <Text style={styles.cardTitle}>Step 1: Upload Image</Text>
        </View>
        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
          <Text style={styles.uploadButtonText}>Select Image</Text>
        </TouchableOpacity>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}
      </View>

      <View style={[styles.card, styles.shadow]}>
        <View style={styles.cardHeader}>
          <FontAwesome5 name="stethoscope" size={28} color="#f57c00" />
          <Text style={styles.cardTitle}>Step 2: Full Diagnosis</Text>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={handleDiagnosis}>
          <Text style={styles.actionButtonText}>Run Diagnosis</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Diagnosing your plant...</Text>
          </View>
        )}

        {(detectionResult || predictionResult || compatibleWeather) && (
          <View style={[styles.resultBox, styles.shadow]}>
            <Text style={styles.resultTitle}>🟢 Original Results (English)</Text>

            {detectionResult && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>🪴 Detection:</Text>
                <Text style={styles.resultValue}>{detectionResult.final_decision}</Text>
              </View>
            )}

            {predictionResult && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>🧠 Prediction:</Text>
                <Text style={styles.resultValue}>Class: {predictionResult.class}</Text>
                <Text style={styles.resultValue}>Confidence: {(predictionResult.confidence * 100).toFixed(2)}%</Text>
                <Text style={styles.resultValue}>Severity: {predictionResult.severity}</Text>
                <Text style={styles.resultValue}>Infected Ratio: {predictionResult.infected_ratio}%</Text>
              </View>
            )}

            {compatibleWeather && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>🌦 Compatible Weather:</Text>
                <Text style={styles.resultValue}>City: {compatibleWeather.City}</Text>
                <Text style={styles.resultValue}>Weather: {compatibleWeather.Weather}</Text>
                <Text style={styles.resultValue}>Temperature: {compatibleWeather.Temperature}</Text>
                <Text style={styles.resultValue}>Potato Suitability: {compatibleWeather["Potato Suitability"]}</Text>
                <Text style={styles.resultValue}>Risk Level: {compatibleWeather["Risk Level"]}</Text>
              </View>
            )}
          </View>
        )}

        {(translating || translatedDetection || translatedPrediction || translatedWeather) && targetLanguage !== "english" && (
          <View style={[styles.resultBox, { backgroundColor: '#e3f2fd' }, styles.shadow]}>
            <Text style={styles.resultTitle}>🌐 Translated Results ({targetLanguage.toUpperCase()})</Text>
            
            {translating && (
              <View style={styles.translatingContainer}>
                <ActivityIndicator size="small" color="#388e3c" />
                <Text style={styles.translatingText}>Translating...</Text>
              </View>
            )}

            {!translating && translatedDetection && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>🪴 Detection:</Text>
                <Text style={styles.resultValue}>{translatedDetection}</Text>
              </View>
            )}

            {!translating && translatedPrediction && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>🧠 Prediction:</Text>
                <Text style={styles.resultValue}>Class: {translatedPrediction.class}</Text>
                <Text style={styles.resultValue}>Confidence: {translatedPrediction.confidence}</Text>
                <Text style={styles.resultValue}>Severity: {translatedPrediction.severity}</Text>
                <Text style={styles.resultValue}>Infected Ratio: {translatedPrediction.infected_ratio}</Text>
              </View>
            )}

            {!translating && translatedWeather && (
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>🌦 Compatible Weather:</Text>
                <Text style={styles.resultValue}>Weather: {translatedWeather.Weather}</Text>
                <Text style={styles.resultValue}>Potato Suitability: {translatedWeather.PotatoSuitability}</Text>
                <Text style={styles.resultValue}>Risk Level: {translatedWeather.RiskLevel}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f2f6f9' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 16, color: '#388e3c' },
  languageContainer: { marginVertical: 12 },
  sectionLabel: { fontWeight: '600', marginBottom: 8, fontSize: 16, color: '#333' },
  languageButton: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#ccc', marginRight: 8 },
  languageSelected: { backgroundColor: '#388e3c' },
  languageText: { color: '#333', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, position: 'relative' },
  shadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8, color: '#333' },
  uploadButton: { backgroundColor: '#388e3c', paddingVertical: 12, borderRadius: 12, marginBottom: 10 },
  uploadButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  actionButton: { backgroundColor: '#f57c00', paddingVertical: 12, borderRadius: 12, marginVertical: 10 },
  actionButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  imagePreview: { width: '100%', height: 300, borderRadius: 12, marginTop: 10 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16 },
  loadingText: { marginTop: 10, fontSize: 16, fontWeight: '600', color: '#388e3c' },
  resultBox: { marginTop: 12, backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#d0d0d0' },
  resultTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#2e7d32' },
  resultSection: { marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  resultLabel: { fontSize: 16, fontWeight: '600', color: '#388e3c', marginBottom: 4 },
  resultValue: { fontSize: 15, color: '#333', marginLeft: 6, lineHeight: 20 },
  translatingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 },
  translatingText: { marginLeft: 10, fontSize: 14, color: '#388e3c' }
});




















































































// import React, { useState, useEffect } from "react";
// import * as ImagePicker from "expo-image-picker";
// import {
//   TouchableOpacity,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   Platform,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { useActionSheet } from "@expo/react-native-action-sheet";
// import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
// import baseURL from "./config";
// import { useLanguage } from "./globalLanguage";

// export default function DiagnosePage() {
//   const [image, setImage] = useState(null);
//   const [detectionResult, setDetectionResult] = useState(null);
//   const [predictionResult, setPredictionResult] = useState(null);
//   const [compatibleWeather, setCompatibleWeather] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const { language, setLanguage, translateText, translateBulk, translations, refreshKey } =
//     useLanguage();
//   const { showActionSheetWithOptions } = useActionSheet();

//   // UI labels
//   const uiLabels = {
//     title: "Diagnose Your Plant",
//     step1: "Step 1: Upload Image",
//     step2: "Step 2: Full Diagnosis",
//     selectImage: "Select Image",
//     runDiagnosis: "Run Diagnosis",
//     originalResults: "Results",
//     detection: "Detection",
//     prediction: "Prediction",
//     classLabel: "Class",
//     confidence: "Confidence",
//     severity: "Severity",
//     infectedRatio: "Infected Ratio",
//     compatibleWeather: "Compatible Weather",
//     weather: "Weather",
//     temperature: "Temperature",
//     humidity: "Humidity",
//     potatoSuitability: "Potato Suitability",
//     riskLevel: "Risk Level",
//     diseaseAnalysis: "Disease Analysis",
//   };

//   // Translate UI labels whenever language changes
//   useEffect(() => {
//     translateBulk(uiLabels);
//   }, [language]);

//   // Image picker & camera
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });
//     if (!result.canceled) handlePickedImage(result);
//   };

//   const takePhoto = async () => {
//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });
//     if (!result.canceled) handlePickedImage(result);
//   };

//   const handlePickedImage = async (result) => {
//     if (Platform.OS === "web") {
//       const uri = result.assets[0].uri;
//       const response = await fetch(uri);
//       const blob = await response.blob();
//       const file = new File([blob], "upload.jpg", { type: blob.type });
//       setImage(file);
//     } else {
//       setImage(result.assets[0].uri);
//     }
//     setDetectionResult(null);
//     setPredictionResult(null);
//     setCompatibleWeather(null);
//   };

//   const handleImageUpload = () => {
//     const options = ["Pick from gallery", "Take a photo", "Cancel"];
//     const cancelButtonIndex = 2;
//     showActionSheetWithOptions({ options, cancelButtonIndex }, (buttonIndex) => {
//       if (buttonIndex === 0) pickImage();
//       if (buttonIndex === 1) takePhoto();
//       if (buttonIndex === cancelButtonIndex) {
//         setImage(null);
//         setDetectionResult(null);
//         setPredictionResult(null);
//         setCompatibleWeather(null);
//       }
//     });
//   };

//   const createFormData = (image) => {
//     const formData = new FormData();
//     if (Platform.OS === "web") {
//       formData.append("file", image);
//     } else {
//       const filename = image.split("/").pop();
//       let ext = filename.split(".").pop().toLowerCase();
//       let mimeType = ext === "png" ? "image/png" : "image/jpeg";
//       formData.append("file", { uri: image, name: filename, type: mimeType });
//     }
//     return formData;
//   };

//   // Diagnose handler
//   const handleDiagnosis = async () => {
//     if (!image) return alert("Please select an image");
//     setLoading(true);
//     try {
//       const formData = createFormData(image);

//       // Detect
//       const detectRes = await fetch(`${baseURL}/detect`, { method: "POST", body: formData });
//       const detectData = await detectRes.json();

//       // Predict
//       const predictRes = await fetch(`${baseURL}/predict`, { method: "POST", body: formData });
//       const predictData = await predictRes.json();

//       // Weather
//       const weatherRes = await fetch(
//         `${baseURL}/compatible_weather?leaf=${encodeURIComponent(predictData.class)}`
//       );
//       const weatherData = await weatherRes.json();

//       // Translate results
//       const translatedDetection = await translateText(detectData.final_decision);
//       const translatedPrediction = {
//         class: await translateText(predictData.class),
//         severity: await translateText(predictData.severity),
//         confidence: `${(predictData.confidence * 100).toFixed(2)}%`,
//         infected_ratio: String(predictData.infected_ratio),
//       };
//       const translatedWeather = {
//         Weather: await translateText(weatherData.Weather),
//         Temperature: weatherData.Temperature,
//         Humidity: weatherData.Humidity,
//         PotatoSuitability: await translateText(weatherData["Potato Suitability"]),
//         RiskLevel: await translateText(weatherData["Risk Level"]),
//         DiseaseAnalysis: await translateText(weatherData["Disease Analysis"]),
//       };

//       setDetectionResult({ ...detectData, final_decision: translatedDetection });
//       setPredictionResult(translatedPrediction);
//       setCompatibleWeather(translatedWeather);
//     } catch (err) {
//       console.warn("Diagnosis error:", err);
//       alert("Diagnosis failed. Check console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Whenever language changes, force re-render to translate results & UI
//   useEffect(() => {}, [refreshKey]);

//   return (
//     <ScrollView style={styles.container} key={refreshKey}>
//       <Text style={styles.title}>{translations.title || uiLabels.title}</Text>

//       {/* Language Selector */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
//         {["english", "hindi", "bengali", "marathi"].map((lang) => (
//           <TouchableOpacity
//             key={lang}
//             style={[styles.languageButton, language === lang && styles.languageSelected]}
//             onPress={() => setLanguage(lang)}
//           >
//             <Text style={[styles.languageText, language === lang && { color: "#fff" }]}>
//               {lang.toUpperCase()}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Step 1: Upload */}
//       <View style={[styles.card, styles.shadow]}>
//         <View style={styles.cardHeader}>
//           <MaterialIcons name="photo-camera" size={28} color="#388e3c" />
//           <Text style={styles.cardTitle}>{translations.step1 || uiLabels.step1}</Text>
//         </View>
//         <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
//           <Text style={styles.uploadButtonText}>{translations.selectImage || uiLabels.selectImage}</Text>
//         </TouchableOpacity>
//         {image && (
//           <Image
//             source={{ uri: Platform.OS === "web" ? URL.createObjectURL(image) : image }}
//             style={styles.imagePreview}
//           />
//         )}
//       </View>

//       {/* Step 2: Diagnosis */}
//       <View style={[styles.card, styles.shadow]}>
//         <View style={styles.cardHeader}>
//           <FontAwesome5 name="stethoscope" size={28} color="#f57c00" />
//           <Text style={styles.cardTitle}>{translations.step2 || uiLabels.step2}</Text>
//         </View>
//         <TouchableOpacity style={styles.actionButton} onPress={handleDiagnosis}>
//           <Text style={styles.actionButtonText}>{translations.runDiagnosis || uiLabels.runDiagnosis}</Text>
//         </TouchableOpacity>

//         {/* Results */}
//         {(detectionResult || predictionResult || compatibleWeather) && (
//           <View style={[styles.resultBox, styles.shadow]}>
//             <Text style={styles.resultTitle}>{translations.originalResults || uiLabels.originalResults}</Text>

//             {detectionResult && (
//               <View style={styles.resultSection}>
//                 <Text style={styles.resultLabel}>{translations.detection || uiLabels.detection}:</Text>
//                 <Text style={styles.resultValue}>{detectionResult.final_decision}</Text>
//               </View>
//             )}

//             {predictionResult && (
//               <View style={styles.resultSection}>
//                 <Text style={styles.resultLabel}>{translations.prediction || uiLabels.prediction}:</Text>
//                 <Text style={styles.resultValue}>Class: {predictionResult.class}</Text>
//                 <Text style={styles.resultValue}>Confidence: {predictionResult.confidence}</Text>
//                 <Text style={styles.resultValue}>Severity: {predictionResult.severity}</Text>
//                 <Text style={styles.resultValue}>Infected Ratio: {predictionResult.infected_ratio}</Text>
//               </View>
//             )}

//             {compatibleWeather && (
//               <View style={styles.resultSection}>
//                 <Text style={styles.resultLabel}>{translations.compatibleWeather || uiLabels.compatibleWeather}:</Text>
//                 <Text style={styles.resultValue}>Weather: {compatibleWeather.Weather}</Text>
//                 <Text style={styles.resultValue}>Temperature: {compatibleWeather.Temperature}</Text>
//                 <Text style={styles.resultValue}>Humidity: {compatibleWeather.Humidity}</Text>
//                 <Text style={styles.resultValue}>Potato Suitability: {compatibleWeather.PotatoSuitability}</Text>
//                 <Text style={styles.resultValue}>Risk Level: {compatibleWeather.RiskLevel}</Text>
//                 <Text style={styles.resultValue}>Disease Analysis: {compatibleWeather.DiseaseAnalysis}</Text>
//               </View>
//             )}
//           </View>
//         )}

//         {loading && (
//           <View style={styles.loadingOverlay}>
//             <ActivityIndicator size="large" color="#4CAF50" />
//             <Text style={styles.loadingText}>Diagnosing your plant...</Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: "#f2f6f9",
//     flex: 1,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 16,
//     color: "#388e3c",
//   },
//   languageButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 20,
//     backgroundColor: "#ccc",
//     marginRight: 8,
//   },
//   languageSelected: {
//     backgroundColor: "#388e3c",
//   },
//   languageText: {
//     color: "#333",
//     fontWeight: "600",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     position: "relative",
//   },
//   shadow: {
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginLeft: 8,
//     color: "#333",
//   },
//   uploadButton: {
//     backgroundColor: "#388e3c",
//     paddingVertical: 12,
//     borderRadius: 12,
//     marginBottom: 10,
//   },
//   uploadButtonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   actionButton: {
//     backgroundColor: "#f57c00",
//     paddingVertical: 12,
//     borderRadius: 12,
//     marginVertical: 10,
//   },
//   actionButtonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   imagePreview: {
//     width: "100%",
//     height: 300,
//     borderRadius: 12,
//     marginTop: 10,
//   },
//   loadingOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.8)",
//     borderRadius: 16,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#388e3c",
//   },
//   resultBox: {
//     marginTop: 12,
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#d0d0d0",
//   },
//   resultTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 12,
//     color: "#2e7d32",
//   },
//   resultSection: {
//     marginBottom: 10,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   resultLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#388e3c",
//     marginBottom: 4,
//   },
//   resultValue: {
//     fontSize: 15,
//     color: "#333",
//     marginLeft: 6,
//     lineHeight: 20,
//   },
// });


