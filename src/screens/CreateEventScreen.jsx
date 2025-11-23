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
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import { eventService } from "../services/eventService";

export default function CreateEventScreen({ user, goBack }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  // FORM STATES
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [dateTime, setDateTime] = useState(new Date());

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // DATE PICKER
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirm = (date) => {
    setDateTime(date);
    hideDatePicker();
  };

  // VALIDATIONS
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

  // SUBMIT
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
      Alert.alert("Éxito", "Evento creado correctamente.");
      goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo crear el evento.");
    } finally {
      setSubmitting(false);
    }
  };

  // FORMAT DATE
  const formattedDate = dateTime.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const formattedTime = dateTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // INPUT COMPONENT
  const InputField = ({ label, ...props }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: "#cbd5e1", fontSize: 14, marginBottom: 6 }}>
        {label}
      </Text>

      <TextInput
        {...props}
        placeholderTextColor="#64748b"
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          borderWidth: 1,
          borderColor: props.error ? "#ef4444" : "rgba(255,255,255,0.12)",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 16,
          color: "white",
        }}
      />

      {props.error && (
        <Text style={{ color: "#ef4444", fontSize: 13, marginTop: 6 }}>
          {props.error}
        </Text>
      )}
    </View>
  );

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {/* CLOSE BUTTON */}
      <TouchableOpacity
        onPress={goBack}
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          zIndex: 20,
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: 10,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Ionicons name="close" size={22} color="#e5e7eb" />
      </TouchableOpacity>

      {/* FORM */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          paddingBottom: 6,  
          justifyContent: "center",   
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, justifyContent: "center", marginTop: 40 }}>

        <GlassCard
          style={{
            paddingVertical: 32,
            paddingHorizontal: 22,
            backgroundColor: "rgba(15,16,22,0.5)",
            borderRadius: 28,
            borderColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "800",
              marginBottom: 26,
            }}
          >
            Crear Evento
          </Text>

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
            label="Máximo de participantes"
            value={maxParticipants}
            onChangeText={(t) => setMaxParticipants(t.replace(/[^0-9]/g, ""))}
            placeholder="Ej. 50"
            error={errors.maxParticipants}
          />

          {/* DATE SELECTOR */}
          <View style={{ marginBottom: 26 }}>
            <Text style={{ color: "#cbd5e1", marginBottom: 8, fontSize: 14 }}>
              Fecha y hora del evento
            </Text>

            <TouchableOpacity
              onPress={showDatePicker}
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.12)",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color="#e5e7eb"
                  style={{ marginRight: 12 }}
                />

                <View>
                  <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                    Selecciona fecha y hora
                  </Text>
                  <Text
                    style={{
                      color: "#f8fafc",
                      marginTop: 2,
                      fontSize: 17,
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
                color="#94a3b8"
              />
            </TouchableOpacity>

            {/* DATE PICKER MODAL */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              date={dateTime}
              minimumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              themeVariant="dark"
              locale="es_ES"
            />
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity disabled={submitting} onPress={handleCreateEvent}>
            <LinearGradient
              colors={["#06f7ff", "#7c3aed"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 16,
                borderRadius: 20,
                alignItems: "center",
                shadowColor: "#06f7ff55",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
              }}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
                  Crear evento
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </GlassCard>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </Animated.View>
  );
}
