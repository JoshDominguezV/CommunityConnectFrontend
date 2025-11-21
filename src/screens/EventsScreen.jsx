// /src/screens/CreateEventScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";

import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

import { LinearGradient } from "expo-linear-gradient";
import GlassCard from "../components/GlassCard";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";
import { eventService } from "../services/eventService";

const CreateEventScreen = ({ navigation, route }) => {
  // usuario
  const user = route?.params?.user;

  // states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const [dateTime, setDateTime] = useState(dayjs());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // validaciones simples
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
      ...(category.trim() && { category }),
    };

    try {
      await eventService.createEvent(payload);

      Alert.alert("Éxito", "El evento fue creado correctamente.");
      navigation.goBack();
    } catch (err) {
      console.log("Create event error:", err);
      Alert.alert("Error", err.message || "No se pudo crear el evento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <GlassCard style={{ paddingBottom: 30 }}>
        <Text style={{ color: "#e6f7ff", fontSize: 24, fontWeight: "800", marginBottom: 10 }}>
          Crear Evento
        </Text>

        {/* Título */}
        <View style={{ marginBottom: 14 }}>
          <Text style={styles.inputLabel}>Título</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Nombre del evento"
            placeholderTextColor="#94a3b8"
            style={[
              styles.input,
              errors.title ? styles.inputError : {},
            ]}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Descripción */}
        <View style={{ marginBottom: 14 }}>
          <Text style={styles.inputLabel}>Descripción</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe el evento"
            placeholderTextColor="#94a3b8"
            multiline
            style={[
              styles.input,
              { height: 100, textAlignVertical: "top" },
              errors.description ? styles.inputError : {},
            ]}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Ubicación */}
        <View style={{ marginBottom: 14 }}>
          <Text style={styles.inputLabel}>Ubicación</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Dirección o lugar"
            placeholderTextColor="#94a3b8"
            style={[
              styles.input,
              errors.location ? styles.inputError : {},
            ]}
          />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        {/* Categoría (opcional) */}
        <View style={{ marginBottom: 14 }}>
          <Text style={styles.inputLabel}>Categoría (opcional)</Text>
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="Ej. música, tecnología..."
            placeholderTextColor="#94a3b8"
            style={styles.input}
          />
        </View>

        {/* Máximo participantes */}
        <View style={{ marginBottom: 14 }}>
          <Text style={styles.inputLabel}>Máximo participantes</Text>
          <TextInput
            value={maxParticipants}
            onChangeText={(t) => setMaxParticipants(t.replace(/[^0-9]/g, ""))}
            placeholder="Ej. 100"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            style={[
              styles.input,
              errors.maxParticipants ? styles.inputError : {},
            ]}
          />
          {errors.maxParticipants && <Text style={styles.errorText}>{errors.maxParticipants}</Text>}
        </View>

        {/* Fecha + Hora (componente universal) */}
        <View style={{ marginBottom: 14 }}>
          <Text style={styles.inputLabel}>Fecha y Hora</Text>

          <DatePicker
            mode="datetime"
            date={dateTime}
            onChange={(d) => setDateTime(d.date)}
            minDate={dayjs()}
            textColor="white"
            selectedItemColor="#06b6d4"
            headerButtonColor="#06b6d4"
            todayTextColor="#7c3aed"
          />
        </View>

        {/* Botón */}
        <TouchableOpacity disabled={submitting} onPress={handleCreateEvent}>
          <LinearGradient
            colors={["#06b6d4", "#7c3aed"]}
            style={styles.submitButton}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Crear Evento</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </GlassCard>

      <View style={{ height: 160 }} />
    </ScrollView>
  );
};

export default CreateEventScreen;
