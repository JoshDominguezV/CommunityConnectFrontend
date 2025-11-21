// App.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';

import FloatingParticles from './src/components/FloatingParticles';

const USER_DATA_KEY = '@user_data';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 👇 Nueva variable para controlar pantallas
  const [currentScreen, setCurrentScreen] = useState("Auth");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_DATA_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          setCurrentScreen("Dashboard");
        }
      } catch (e) {
        console.error("Error loading user:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogin = async (userData) => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setCurrentScreen("Dashboard");
    } catch (e) {
      console.error("Error saving user:", e);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
      setUser(null);
      setIsAuthenticated(false);
      setCurrentScreen("Auth");
    } catch (e) {
      console.error("Error logging out:", e);
    }
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

  // ================================
  // RENDERIZADO DE PANTALLAS
  // ================================
  let Screen = null;

  if (!isAuthenticated) {
    Screen = (
      <AuthScreen 
        onLogin={handleLogin} 
      />
    );
  } else {
    if (currentScreen === "Dashboard") {
      Screen = (
        <DashboardScreen
          user={user}
          onLogout={handleLogout}
          onCreateEvent={() => setCurrentScreen("CreateEvent")}
        />
      );
    }

    if (currentScreen === "CreateEvent") {
      Screen = (
        <CreateEventScreen
          user={user}
          goBack={() => setCurrentScreen("Dashboard")}
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          isAuthenticated
            ? ['#1e293b', '#4f46e5']
            : ['#0f172a', '#1e1b4b', '#7e22ce']
        }
        style={styles.background}
      />

      <FloatingParticles />

      {Screen}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
  },
});
