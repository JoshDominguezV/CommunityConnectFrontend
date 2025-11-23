// /src/screens/UserHistoryScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import styles from "../styles/dashboardStyles";
import { eventService } from "../services/eventService";

export default function UserHistoryScreen({ user, onClose, onOpenEvent }) {
  const [loading, setLoading] = useState(true);
  const [attended, setAttended] = useState([]);
  const [past, setPast] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const load = async () => {
    setLoading(true);

    try {
      const pastRes = await eventService.getPastEvents();
      const upcomingRes = await eventService.getUpcomingEvents();

      const allPast = pastRes.events || pastRes || [];
      const allUpcoming = upcomingRes.events || upcomingRes || [];

      const attendedEvents = [...allPast, ...allUpcoming].filter((ev) =>
        ev.attendees?.includes(user.id)
      );

      attendedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      allPast.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAttended(attendedEvents);
      setPast(allPast);
    } catch (err) {
      console.log("❌ Error historial:", err);
    } finally {
      setLoading(false);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    load();
  }, []);

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    if (diff < 60) return "Hace un momento";
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} hrs`;
    return `${Math.floor(diff / 86400)} días atrás`;
  };

  return (
    <View style={styles.detailOverlay}>
      {/* Botón cerrar */}
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Ionicons name="close" size={26} color="#e5e7eb" />
      </TouchableOpacity>

      <Animated.View
        style={{ flex: 1, opacity: fadeAnim }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24, paddingBottom: 80 }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            Historial
          </Text>

          <Text style={{ color: "#64748b", marginBottom: 30 }}>
            Revisa tu actividad y eventos a los que asististe.
          </Text>

          {/* Estadísticas rápidas */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <GlassCard style={{ flex: 1 }}>
              <Ionicons name="checkmark-done-outline" size={22} color="#4ade80" />
              <Text style={{ color: "white", marginTop: 6 }}>Asistidos</Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: "700",
                  marginTop: 4,
                }}
              >
                {attended.length}
              </Text>
            </GlassCard>

            <GlassCard style={{ flex: 1 }}>
              <Ionicons name="time-outline" size={22} color="#a78bfa" />
              <Text style={{ color: "white", marginTop: 6 }}>Pasados</Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: "700",
                  marginTop: 4,
                }}
              >
                {past.length}
              </Text>
            </GlassCard>
          </View>

          {/* Asistidos */}
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
            Eventos a los que asististe
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#06f7ff" />
          ) : attended.length === 0 ? (
            <Text style={{ color: "#64748b", marginTop: 10 }}>
              Aún no asististe a ningún evento.
            </Text>
          ) : (
            attended.map((ev) => (
              <TouchableOpacity
                key={ev.id}
                onPress={() => onOpenEvent(ev)}
                style={{
                  padding: 16,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  marginTop: 10,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
                  {ev.title}
                </Text>

                <View
                  style={{ flexDirection: "row", gap: 10, marginTop: 6 }}
                >
                  <Ionicons name="calendar-outline" size={14} color="#38bdf8" />
                  <Text style={{ color: "#94a3b8" }}>
                    {new Date(ev.date).toLocaleString()}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                    backgroundColor: "rgba(34,197,94,0.15)",
                    alignSelf: "flex-start",
                  }}
                >
                  <Text style={{ color: "#4ade80", fontSize: 12, fontWeight: "600" }}>
                    Asistido
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* Pasados */}
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
            Eventos Pasados
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#06f7ff" />
          ) : past.length === 0 ? (
            <Text style={{ color: "#64748b", marginTop: 10 }}>
              No tienes eventos pasados registrados.
            </Text>
          ) : (
            past.map((ev) => (
              <TouchableOpacity
                key={ev.id}
                onPress={() => onOpenEvent(ev)}
                style={{
                  padding: 16,
                  backgroundColor: "rgba(15,23,42,0.8)",
                  borderRadius: 16,
                  marginTop: 10,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
                  {ev.title}
                </Text>

                <View
                  style={{ flexDirection: "row", gap: 10, marginTop: 6 }}
                >
                  <Ionicons name="calendar-outline" size={14} color="#06f7ff" />
                  <Text style={{ color: "#94a3b8" }}>
                    {new Date(ev.date).toLocaleString()}
                  </Text>
                </View>

                <Text
                  style={{
                    marginTop: 6,
                    color: "#64748b",
                    fontSize: 12,
                  }}
                >
                  {timeAgo(ev.date)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
