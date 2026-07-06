// import React from "react";
// import { ActionSheetProvider } from "@expo/react-native-action-sheet";
// import DiagnosePage from "./src/Diagnose_page";
// import Home from "./src/Home";
// import Treatment from "./src/Treatment";
// import Header from "./src/header";
// import Weather from "./src/weather";
// import Logbook from "./src/logbook";
// import LoadingScreen from "./src/loading_page";
// import Login from "./src/login";
// import Register from "./src/register";
// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Ionicons } from "@expo/vector-icons";

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [isLoading, setIsLoading] = React.useState(true);
//   const [isLoggedIn, setIsLoggedIn] = React.useState(false);

//   if (isLoading) {
//     return (
//       <ActionSheetProvider>
//         <LoadingScreen onFinish={() => setIsLoading(false)} />
//       </ActionSheetProvider>
//     );
//   }

//   // ✅ Bottom Tabs for main app
//   function MyTabNavigator() {
//     return (
    
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           header: () => (
//             <Header onLoginPress={() => setIsLoggedIn(false)} /> // logout
//           ),
//           tabBarIcon: ({ focused, color, size }) => {
//             let iconName;

//             if (route.name === "Home") iconName = focused ? "home" : "home-outline";
//             else if (route.name === "Diagnose")
//               iconName = focused ? "medkit" : "medkit-outline";
//             else if (route.name === "Treatment")
//               iconName = focused ? "heart" : "heart-outline";
//             else if (route.name === "Weather")
//               iconName = focused ? "cloud" : "cloud-outline";
//             else if (route.name === "Logbook")
//               iconName = focused ? "person" : "person-outline";

//             return <Ionicons name={iconName} size={size} color={color} />;
//           },
//           tabBarActiveTintColor: "tomato",
//           tabBarInactiveTintColor: "gray",
//         })}
//       >
//         <Tab.Screen name="Home" component={Home} />
//         <Tab.Screen name="Diagnose" component={DiagnosePage} />
//         <Tab.Screen name="Treatment" component={Treatment} />
//         <Tab.Screen name="Weather" component={Weather} />
//         <Tab.Screen name="Logbook" component={Logbook} />
//       </Tab.Navigator>
//     );
//   }

//   return (
//       <ActionSheetProvider>
//         <NavigationContainer>
//           {!isLoggedIn ? (
//             <Stack.Navigator screenOptions={{ headerShown: false }}>
//               <Stack.Screen name="Login">
//                 {(props) => (
//                   <Login {...props} onLogin={() => setIsLoggedIn(true)} />
//                 )}
//               </Stack.Screen>
//               <Stack.Screen name="Register" component={Register} />
//             </Stack.Navigator>
//           ) : (
//             <MyTabNavigator /> // ✅ Directly load Home Tabs after login
//           )}
//         </NavigationContainer>
//       </ActionSheetProvider>
//   );
// }























import React, { useState, useEffect } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { storage } from "./src/storage"; // Import custom storage
import DiagnosePage from "./src/Diagnose_page";
import Home from "./src/Home";
import Treatment from "./src/Treatment";
import Header from "./src/header";
import Weather from "./src/weather";
import Logbook from "./src/logbook";
import LoadingScreen from "./src/loading_page";
import Login from "./src/login";
import Register from "./src/register";
import Profile from "./src/profile";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await storage.getItem("userToken");
      const user = await storage.getItem("userData");
      
      if (token && user) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(user));
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (userData, token) => {
    try {
      await storage.setItem("userToken", token);
      await storage.setItem("userData", JSON.stringify(userData));
      setUserData(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error saving login data:", error);
      // Still login even if storage fails
      setUserData(userData);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    try {
      await storage.removeItem("userToken");
      await storage.removeItem("userData");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUserData(null);
      setIsLoggedIn(false);
    }
  };

  const handleProfile = () => {
    console.log("Navigate to profile");
  };

  if (isLoading) {
    return (
      <ActionSheetProvider>
        <LoadingScreen onFinish={() => setIsLoading(false)} />
      </ActionSheetProvider>
    );
  }

  function MyTabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => (
            <Header 
              onLoginPress={() => {}}
              onProfilePress={handleProfile}
              onLogout={handleLogout}
              isLoggedIn={isLoggedIn}
              userData={userData}
            />
          ),
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") iconName = focused ? "home" : "home-outline";
            else if (route.name === "Diagnose") iconName = focused ? "medkit" : "medkit-outline";
            else if (route.name === "Treatment") iconName = focused ? "heart" : "heart-outline";
            else if (route.name === "Weather") iconName = focused ? "cloud" : "cloud-outline";
            else if (route.name === "Logbook") iconName = focused ? "book" : "book-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4caf50",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Diagnose" component={DiagnosePage} />
        <Tab.Screen name="Treatment" component={Treatment} />
        <Tab.Screen name="Weather" component={Weather} />
        <Tab.Screen name="Logbook" component={Logbook} />
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
                <Login {...props} onLogin={handleLogin} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MyTabNavigator} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </ActionSheetProvider>
  );
}



