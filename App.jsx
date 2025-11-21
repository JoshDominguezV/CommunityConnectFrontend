import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import FloatingParticles from './src/components/FloatingParticles';

const USER_DATA_KEY = '@user_data';

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("auth"); // auth | dashboard | create
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Cargar usuario en memoria
  useEffect(() => {
    const loadUser = async () => {
      try {
        const saved = await AsyncStorage.getItem(USER_DATA_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setScreen("dashboard");
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔹 Login
  const handleLogin = async (userData) => {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    setUser(userData);
    setScreen("dashboard");
  };

  // 🔹 Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    setUser(null);
    setScreen("auth");
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0f172a', '#1e1b4b', '#7e22ce']}
          style={styles.background}
        />
        <FloatingParticles />
      </View>
    );
  }

  // 🔥 SISTEMA DE "NAVEGACIÓN" SIN NAVIGATION-CONTAINER
  return (
    <View style={styles.container}>
      {screen === "auth" && (
        <>
          <LinearGradient
            colors={['#0f172a', '#1e1b4b', '#7e22ce']}
            style={styles.background}
          />
          <FloatingParticles />

          <AuthScreen onLogin={handleLogin} />
        </>
      )}

      {screen === "dashboard" && (
        <>
          <LinearGradient
            colors={['#1e293b', '#4f46e5']}
            style={styles.background}
          />
          <FloatingParticles />

          <DashboardScreen
            user={user}
            onLogout={handleLogout}
            onCreateEvent={() => setScreen("create")}
          />
        </>
      )}

      {screen === "create" && (
        <>
          {/* Mismos colores del dashboard */}
          <LinearGradient
            colors={['#1e293b', '#4f46e5']}
            style={styles.background}
          />
          <FloatingParticles />

          <CreateEventScreen
            user={user}
            goBack={() => setScreen("dashboard")}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0,
  }
});
