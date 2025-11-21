import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { authService } from '../services/authService';
import { useFacebookAuth, verifyFacebookToken } from '../services/facebookAuth';
import GlassCard from '../components/GlassCard';
import styles from '../styles/authStyles';

// Necesario para OAuth en Expo
WebBrowser.maybeCompleteAuthSession();

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // Configuración para Google OAuth
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    webClientId: '927898196412-djt7f0b3j0gpqebvc42vvbp139qg5d4j.apps.googleusercontent.com',
    androidClientId: 'TU_GOOGLE_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'TU_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
  });

  // Configuración para Facebook OAuth
  const { request: facebookRequest, response: facebookResponse, promptAsync: facebookPromptAsync } = useFacebookAuth();

  // Manejar respuesta de Google
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleGoogleSignIn(googleResponse.authentication.accessToken);
    } else if (googleResponse?.type === 'error') {
      console.log('❌ Google Auth Error:', googleResponse.error);
      Alert.alert('Error', 'No se pudo completar el inicio de sesión con Google');
      setGoogleLoading(false);
    }
  }, [googleResponse]);

  // Manejar respuesta de Facebook
  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      handleFacebookSignIn(facebookResponse.authentication.accessToken);
    } else if (facebookResponse?.type === 'error') {
      console.log('❌ Facebook Auth Error:', facebookResponse.error);
      Alert.alert('Error', 'No se pudo completar el inicio de sesión con Facebook');
      setFacebookLoading(false);
    }
  }, [facebookResponse]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es obligatorio';
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'El email es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El email no es válido';
      }

      if (!formData.full_name.trim()) {
        newErrors.full_name = 'El nombre completo es obligatorio';
      }

      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else {
      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // Login con username y password
        const credentials = {
          username: formData.username,
          password: formData.password
        };
        console.log('🔐 Attempting login with:', credentials);
        const result = await authService.login(credentials);
        Alert.alert('✅ Éxito', 'Inicio de sesión exitoso');
        console.log('Login result:', result);
        
        if (result.access_token) {
          console.log('Token recibido:', result.access_token);
        }
      } else {
        // Registro
        const userData = {
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password
        };
        console.log('👤 Attempting registration with:', userData);
        const result = await authService.register(userData);
        Alert.alert('✅ Éxito', 'Usuario registrado correctamente');
        console.log('Register result:', result);
        
        setIsLogin(true);
        resetForm();
      }
    } catch (error) {
      console.log('💥 Error completo:', error);
      Alert.alert('❌ Error', error.message || 'Ha ocurrido un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (accessToken) => {
    setGoogleLoading(true);
    try {
      console.log('🔐 Google access token:', accessToken);
      
      // Enviar token a tu backend según la API especificada
      const result = await authService.loginWithGoogle(
        accessToken, 
        'participant',  // role por defecto
        'mobile'        // platform
      );
      
      Alert.alert('✅ Éxito', 'Inicio de sesión con Google exitoso');
      console.log('Google login result:', result);
      
      if (result.access_token) {
        console.log('Token del backend:', result.access_token);
      }
    } catch (error) {
      console.log('💥 Google sign in error:', error);
      Alert.alert('❌ Error', error.message || 'Error con Google Sign-In');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookSignIn = async (accessToken) => {
    setFacebookLoading(true);
    try {
      console.log('🔐 Facebook access token:', accessToken);
      
      // Enviar token a tu backend según la API especificada
      const result = await authService.loginWithFacebook(
        accessToken, 
        'participant'  // role por defecto
      );
      
      Alert.alert('✅ Éxito', 'Inicio de sesión con Facebook exitoso');
      console.log('Facebook login result:', result);
      
      if (result.access_token) {
        console.log('Token del backend:', result.access_token);
      }
    } catch (error) {
      console.log('💥 Facebook sign in error:', error);
      Alert.alert('❌ Error', error.message || 'Error con Facebook Sign-In');
    } finally {
      setFacebookLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      full_name: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const renderInput = (placeholder, field, icon, options = {}) => (
    <View>
      <View style={[
        styles.inputContainer, 
        errors[field] && styles.inputError
      ]}>
        <Ionicons name={icon} size={20} color="#94a3b8" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          autoCapitalize={options.autoCapitalize || 'none'}
          keyboardType={options.keyboardType || 'default'}
          secureTextEntry={options.secureTextEntry || false}
          editable={!isLoading}
        />
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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

          <GlassCard>
            {/* Toggle Login/Registro */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleButton, isLogin && styles.toggleActive]}
                onPress={() => !isLogin && toggleAuthMode()}
                disabled={isLoading}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, !isLogin && styles.toggleActive]}
                onPress={() => isLogin && toggleAuthMode()}
                disabled={isLoading}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              {/* Username - siempre visible */}
              {renderInput('Usuario', 'username', 'person-outline')}

              {/* Email y Full Name - solo en registro */}
              {!isLogin && (
                <>
                  {renderInput('Email', 'email', 'mail-outline', { 
                    keyboardType: 'email-address' 
                  })}
                  
                  {renderInput('Nombre completo', 'full_name', 'person-circle-outline', {
                    autoCapitalize: 'words'
                  })}
                </>
              )}

              {/* Password */}
              {renderInput('Contraseña', 'password', 'lock-closed-outline', {
                secureTextEntry: true
              })}

              {/* Confirm Password - solo en registro */}
              {!isLogin && renderInput('Confirmar Contraseña', 'confirmPassword', 'lock-closed-outline', {
                secureTextEntry: true
              })}

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
                style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
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
                    <ActivityIndicator size="small" color="white" />
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

              {/* Botones Sociales */}
              <View style={styles.socialButtons}>
                {/* Botón Google */}
                <TouchableOpacity 
                  style={[styles.socialButton, googleLoading && styles.primaryButtonDisabled]}
                  onPress={() => {
                    setGoogleLoading(true);
                    googlePromptAsync();
                  }}
                  disabled={googleLoading || !googleRequest}
                >
                  {googleLoading ? (
                    <ActivityIndicator size="small" color="#06b6d4" />
                  ) : (
                    <>
                      <Ionicons name="logo-google" size={20} color="#06b6d4" />
                      <Text style={styles.socialButtonText}>Google</Text>
                    </>
                  )}
                </TouchableOpacity>
                
                {/* Botón Facebook */}
                <TouchableOpacity 
                  style={[styles.socialButton, facebookLoading && styles.primaryButtonDisabled]}
                  onPress={() => {
                    setFacebookLoading(true);
                    facebookPromptAsync();
                  }}
                  disabled={facebookLoading || !facebookRequest}
                >
                  {facebookLoading ? (
                    <ActivityIndicator size="small" color="#06b6d4" />
                  ) : (
                    <>
                      <Ionicons name="logo-facebook" size={20} color="#06b6d4" />
                      <Text style={styles.socialButtonText}>Facebook</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                </Text>
                <TouchableOpacity onPress={toggleAuthMode} disabled={isLoading}>
                  <Text style={styles.footerLink}>
                    {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;