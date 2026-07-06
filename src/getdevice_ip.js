// getDeviceIP.js
import { Platform } from "react-native";
import * as Network from "expo-network";

export const getDeviceIP = async () => {
  try {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      // For mobile devices, get the IP address
      const ipAddress = await Network.getIpAddressAsync();
      console.log("📱 Device IP from network:", ipAddress);
      return ipAddress;
    } else {
      // For web, we need a different approach
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log("🌐 Device public IP:", data.ip);
        return data.ip;
      } catch (error) {
        console.error("Error getting public IP:", error);
        return null;
      }
    }
  } catch (error) {
    console.error("Error getting device IP:", error);
    return null;
  }
};

// Alternative: Get public IP using a service (more reliable)
export const getPublicIP = async () => {
  try {
    // Try multiple IP services for redundancy
    const services = [
      'https://api.ipify.org?format=json',
      'https://api.myip.com',
      'https://ipapi.co/json/'
    ];
    
    for (const service of services) {
      try {
        const response = await fetch(service);
        const data = await response.json();
        
        // Extract IP from different response formats
        if (data.ip) return data.ip;
        if (data.address) return data.address; // for myip.com
        if (data.ip_address) return data.ip_address; // for some services
        
      } catch (e) {
        console.log(`Service ${service} failed, trying next...`);
      }
    }
    
    return null;
  } catch (error) {
    console.error("All IP services failed:", error);
    return null;
  }
};