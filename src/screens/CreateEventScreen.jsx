// /src/screens/CreateEventScreen.jsx
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Animated,
} from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LinearGradient } from "expo-linear-gradient";
import GlassCard from "../components/GlassCard";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";
import { eventService } from "../services/eventService";

// ✔ COMPONENTE INPUT
function InputField({ label, value, onChangeText, placeholder, error }) {
  return (
    <View style={{ marginBottom: 22 }}>
      <Text
        style={{
          color: "#cbd5e1",
          marginBottom: 6,
          fontSize: 14,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 14,
          color: "white",
          borderWidth: 1,
          borderColor: error ? "#ef4444" : "rgba(255,255,255,0.12)",
          fontSize: 16,
        }}
      />

      {error && (
        <Text style={{ color: "#ef4444", marginTop: 4, fontSize: 13 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

export default function CreateEventScreen({ user, goBack }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [dateTime, setDateTime] = useState(new Date());

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date) => {
    setDateTime(date);
    hideDatePicker();
  };

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "El título es obligatorio";
    if (!description.trim()) e.description = "La descripción es obligatoria";
    if (!location.trim()) e.location = "La ubicación es obligatoria";
    if (!maxParticipants.trim() || Number(maxParticipants) <= 0)
      e.maxParticipants = "Debe ser un número válido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateEvent = async () => {
    if (!validate()) {
      Alert.alert("Formulario incompleto", "Revisa los campos marcados.");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "Usuario no válido.");
      return;
    }

    setSubmitting(true);

    const payload = {
      title,
      description,
      location,
      date: dateTime.toISOString(),
      max_participants: Number(maxParticipants),
      organizer_id: user.id,
    };

    try {
      await eventService.createEvent(payload);
      Alert.alert("Éxito", "El evento fue creado correctamente.");
      goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo crear el evento.");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = dateTime.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {/* BOTÓN CERRAR */}
      <TouchableOpacity
        onPress={goBack}
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          zIndex: 20,
          backgroundColor: "rgba(20,20,25,0.6)",
          padding: 10,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)",
        }}
      >
        <Ionicons name="close" size={22} color="#e5e7eb" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <GlassCard
          style={{
            paddingVertical: 30,
            paddingHorizontal: 22,
            backgroundColor: "rgba(15,16,22,0.50)",
            borderRadius: 26,
            borderColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
          }}
        >
          {/* HEADER */}
          <Text
            style={{
              color: "#f1f5f9",
              fontSize: 28,
              fontWeight: "800",
              marginBottom: 25,
            }}
          >
            Crear evento
          </Text>

          {/* INPUTS */}
          <InputField
            label="Título"
            value={title}
            onChangeText={setTitle}
            placeholder="Nombre del evento"
            error={errors.title}
          />

          <InputField
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe brevemente el evento"
            error={errors.description}
          />

          <InputField
            label="Ubicación"
            value={location}
            onChangeText={setLocation}
            placeholder="Dirección o lugar"
            error={errors.location}
          />

          <InputField
            label="Máximo participantes"
            value={maxParticipants}
            onChangeText={(t) => setMaxParticipants(t.replace(/[^0-9]/g, ""))}
            placeholder="Ej. 50"
            error={errors.maxParticipants}
          />

          {/* FECHA Y HORA */}
          <View style={{ marginBottom: 26 }}>
            <Text
              style={{
                color: "#cbd5e1",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Fecha y hora del evento
            </Text>

            <TouchableOpacity
              onPress={showDatePicker}
              activeOpacity={0.7}
              style={{
                backgroundColor: "rgba(0,0,0,0.45)",
                borderRadius: 16,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
                shadowColor: "#000",
                shadowOpacity: 0.4,
                shadowRadius: 12,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color="#e5e7eb"
                  style={{ marginRight: 14 }}
                />
                <View>
                  <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                    Seleccionar fecha y hora
                  </Text>
                  <Text
                    style={{
                      color: "#f8fafc",
                      fontSize: 17,
                      marginTop: 2,
                      fontWeight: "600",
                    }}
                  >
                    {formattedDate} — {formattedTime}
                  </Text>
                </View>
              </View>

              <Ionicons
                name="chevron-down-outline"
                size={20}
                color="#94a3af"
              />
            </TouchableOpacity>

            {/* MODAL */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              date={dateTime}
              minimumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              themeVariant="dark"
              isDarkModeEnabled={true}
              locale="es_ES"
              confirmTextIOS="Confirmar"
              cancelTextIOS="Cancelar"
            />
          </View>

          {/* BOTÓN CREAR */}
          <TouchableOpacity disabled={submitting} onPress={handleCreateEvent}>
            <LinearGradient
              colors={["#2563eb", "#7c3aed"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 14,
                borderRadius: 18,
                alignItems: "center",
              }}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  Crear evento
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </GlassCard>

        <View style={{ height: 120 }} />
      </ScrollView>
    </Animated.View>
  );
}
