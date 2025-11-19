import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Componente de partículas animadas
const FloatingParticles = () => {
  const particles = [...Array(15)].map((_, i) => {
    const left = new Animated.Value(Math.random() * width);
    const top = new Animated.Value(Math.random() * height);
    
    useEffect(() => {
      const animateParticle = () => {
        Animated.sequence([
          Animated.timing(top, {
            toValue: Math.random() * height,
            duration: 10000 + Math.random() * 5000,
            useNativeDriver: false,
          }),
          Animated.timing(left, {
            toValue: Math.random() * width,
            duration: 10000 + Math.random() * 5000,
            useNativeDriver: false,
          })
        ]).start(() => animateParticle());
      };
      
      const timeout = setTimeout(animateParticle, Math.random() * 5000);
      return () => clearTimeout(timeout);
    }, []);

    return (
      <Animated.View
        key={i}
        style={[
          styles.particle,
          {
            left,
            top,
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            opacity: Math.random() * 0.6 + 0.2,
          }
        ]}
      />
    );
  });

  return <View style={styles.particles}>{particles}</View>;
};

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (isLogin) {
      // Lógica de login
      console.log('Login attempt:', { email, password, rememberMe });
    } else {
      // Lógica de registro
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      console.log('Register attempt:', { email, password });
    }
  };

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

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          
          {/* Logo y Título */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="people-circle" size={50} color="#06b6d4" />
            </View>
            <Text style={styles.title}>CommunityConnect</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Bienvenido de vuelta' : 'Únete a la comunidad'}
            </Text>
          </View>

          {/* Card de Login/Registro */}
          <View style={styles.glassCard}>
            
            {/* Toggle Login/Registro */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleButton, isLogin && styles.toggleActive]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, !isLogin && styles.toggleActive]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar Contraseña"
                    placeholderTextColor="#94a3b8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              )}

              {/* Recordar sesión */}
              {isLogin && (
                <View style={styles.rememberContainer}>
                  <TouchableOpacity 
                    style={styles.checkbox}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View style={[styles.checkboxInner, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
                    </View>
                    <Text style={styles.rememberText}>Recordar sesión</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Botón Principal */}
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleSubmit}
              >
                <LinearGradient
                  colors={['#06b6d4', '#7e22ce']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divisor */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o continuar con</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Botones Social */}
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={20} color="#06b6d4" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={20} color="#06b6d4" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                </Text>
                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                  <Text style={styles.footerLink}>
                    {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
  particles: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 50,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    // Efecto glassmorphism alternativo para React Native
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
    overflow: 'hidden',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
  },
  toggleText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 14,
  },
  toggleTextActive: {
    color: '#06b6d4',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    color: 'white',
    fontSize: 16,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94a3b8',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#06b6d4',
    borderColor: '#06b6d4',
  },
  rememberText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  forgotText: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#94a3b8',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  socialButtonText: {
    color: '#06b6d4',
    fontWeight: '500',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  footerLink: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '500',
  },
});