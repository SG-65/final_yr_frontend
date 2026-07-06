// storage.js - Custom storage wrapper with fallback
import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback storage
let memoryStorage = {};

export const storage = {
  async getItem(key) {
    try {
      // Try AsyncStorage first
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.warn('AsyncStorage getItem failed, using memory storage');
      // Fallback to memory storage
      return memoryStorage[key] || null;
    }
  },
  
  async setItem(key, value) {
    try {
      // Try AsyncStorage first
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn('AsyncStorage setItem failed, using memory storage');
      // Fallback to memory storage
      memoryStorage[key] = value;
    }
  },
  
  async removeItem(key) {
    try {
      // Try AsyncStorage first
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn('AsyncStorage removeItem failed, using memory storage');
      // Fallback to memory storage
      delete memoryStorage[key];
    }
  },
  
  async clear() {
    try {
      // Try AsyncStorage first
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('AsyncStorage clear failed, using memory storage');
      // Fallback to memory storage
      memoryStorage = {};
    }
  },
  
  // Check if storage is available
  isAvailable() {
    try {
      return !!AsyncStorage;
    } catch {
      return false;
    }
  }
};