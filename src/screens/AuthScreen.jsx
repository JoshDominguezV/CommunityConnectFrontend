import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { authService } from "../services/authService";
import { useGoogleAuth } from "../services/googleAuth";
import GlassCard from "../components/GlassCard";
import styles from "../styles/authStyles";
import api from "../services/api";  

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const { request, response, promptAsync } = useGoogleAuth();

  useEffect(() => {
    if (response?.type === "success") {
      const token = response.authentication?.accessToken;
      if (token) handleGoogleSignIn(token);
    }
  }, [response]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // VALIDACIONES
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "El usuario es obligatorio";
    }

    if (!isLogin) {
      if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "El email no es válido";

      if (!formData.full_name.trim())
        newErrors.full_name = "El nombre completo es obligatorio";

      if (!formData.password)
        newErrors.password = "La contraseña es obligatoria";
      else if (formData.password.length < 6)
        newErrors.password = "Debe tener al menos 6 caracteres";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirma tu contraseña";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // LOGIN / REGISTER
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Corrige los errores antes de continuar");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // LOGIN
        const response = await authService.login({
          username: formData.username,
          password: formData.password,
        });

        // Obtener información completa del usuario
        const userDetails = await api.get(`/auth/users/${response.user_id}`);

        // Guardar datos completos en App.jsx
        onLogin({
          id: response.user_id,
          username: userDetails.data.username,
          email: userDetails.data.email,
          full_name: userDetails.data.full_name,
          role: userDetails.data.role,
          access_token: response.access_token,
        });

      } else {
        // REGISTRO
        await authService.register({
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password,
        });

        Alert.alert("Éxito", "Usuario registrado correctamente");
        setIsLogin(true);
        resetForm();
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Error inesperado");
    }

    setIsLoading(false);
  };

  // LOGIN GOOGLE
  const handleGoogleSignIn = async (accessToken) => {
    setGoogleLoading(true);

    try {
      const result = await authService.loginWithGoogle(
        accessToken,
        "participant",
        "mobile"
      );

      onLogin({
        id: result.user_id || Date.now(),
        username: result.username || "google_user",
        email: result.email,
        full_name: result.full_name || "Usuario Google",
        access_token: result.access_token,
        role: result.role,
        is_google_user: true,
      });
    } catch (error) {
      Alert.alert("Error Google", error.message);
    }

    setGoogleLoading(false);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      full_name: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const renderInput = (placeholder, field, icon, options = {}) => (
    <View>
      <View style={[styles.inputContainer, errors[field] && styles.inputError]}>
        <Ionicons name={icon} size={20} color="#94a3b8" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          secureTextEntry={options.secureTextEntry}
          autoCapitalize={options.autoCapitalize || "none"}
          keyboardType={options.keyboardType}
        />
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>

          {/* LOGO */}
          <View style={styles.logoContainer}>
            <Ionicons name="people-circle" size={80} color="#06b6d4" />
            <Text style={styles.title}>CommunityConnect</Text>

            <Text style={styles.subtitle}>
              {isLogin ? "Bienvenido de vuelta" : "Únete a la comunidad"}
            </Text>
          </View>

          <GlassCard>

            {/* TOGGLE */}
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

            {/* FORMULARIO */}
            <View style={styles.form}>
              {renderInput("Usuario", "username", "person-outline")}

              {!isLogin && (
                <>
                  {renderInput("Email", "email", "mail-outline", { keyboardType: "email-address" })}
                  {renderInput("Nombre Completo", "full_name", "person-circle-outline", {
                    autoCapitalize: "words",
                  })}
                </>
              )}

              {renderInput("Contraseña", "password", "lock-closed-outline", { secureTextEntry: true })}

              {!isLogin &&
                renderInput("Confirmar Contraseña", "confirmPassword", "lock-closed-outline", {
                  secureTextEntry: true,
                })}

              {/* BOTÓN PRINCIPAL */}
              <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                <LinearGradient colors={["#06b6d4", "#7e22ce"]} style={styles.buttonGradient}>
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* DIVIDER */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o continuar con</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* GOOGLE */}
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => promptAsync()}
                disabled={!request || googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator color="#06b6d4" />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={20} color="#06b6d4" />
                    <Text style={styles.socialButtonText}>Continuar con Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* FOOTER */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                </Text>

                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                  <Text style={styles.footerLink}>
                    {isLogin ? "Regístrate" : "Inicia Sesión"}
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
