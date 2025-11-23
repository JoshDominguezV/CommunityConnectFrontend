// /src/screens/EventDetailScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import GlassCard from "../components/GlassCard";
import styles from "../styles/dashboardStyles";

import EditEventScreen from "./EditEventScreen";
import CommentsScreen from "./CommentsScreen";
import EventStatsScreen from "./EventStatsScreen";

import { eventService } from "../services/eventService";
import { scheduleEventReminders } from "../utils/notifications";
import { shareEventSocial, shareEventByEmail } from "../utils/shareUtils";

export default function EventDetailScreen({ event, user, onClose }) {
  const isOrganizer = user?.id === event.organizer_id;

  const eventDate = new Date(event.date);
  const now = new Date();
  const hasPassed = eventDate < now;

  const [loadingAttend, setLoadingAttend] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [commentsMode, setCommentsMode] = useState(false);
  const [showEventStats, setShowEventStats] = useState(false);

  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(true);

  // Cargar asistentes
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const data = await eventService.getEventAttendees(event.id);
        const list = Array.isArray(data) ? data : data?.attendees || [];
        setAttendees(list);
      } catch (err) {
        console.log("❌ Error al cargar asistentes:", err);
      } finally {
        setLoadingAttendees(false);
      }
    };

    fetchAttendees();
  }, [event.id]);

  const formattedDate = eventDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = eventDate.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Confirmar asistencia
  const handleAttend = async () => {
    if (hasPassed) {
      Alert.alert("Evento finalizado", "No puedes registrarte en un evento que ya pasó.");
      return;
    }

    try {
      setLoadingAttend(true);
      await eventService.attendEvent(user.id, event.id);
      Alert.alert("Confirmado", "Tu asistencia fue registrada");

      const updated = await eventService.getEventAttendees(event.id);
      const list = Array.isArray(updated) ? updated : updated?.attendees || [];
      setAttendees(list);

      await scheduleEventReminders(event);
    } catch (err) {
      console.log("❌ Error attend:", err);
      Alert.alert("Error", err.message || "No se pudo registrar asistencia");
    } finally {
      setLoadingAttend(false);
    }
  };

  // Eliminar evento
  const deleteEvent = () => {
    if (hasPassed) {
      Alert.alert("Evento finalizado", "No puedes eliminar un evento que ya pasó.");
      return;
    }

    Alert.alert("Eliminar Evento", "¿Seguro que deseas eliminar este evento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await eventService.deleteEvent(event.id);
            Alert.alert("Evento eliminado");
            onClose();
          } catch (error) {
            console.log("❌ Error delete:", error);
            Alert.alert("Error", "No se pudo eliminar");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.detailOverlay}>
      {/* BOTÓN CERRAR */}
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Ionicons name="close" size={22} color="#e5e7eb" />
      </TouchableOpacity>

      {/* CONTENIDO */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 180 }}
      >
        {/* TÍTULO */}
        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "800",
            marginBottom: 10,
          }}
        >
          {event.title}
        </Text>

        {/* BADGE DE ESTADO */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: hasPassed
                ? "rgba(239,68,68,0.20)"
                : "rgba(22,163,74,0.20)",
              borderRadius: 999,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Ionicons
              name={hasPassed ? "alert-circle-outline" : "sparkles-outline"}
              size={14}
              color={hasPassed ? "#ef4444" : "#4ade80"}
            />
            <Text
              style={{
                color: hasPassed ? "#fecaca" : "#bbf7d0",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {hasPassed ? "Finalizado" : "Próximo evento"}
            </Text>
          </View>

          {/* Organizador */}
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 999,
              backgroundColor: "rgba(15,23,42,0.8)",
              borderWidth: 1,
              borderColor: "rgba(148,163,184,0.5)",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Ionicons name="person-outline" size={14} color="#e5e7eb" />
            <Text style={{ color: "#e5e7eb", fontSize: 12, fontWeight: "600" }}>
              {event.organizer_name}
            </Text>
          </View>
        </View>

        {/* FECHA Y HORA */}
        <View style={{ flexDirection: "row", gap: 18, marginTop: 20 }}>
          <GlassCard style={{ flex: 1 }}>
            <Ionicons name="calendar-outline" size={20} color="#06f7ff" />
            <Text style={{ color: "white", fontWeight: "600", marginTop: 6 }}>
              {formattedDate}
            </Text>
          </GlassCard>

          <GlassCard style={{ flex: 1 }}>
            <Ionicons name="time-outline" size={20} color="#7c3aed" />
            <Text style={{ color: "white", fontWeight: "600", marginTop: 6 }}>
              {formattedTime}
            </Text>
          </GlassCard>
        </View>

        {/* UBICACIÓN */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Ubicación</Text>
        <View style={styles.detailCard}>
          <Text style={{ color: "white" }}>{event.location}</Text>
        </View>

        {/* DESCRIPCIÓN */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Descripción</Text>
        <View style={styles.detailCard}>
          <Text style={{ color: "#cbd5e1", lineHeight: 20 }}>
            {event.description}
          </Text>
        </View>

        {/* PARTICIPANTES */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Participantes
        </Text>
        <View style={styles.detailCard}>
          <Text style={{ color: "#cbd5e1", marginBottom: 10 }}>
            {attendees.length} asistentes confirmados
          </Text>

          {loadingAttendees ? (
            <ActivityIndicator color="#06f7ff" />
          ) : attendees.length === 0 ? (
            <Text style={{ color: "#94a3b8" }}>
              Aún no hay participantes registrados.
            </Text>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {attendees.map((u, index) => (
                <View
                  key={u.id || index}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.10)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>
                    {u.name?.[0] || u.full_name?.[0] || "U"}
                  </Text>
                  <Text style={{ color: "white", maxWidth: 120 }}>
                    {u.full_name || u.name || u.email}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* BOTÓN COMENTARIOS */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Interacción
        </Text>
        <TouchableOpacity
          onPress={() => setCommentsMode(true)}
          style={{
            padding: 16,
            backgroundColor: "rgba(15,23,42,0.95)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(148,163,184,0.6)",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#06f7ff" />
            <View>
              <Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>
                Ver comentarios y calificaciones
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                Opina o revisa lo que dicen otros
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

        {/* ESTADÍSTICAS DEL EVENTO — SOLO ORGANIZADOR */}
        {isOrganizer && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Estadísticas del evento
            </Text>

            <TouchableOpacity
              onPress={() => setShowEventStats(true)}
              style={{
                padding: 16,
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "rgba(148,163,184,0.5)",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Ionicons name="stats-chart-outline" size={20} color="#a855f7" />
                <View>
                  <Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>
                    Ver estadísticas
                  </Text>
                  <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                    Registros, asistencia, rating y más
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </>
        )}

        {/* COMPARTIR EVENTO */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Compartir</Text>
        <View>
          <TouchableOpacity
            onPress={() => shareEventSocial(event)}
            style={{
              padding: 14,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "rgba(148,163,184,0.5)",
              marginBottom: 10,
            }}
          >
            <Ionicons name="share-social-outline" size={20} color="#06f7ff" />
            <Text
              style={{ color: "white", marginLeft: 10, fontWeight: "700" }}
            >
              Compartir en redes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!user?.email) {
                Alert.alert(
                  "Sin correo registrado",
                  "No encontramos un correo en tu perfil."
                );
                return;
              }
              shareEventByEmail(event, user.email);
            }}
            style={{
              padding: 14,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "rgba(148,163,184,0.5)",
            }}
          >
            <Ionicons name="mail-outline" size={20} color="#06f7ff" />
            <Text
              style={{ color: "white", marginLeft: 10, fontWeight: "700" }}
            >
              Enviarme por email
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.detailBottomBar}>
        {hasPassed ? (
          <View
            style={{
              paddingVertical: 12,
              borderRadius: 16,
              backgroundColor: "rgba(148,163,184,0.18)",
              borderWidth: 1,
              borderColor: "rgba(148,163,184,0.5)",
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: "#e5e7eb", textAlign: "center" }}>
              Este evento ya ha finalizado.
            </Text>
          </View>
        ) : isOrganizer ? (
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={styles.detailSecondaryBtn}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.detailSecondaryText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailDangerBtn}
              onPress={deleteEvent}
            >
              <Ionicons name="trash-outline" size={20} color="#ff7a7a" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleAttend}>
            <LinearGradient
              colors={["#06f7ff", "#7c3aed"]}
              style={styles.detailPrimaryBtn}
            >
              {loadingAttend ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.detailPrimaryText}>Participar ahora</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* EDIT OVERLAY */}
      {editMode && (
        <EditEventScreen
          event={event}
          user={user}
          onClose={() => setEditMode(false)}
          onUpdated={() => {
            setEditMode(false);
            onClose();
          }}
        />
      )}

      {/* COMMENTS OVERLAY */}
      {commentsMode && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
          }}
        >
          <CommentsScreen
            eventId={event.id}
            user={user}
            onClose={() => setCommentsMode(false)}
          />
        </View>
      )}

      {/* EVENT STATS OVERLAY */}
      {showEventStats && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
          }}
        >
          <EventStatsScreen
            eventId={event.id}
            onClose={() => setShowEventStats(false)}
          />
        </View>
      )}
    </View>
  );
}
