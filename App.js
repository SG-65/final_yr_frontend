import React from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import DiagnosePage from './src/Diagnose_page'// <-- your component where you have handleImageUpload
import Home from './src/Home'
import Treatment from './src/Treatment'
import Header from  './src/header'
import Weather from "./src/weather";
import LoadingScreen from "./src/loading_page";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();



export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />;
  }
  
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route, navigation }) => ({
            header: () => (
              <Header onLoginPress={() => alert("Login pressed")} />
            ),
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Diagnose") {
                iconName = focused ? "medkit" : "medkit-outline";
              } else if (route.name === "Treatment") {
                iconName = focused ? "heart" : "heart-outline";
              }
              else if (route.name === "Weather") {
                iconName = focused ? "cloud" : "cloud-outline";
              }

              // Return the icon component
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Diagnose" component={DiagnosePage} />
          <Tab.Screen name="Treatment" component={Treatment} />
          <Tab.Screen name="Weather" component={Weather} />
        </Tab.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}