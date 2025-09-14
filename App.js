import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Tela de carregamento com tema rosa
const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <View style={styles.splashContent}>
      <Text style={styles.rocketEmoji}>🚀</Text>
      <Text style={styles.appName}>NASA App</Text>
      <Text style={styles.appSubtitle}>Explorando o Cosmos</Text>
      <ActivityIndicator size="large" color="#FF69B4" style={styles.loader} />
      <Text style={styles.loadingText}>Preparando sua jornada espacial...</Text>
    </View>
  </View>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento por 2.5 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <SplashScreen />
        <StatusBar style="dark" />
      </>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFB6C1',
  },
  splashContent: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  rocketEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 10,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
