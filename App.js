import React from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import DiagnosePage from "./src/Diagnose_page";
import Home from "./src/Home";
import Treatment from "./src/Treatment";
import Header from "./src/header";
import Weather from "./src/weather";
import Profile from "./src/profiles";
import LoadingScreen from "./src/loading_page";
import Login from "./src/login";
import Register from "./src/register";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  if (isLoading) {
    return (
      <ActionSheetProvider>
        <LoadingScreen onFinish={() => setIsLoading(false)} />
      </ActionSheetProvider>
    );
  }

  // ✅ Bottom Tabs for main app
  function MyTabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => (
            <Header onLoginPress={() => setIsLoggedIn(false)} /> // logout
          ),
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") iconName = focused ? "home" : "home-outline";
            else if (route.name === "Diagnose")
              iconName = focused ? "medkit" : "medkit-outline";
            else if (route.name === "Treatment")
              iconName = focused ? "heart" : "heart-outline";
            else if (route.name === "Weather")
              iconName = focused ? "cloud" : "cloud-outline";
            else if (route.name === "Profile")
              iconName = focused ? "person" : "person-outline";

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
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
  }

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        {!isLoggedIn ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login">
              {(props) => (
                <Login {...props} onLogin={() => setIsLoggedIn(true)} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        ) : (
          <MyTabNavigator /> // ✅ Directly load Home Tabs after login
        )}
      </NavigationContainer>
    </ActionSheetProvider>
  );
}


