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
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform
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
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // API base URL - cambia esto por tu URL de producción
  const API_BASE_URL = 'http://localhost:8000';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Alert.alert('Error', 'El nombre de usuario es requerido');
      return false;
    }

    if (!isLogin && !formData.email.trim()) {
      Alert.alert('Error', 'El email es requerido');
      return false;
    }

    if (!formData.password) {
      Alert.alert('Error', 'La contraseña es requerida');
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    if (!isLogin && formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          full_name: formData.fullName,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Usuario registrado correctamente');
        // Limpiar formulario después del registro exitoso
        setFormData({
          username: '',
          email: '',
          fullName: '',
          password: '',
          confirmPassword: ''
        });
        // Cambiar a login
        setIsLogin(true);
      } else {
        Alert.alert('Error', data.detail || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Login exitoso');
        // Aquí puedes guardar el token y redirigir al usuario
        console.log('Token:', data.access_token);
        // Limpiar formulario después del login exitoso
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      } else {
        Alert.alert('Error', data.detail || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const clearForm = () => {
    setFormData({
      username: '',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          
          {/* Logo y Título */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="people-circle" size={width * 0.12} color="#06b6d4" />
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
                onPress={() => {
                  setIsLogin(true);
                  clearForm();
                }}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, !isLogin && styles.toggleActive]}
                onPress={() => {
                  setIsLogin(false);
                  clearForm();
                }}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              {/* Username - siempre visible */}
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de usuario"
                  placeholderTextColor="#94a3b8"
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              {/* Email - solo en registro */}
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#94a3b8"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>
              )}

              {/* Full Name - solo en registro */}
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Ionicons name="person-circle-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    placeholderTextColor="#94a3b8"
                    value={formData.fullName}
                    onChangeText={(value) => handleInputChange('fullName', value)}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                </View>
              )}

              {/* Password */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#94a3b8"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              {/* Confirm Password - solo en registro */}
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar Contraseña"
                    placeholderTextColor="#94a3b8"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>
              )}

              {/* Recordar sesión - solo en login */}
              {isLogin && (
                <View style={styles.rememberContainer}>
                  <TouchableOpacity 
                    style={styles.checkbox}
                    onPress={() => setRememberMe(!rememberMe)}
                    disabled={isLoading}
                  >
                    <View style={[styles.checkboxInner, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
                    </View>
                    <Text style={styles.rememberText}>Recordar sesión</Text>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={isLoading}>
                    <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Botón Principal */}
              <TouchableOpacity 
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#06b6d4', '#7e22ce']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <Text style={styles.primaryButtonText}>Cargando...</Text>
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </Text>
                  )}
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
                <TouchableOpacity 
                  style={[styles.socialButton, isLoading && styles.buttonDisabled]}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-google" size={20} color="#06b6d4" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.socialButton, isLoading && styles.buttonDisabled]}
                  disabled={isLoading}
                >
                  <Ionicons name="logo-facebook" size={20} color="#06b6d4" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                </Text>
                <TouchableOpacity 
                  onPress={() => {
                    setIsLogin(!isLogin);
                    clearForm();
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.footerLink}>
                    {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    padding: Math.max(20, width * 0.05),
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Math.max(40, height * 0.05),
  },
  logo: {
    marginBottom: Math.max(15, height * 0.02),
  },
  title: {
    fontSize: Math.max(32, width * 0.08),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.max(16, width * 0.04),
    color: '#94a3b8',
    textAlign: 'center',
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    minWidth: Math.min(350, width * 0.9),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: Math.max(24, width * 0.06),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    fontSize: Math.max(14, width * 0.035),
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
    fontSize: Math.max(16, width * 0.04),
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
    fontSize: Math.max(14, width * 0.035),
  },
  forgotText: {
    color: '#06b6d4',
    fontSize: Math.max(14, width * 0.035),
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
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
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
    fontSize: Math.max(14, width * 0.035),
  },
  socialButtons: {
    flexDirection: width < 400 ? 'column' : 'row',
    gap: 12,
  },
  socialButton: {
    flex: width < 400 ? 0 : 1,
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
    fontSize: Math.max(14, width * 0.035),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: Math.max(14, width * 0.035),
  },
  footerLink: {
    color: '#06b6d4',
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '500',
  },
});