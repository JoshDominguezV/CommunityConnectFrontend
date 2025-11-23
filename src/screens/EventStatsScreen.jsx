// /src/screens/EventStatsScreen.jsx
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
import { LinearGradient } from "expo-linear-gradient";
import { eventService } from "../services/eventService";

export default function EventStatsScreen({ eventId, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadStats = async () => {
    try {
      const res = await eventService.getEventStats(eventId);
      // Backend:
      // {
      //   event_id,
      //   statistics: {
      //     title, date, location,
      //     total_registered,
      //     total_attended,
      //     average_rating,
      //     total_comments,
      //     total_shares
      //   }
      // }
      setStats(res.statistics || {});
    } catch (err) {
      console.log("❌ Error stats evento:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  if (loading || !stats) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(15,23,42,0.96)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#06f7ff" />
      </View>
    );
  }

  const {
    title,
    date,
    location,
    total_registered,
    total_attended,
    average_rating,
    total_comments,
    total_shares,
  } = stats;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15,23,42,0.98)",
        zIndex: 9999,
        elevation: 9999,
        paddingTop: 60,
        opacity: fadeAnim,
      }}
    >
      {/* Cerrar */}
      <TouchableOpacity
        onPress={onClose}
        style={{ position: "absolute", top: 40, right: 24, zIndex: 999 }}
      >
        <Ionicons name="close-circle" size={32} color="#06f7ff" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
      >
        {/* Título */}
        <Text style={{ color: "white", fontSize: 28, fontWeight: "900" }}>
          Estadísticas del Evento 📊
        </Text>
        <Text style={{ color: "#06f7ff", fontSize: 18, fontWeight: "700" }}>
          {title}
        </Text>

        <Text style={{ color: "#94a3b8", marginTop: 4 }}>
          {new Date(date).toLocaleString("es-ES")}
        </Text>
        <Text style={{ color: "#64748b", marginBottom: 20 }}>{location}</Text>

        {/* Cards principales */}
        <View style={{ flexDirection: "row", gap: 14, marginBottom: 14 }}>
          <StatCard
            label="Registrados"
            value={total_registered}
            colors={["#06f7ff55", "#7c3aed55"]}
          />
          <StatCard
            label="Asistieron"
            value={total_attended}
            colors={["#4f46e555", "#06f7ff44"]}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 14 }}>
          <StatCard
            label="Comentarios"
            value={total_comments}
            colors={["#7c3aed55", "#06f7ff33"]}
          />
          <StatCard
            label="Comparticiones"
            value={total_shares}
            colors={["#06f7ff55", "#3b82f655"]}
          />
        </View>

        {/* Rating */}
        <View style={{ marginTop: 25 }}>
          <LinearGradient
            colors={["#7c3aed33", "#06f7ff22"]}
            style={{
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Text style={{ color: "#cbd5e1", fontSize: 16 }}>
              Promedio de Rating
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 40,
                fontWeight: "900",
                marginTop: 8,
              }}
            >
              {average_rating?.toFixed(1) ?? 0}
            </Text>

            <View style={{ flexDirection: "row", marginTop: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Ionicons
                  key={n}
                  name={n <= Math.round(average_rating) ? "star" : "star-outline"}
                  size={26}
                  color="#facc15"
                />
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </Animated.View>
  );
}

function StatCard({ label, value, colors }) {
  return (
    <LinearGradient
      colors={colors}
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        minHeight: 110,
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#cbd5e1", fontSize: 14 }}>{label}</Text>
      <Text
        style={{
          color: "white",
          fontSize: 34,
          fontWeight: "900",
          marginTop: 10,
        }}
      >
        {value}
      </Text>
    </LinearGradient>
  );
}
