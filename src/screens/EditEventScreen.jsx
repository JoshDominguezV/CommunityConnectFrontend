// /src/screens/EditEventScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LinearGradient } from "expo-linear-gradient";
import GlassCard from "../components/GlassCard";
import { eventService } from "../services/eventService";

export default function EditEventScreen({ event, user, onClose, onUpdated }) {
  const isOrganizer = user?.id === event.organizer_id;
  const hasPassed = new Date(event.date) < new Date();

  // 🔒 Restricción: solo organizador y evento no pasado
  if (!isOrganizer || hasPassed) {
    return (
      <View
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "700", textAlign: "center" }}>
          {hasPassed
            ? "No puedes editar un evento que ya pasó."
            : "No tienes permisos para editar este evento."}
        </Text>

        <TouchableOpacity
          onPress={onClose}
          style={{
            marginTop: 20,
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white" }}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // FORM STATES
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [maxParticipants, setMaxParticipants] = useState(
    String(event.max_participants)
  );
  const [dateTime, setDateTime] = useState(new Date(event.date));

  const [submitting, setSubmitting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirmDate = (d) => {
    setDateTime(d);
    setShowPicker(false);
  };

  const validate = () => {
    if (!title.trim()) return "El título es obligatorio";
    if (!description.trim()) return "La descripción es obligatoria";
    if (!location.trim()) return "La ubicación es obligatoria";
    if (!maxParticipants.trim() || Number(maxParticipants) <= 0)
      return "Número de participantes inválido";
    return null;
  };

  const saveChanges = async () => {
    const err = validate();
    if (err) return Alert.alert("Error", err);

    setSubmitting(true);

    try {
      await eventService.updateEvent(event.id, {
        title,
        description,
        location,
        date: dateTime.toISOString(),
        max_participants: Number(maxParticipants),
      });

      Alert.alert("Éxito", "Evento editado correctamente.");
      onUpdated?.();
      onClose();
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo editar el evento.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEvent = () => {
    Alert.alert(
      "Eliminar Evento",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eventService.deleteEvent(event.id);
              Alert.alert("Eliminado", "El evento fue eliminado.");
              onUpdated?.();
              onClose();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el evento.");
            }
          },
        },
      ]
    );
  };

  const formattedDate = dateTime.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(7,10,25,0.96)",
        padding: 24,
      }}
    >
      {/* CLOSE BUTTON */}
      <TouchableOpacity
        onPress={onClose}
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          zIndex: 50,
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: 999,
          padding: 10,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)",
        }}
      >
        <Ionicons name="close" size={22} color="#e5e7eb" />
      </TouchableOpacity>

      {/* FORM */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <GlassCard
          style={{
            padding: 28,
            marginTop: 40,
            backgroundColor: "rgba(15,16,22,0.6)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            borderRadius: 26,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "800",
              marginBottom: 20,
            }}
          >
            Editar evento
          </Text>

          {/* INPUTS */}
          <Input label="Título" value={title} onChange={setTitle} />
          <Input label="Descripción" value={description} onChange={setDescription} />
          <Input label="Ubicación" value={location} onChange={setLocation} />

          <Input
            label="Máximo participantes"
            value={maxParticipants}
            onChange={(t) => setMaxParticipants(t.replace(/[^0-9]/g, ""))}
          />

          {/* FECHA */}
          <Text style={{ color: "#cbd5e1", fontSize: 14, marginBottom: 8 }}>
            Fecha y hora
          </Text>

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
              marginBottom: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                Selecciona fecha y hora
              </Text>
              <Text
                style={{
                  color: "#f8fafc",
                  fontSize: 16,
                  marginTop: 4,
                  fontWeight: "600",
                }}
              >
                {formattedDate} — {formattedTime}
              </Text>
            </View>

            <Ionicons name="calendar-outline" size={22} color="#e5e7eb" />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={showPicker}
            mode="datetime"
            date={dateTime}
            onConfirm={handleConfirmDate}
            onCancel={() => setShowPicker(false)}
            minimumDate={new Date()}
            themeVariant="dark"
          />

          {/* SAVE BUTTON */}
          <TouchableOpacity disabled={submitting} onPress={saveChanges}>
            <LinearGradient
              colors={["#06f7ff", "#7c3aed"]}
              style={{
                paddingVertical: 16,
                borderRadius: 18,
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
                  Guardar cambios
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* DELETE BUTTON */}
          <TouchableOpacity
            onPress={deleteEvent}
            style={{
              backgroundColor: "rgba(255,70,70,0.18)",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,70,70,0.4)",
            }}
          >
            <Text style={{ color: "#ff7a7a", fontWeight: "700" }}>
              Eliminar evento
            </Text>
          </TouchableOpacity>
        </GlassCard>

        <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
}

function Input({ label, value, onChange }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: "#cbd5e1", marginBottom: 6 }}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#64748b"
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          padding: 14,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          color: "white",
          fontSize: 16,
        }}
      />
    </View>
  );
}
