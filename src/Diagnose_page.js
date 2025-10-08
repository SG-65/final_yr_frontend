import react, { useState, useEffect, useContext,} from 'react';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Image, Platform, ScrollView } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import baseURL from './config'

export default function DiagnosePage() {
  const [image, setImage] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [compatibleWeather, setCompatibleWeather] = useState(null);
  const { showActionSheetWithOptions } = useActionSheet();





  // Function to handle image picking from gallery
  const pickImage = async () => {
     const result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
       allowsEditing: true,
       aspect: [4, 3],
       quality: 1,
     });

     if (!result.canceled) {
      if(Platform.OS === 'web'){
        // On web, fetch blob from URI and convert to File
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], "upload.jpg", { type: blob.type });
        setImage(file); // store File object for web
      }else{
        // On mobile, use the URI directly
        setImage(result.assets[0].uri);
      }
     }
  }








  // Function to handle taking a photo with camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if(Platform.OS === 'web'){
        // On web, fetch blob from URI and convert to File
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], "upload.jpg", { type: blob.type });
        setImage(file); // store File object for web
      }
      else{
        // On mobile, use the URI directly
        setImage(result.assets[0].uri);
      }
    }
  } 








  // Function to handle image upload
  const handleImageUpload = () => {
    const options = ['pick from gallery', 'take a photo', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) 
          pickImage();
        if (buttonIndex === 1) 
          takePhoto();
        if (buttonIndex === cancelButtonIndex){
          setImage(null);
          setDetectionResult(null);
          setPredictionResult(null);
        }
      }
    );
  };
  




const createFormData = (image) => {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // On web we already stored File in state
    formData.append("file", image);
  } else {
    const fileuri = image;
    const filename = fileuri.split("/").pop();
    let ext = filename.split(".").pop().toLowerCase();

    // Map extension to MIME types
    let mimeType = "image/jpeg";
    if (ext === "png") mimeType = "image/png";
    else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";

    formData.append("file", {
      uri: fileuri,
      name: filename,
      type: mimeType,
    });
  }

  return formData;
};





  //detection of image from backend(potato leave or non potato leave)
  const imageDetection = async () => {
    if (!image) {
      Alert.alert("No image selected");
      return;
    }
    try {
      const formData = createFormData(image);
      const responseDetect = await fetch(`${baseURL}/detect`, {
        method: 'POST',
        body: formData,
      });
      const data = await responseDetect.json();
      setDetectionResult(data);
      console.log('Detection Result:', data);
    } catch (error) {
      console.log('Error uploading image:', error);
      Alert.alert("Upload Failed", "Something went wrong");
    }
  } 










  //prediction of image from backend(early or late blight)
  const imagePrediction = async () => {
  if (!image) {
    Alert.alert("No image selected");
    return;
  }

  // ✅ Ensure detection has been done before prediction
  if (!detectionResult) {
    if (Platform.OS === 'web') {
      alert("Please run detection first.");
    } else {
      Alert.alert("Please run detection first.");
    }
    return;
  }

  // ✅ Prevent non-potato leaves from proceeding
  if (detectionResult.final_decision === "Not Potato") {
    if (Platform.OS === 'web') {
      alert("Not a potato leaf");
    } else {
      Alert.alert("Not a potato leaf");
    }
    return;
  }

  try {
    console.log("🧠 Starting prediction...");

    // Prepare image form data
    const formData = createFormData(image);

    // Fetch prediction from FastAPI
    const responsePredict = await fetch(`${baseURL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!responsePredict.ok) {
      throw new Error(`Prediction request failed: ${responsePredict.status}`);
    }

    const data = await responsePredict.json();
    console.log("✅ Prediction Result:", data);
    setPredictionResult(data);

    const leafClass = data.class;
    console.log("🪴 Predicted leaf class:", leafClass);

    if (!leafClass) {
      console.log("⚠️ No leaf class found in prediction response.");
      return;
    }

    // ✅ Fetch compatible weather data
    const weatherURL = `${baseURL}/compatible_weather?leaf=${encodeURIComponent(leafClass)}`;
    console.log("🌦 Fetching compatible weather from:", weatherURL);

    const weatherResponse = await fetch(weatherURL);
    if (!weatherResponse.ok) {
      throw new Error(`Weather fetch failed: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    console.log("✅ Compatible Weather Data:", weatherData);
    setCompatibleWeather(weatherData);

  } catch (error) {
    console.error("❌ Error during prediction or weather fetch:", error);

    if (Platform.OS === 'web') {
      alert("Upload or fetch failed. Check console for details.");
    } else {
      Alert.alert("Upload Failed", "Something went wrong. Please try again.");
    }
  }
};






  return ( 
   <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Diagnose Your Plant</Text>

      {/* Upload Image Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Step 1: Upload Image</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
          <Text style={styles.uploadButtonText}>Select Image</Text>
        </TouchableOpacity>
        {image && (
          <Image 
            source={{ uri: Platform.OS === 'web' ? URL.createObjectURL(image) : image }} 
            style={styles.imagePreview} 
          />
        )}
      </View>

      {/* Detection Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Step 2: Detect Leaf</Text>
        <TouchableOpacity style={styles.actionButton} onPress={imageDetection}>
          <Text style={styles.actionButtonText}>Detect</Text>
        </TouchableOpacity>

        {detectionResult && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Detection Result</Text>
            <Text>Final Decision: {detectionResult.final_decision}</Text>
          </View>
        )}
      </View>

      {/* Prediction Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Step 3: Predict Disease</Text>
        <TouchableOpacity style={styles.actionButton} onPress={imagePrediction}>
          <Text style={styles.actionButtonText}>Predict</Text>
        </TouchableOpacity>

        {predictionResult && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Prediction Result</Text>
            <Text>Class: {predictionResult.class}</Text>
            <Text>Confidence: {(predictionResult.confidence * 100).toFixed(2)}%</Text>
            <Text>Severity: {predictionResult.severity}</Text>
            <Text>Infected Ratio: {predictionResult.infected_ratio}</Text>
          </View>
        )}
        {compatibleWeather && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Compatible Weather Conditions</Text>
            <Text>Weather: {compatibleWeather.Weather}</Text>
            <Text>Temperature: {compatibleWeather.Temperature}</Text>
            <Text>Humidity: {compatibleWeather.Humidity}</Text>
            <Text>Potato Suitability: {compatibleWeather["Potato Suitability"]}</Text>
            <Text>Risk Level: {compatibleWeather["Risk Level"]}</Text>
            <Text>Disease Analysis: {compatibleWeather["Disease Analysis"]}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#74b577ff',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4, // for Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#3a773cff',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  resultBox: {
    marginTop: 12,
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
});
