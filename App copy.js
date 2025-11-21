import React from 'react';
import { 
  View, 
  StatusBar,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingParticles from './src/components/FloatingParticles';
import AuthScreen from './src/screens/AuthScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#7e22ce']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Partículas flotantes */}
      <FloatingParticles />

      {/* Pantalla de autenticación */}
      <AuthScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});