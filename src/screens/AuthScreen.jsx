// /src/screens/AuthScreen.jsx
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
import GlassCard from "../components/GlassCard";
import styles from "../styles/authStyles";

import { authService } from "../services/authService";
import { useGoogleAuth } from "../services/googleAuth";
import api from "../services/api";

// ================================
// 🔵 OBTENER PERFIL GOOGLE
// ================================
const getGoogleUserInfo = async (accessToken) => {
  try {
    const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return await res.json();
  } catch (error) {
    console.log("❌ Error obteniendo info Google:", error);
    return null;
  }
};

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

  // ================================
  // 🔄 Google Auth Response
  // ================================
  useEffect(() => {
    if (response?.type === "success") {
      const token = response.authentication?.accessToken;
      if (token) handleGoogleSignIn(token);
    }
  }, [response]);

  // ================================
  // 🔵 LOGIN GOOGLE (CORREGIDO)
  // ================================
  const handleGoogleSignIn = async (accessToken) => {
    setGoogleLoading(true);
    try {
      // 1️⃣ OBTENER PERFIL REAL GOOGLE
      const googleUser = await getGoogleUserInfo(accessToken);

      if (!googleUser) {
        throw new Error("No se pudo obtener la información de Google.");
      }

      // 2️⃣ ENVIAR TOKEN A BACKEND
      const backendData = await authService.loginWithGoogle(
        accessToken,
        "participant",
        "mobile"
      );

      // 3️⃣ LOGIN FINAL EN LA APP
      onLogin({
        id: backendData.user_id,
        username: googleUser.given_name || backendData.username || "Usuario",
        email: googleUser.email,
        full_name: googleUser.name || "Usuario Google",
        avatar: googleUser.picture || null,
        role: backendData.role,
        access_token: backendData.access_token,
        is_google_user: true,
      });
    } catch (err) {
      Alert.alert("Error Google", err.message);
    }

    setGoogleLoading(false);
  };

  // ================================
  // 🔄 MANEJO DE INPUTS
  // ================================
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ================================
  // ✔ VALIDACIONES
  // ================================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "El usuario es obligatorio";

    if (!isLogin) {
      if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email inválido";

      if (!formData.full_name.trim())
        newErrors.full_name = "El nombre es obligatorio";

      if (!formData.password) newErrors.password = "La contraseña es obligatoria";
      else if (formData.password.length < 6)
        newErrors.password = "Mínimo 6 caracteres";

      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================================
  // 🔑 LOGIN / REGISTER
  // ================================
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Corrige los errores.");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await authService.login({
          username: formData.username,
          password: formData.password,
        });

        // obtener datos completos
        const details = await api.get(`/auth/users/${response.user_id}`);

        onLogin({
          id: response.user_id,
          username: details.data.username,
          email: details.data.email,
          full_name: details.data.full_name,
          role: details.data.role,
          access_token: response.access_token,
        });
      } else {
        await authService.register(formData);
        Alert.alert("Éxito", "Usuario creado.");
        setIsLogin(true);
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }

    setIsLoading(false);
  };

  // ================================
  // UI
  // ================================
  const renderInput = (placeholder, field, icon, options = {}) => (
    <View>
      <View style={[styles.inputContainer, errors[field] && styles.inputError]}>
        <Ionicons name={icon} size={20} color="#94a3b8" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={formData[field]}
          onChangeText={(v) => handleInputChange(field, v)}
          secureTextEntry={options.secureTextEntry}
          keyboardType={options.keyboardType}
          autoCapitalize={options.autoCapitalize || "none"}
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

          <View style={styles.logoContainer}>
            <Ionicons name="people-circle" size={80} color="#06b6d4" />
            <Text style={styles.title}>CommunityConnect</Text>
            <Text style={styles.subtitle}>
              {isLogin ? "Bienvenido de vuelta" : "Únete a la comunidad"}
            </Text>
          </View>

          <GlassCard>

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

            <View style={styles.form}>
              {renderInput("Usuario", "username", "person-outline")}

              {!isLogin && (
                <>
                  {renderInput("Email", "email", "mail-outline")}
                  {renderInput("Nombre Completo", "full_name", "person-circle-outline", {
                    autoCapitalize: "words",
                  })}
                </>
              )}

              {renderInput("Contraseña", "password", "lock-closed-outline", {
                secureTextEntry: true,
              })}

              {!isLogin &&
                renderInput("Confirmar Contraseña", "confirmPassword", "lock-closed-outline", {
                  secureTextEntry: true,
                })}

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

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o continuar con</Text>
                <View style={styles.dividerLine} />
              </View>

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

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
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
