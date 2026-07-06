// src/LoadingScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function LoadingScreen({ onFinish }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // notify App.js that loading is done
    }, 3000); // 3 seconds for demo
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="bounceIn"
        duration={2000}
        source={require('../assets/logo.jpg')} // your logo
        style={styles.logo}
        resizeMode="contain"
      />
      <Animatable.Text
        animation="fadeInUp"
        delay={1500}
        style={styles.title}
      >
        Leafyfication
      </Animatable.Text>
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 30,
  },
  loader: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4caf50',
    opacity: 0.7,
  },
});
