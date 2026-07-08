import React, { useState, useEffect } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import baseURL from './config';

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    fetchWeather();
    getGreeting();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      
      // Get location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        setWeather(null);
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Fetch weather data from your backend
      const response = await fetch(`${baseURL}/weather/current`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWeather(data);
      } else {
        console.log("Weather fetch failed");
        setWeather(null);
      }
    } catch (error) {
      console.error("Weather error:", error);
      setWeather(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather();
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

  // Weather Card - Same style as other cards
  const WeatherCard = () => {
    // Extract weather data for display
    const temp = weather?.temperature?.current || "N/A";
    const condition = weather?.condition || weather?.Weather || "Clear";
    const location = weather?.City || "Your Location";

    return (
      <TouchableOpacity 
        style={[styles.card, styles.cardShadow]} 
        onPress={() => navigation.navigate("Weather")}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <View style={styles.weatherIconContainer}>
            <Ionicons name={getWeatherIcon(condition)} size={40} color="#2196F3" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.cardTitle}>Weather</Text>
            <Text style={styles.cardSubtitle}>
              {loading ? "Loading..." : `${temp} • ${condition}`}
            </Text>
            <Text style={styles.weatherLocationText}>
              <Ionicons name="location-outline" size={14} color="#888" />
              {" "}{loading ? "..." : location}
            </Text>
          </View>
        </View>
        <View style={[styles.cardFooter, { backgroundColor: "#2196f3" }]}>
          <Text style={styles.cardButtonText}>View Weather</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const menuItems = [
    {
      id: 'diagnose',
      title: 'Diagnose Your Plant',
      subtitle: 'Detect disease from plant leaves',
      icon: 'local-florist',
      iconType: 'material',
      color: '#6C63FF',
      gradient: ['#6C63FF', '#5A52D5'],
      route: 'Diagnose',
      bgColor: '#6C63FF'
    },
    {
      id: 'treatment',
      title: 'Treatment Guide',
      subtitle: 'Get treatment suggestions',
      icon: 'pills',
      iconType: 'fontawesome5',
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#EE5A24'],
      route: 'Treatment',
      bgColor: '#FF6B6B'
    },
    {
      id: 'logbook',
      title: 'Your Logbook',
      subtitle: 'View prediction history',
      icon: 'person',
      iconType: 'material',
      color: '#00B894',
      gradient: ['#00B894', '#00A381'],
      route: 'Logbook',
      bgColor: '#00B894'
    },
    {
      id: 'weather',
      title: 'Weather',
      subtitle: 'Check weather conditions',
      icon: 'cloud-outline',
      iconType: 'ionicon',
      color: '#2196F3',
      gradient: ['#2196F3', '#1976D2'],
      route: 'Weather',
      bgColor: '#2196F3'
    }
  ];

  const renderIcon = (item) => {
    if (item.iconType === 'material') {
      return <MaterialIcons name={item.icon} size={32} color={item.color} />;
    } else if (item.iconType === 'fontawesome5') {
      return <FontAwesome5 name={item.icon} size={32} color={item.color} />;
    } else if (item.iconType === 'ionicon') {
      return <Ionicons name={item.icon} size={32} color={item.color} />;
    }
    return <Ionicons name={item.icon} size={32} color={item.color} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6C63FF"]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Greeting */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting}!</Text>
            <Text style={styles.welcomeText}>Welcome to Leafyfication</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F0FE' }]}>
              <MaterialIcons name="local-florist" size={20} color="#6C63FF" />
            </View>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Diseases</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
              <FontAwesome5 name="pills" size={18} color="#FF6B6B" />
            </View>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Treatments</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#E0F7FA' }]}>
              <Ionicons name="book-outline" size={18} color="#00B894" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Records</Text>
          </View>
        </View>

        {/* Menu Cards */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.menuCard}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.menuCardGradient}
            >
              <View style={styles.menuCardContent}>
                <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  {renderIcon(item)}
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        {/* Weather Card - Same style as other cards */}
        <TouchableOpacity 
          style={[styles.card, styles.cardShadow]} 
          onPress={() => navigation.navigate("Weather")}
          activeOpacity={0.9}
        >
          <View style={styles.cardContent}>
            <View style={styles.weatherIconContainer}>
              <Ionicons 
                name={weather && !loading ? getWeatherIcon(weather?.condition || weather?.Weather) : "cloud-outline"} 
                size={40} 
                color="#2196F3" 
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Weather</Text>
              <Text style={styles.cardSubtitle}>
                {loading ? "Loading..." : `${weather?.temperature?.current || "N/A"} • ${weather?.condition || weather?.Weather || "Clear"}`}
              </Text>
              <Text style={styles.weatherLocationText}>
                <Ionicons name="location-outline" size={14} color="#888" />
                {" "}{loading ? "Detecting..." : weather?.City || "Your Location"}
              </Text>
            </View>
          </View>
          <View style={[styles.cardFooter, { backgroundColor: "#2196f3" }]}>
            <Text style={styles.cardButtonText}>View Weather</Text>
          </View>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>🌱 Keep your plants healthy</Text>
          <Text style={styles.footerVersion}>Version 2.0.0</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    padding: 20,
    paddingTop: 10,
  },
  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 14,
  },
  // Menu Cards
  menuCard: {
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  menuCardGradient: {
    padding: 16,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  // Original Card Style (for Weather)
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
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  weatherIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherLocationText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  // Footer
  footerContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  footerVersion: {
    fontSize: 12,
    color: '#BBB',
    marginTop: 4,
  },
});