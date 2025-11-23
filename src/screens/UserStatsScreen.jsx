// /src/screens/UserStatsScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { eventService } from "../services/eventService";

export default function UserStatsScreen({ user, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadStats = async () => {
    try {
      const res = await eventService.getUserStats(user.id);
      setStats(res.statistics || {});
    } catch (err) {
      console.log("❌ Error stats:", err);
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
          backgroundColor: "rgba(15,23,42,0.95)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#06f7ff" />
      </View>
    );
  }

  const registered = stats.events_registered ?? 0;
  const attended = stats.events_attended ?? 0;
  const organized = stats.events_organized ?? 0;

  return (
    <View
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
        <Text style={{ color: "white", fontSize: 30, fontWeight: "900" }}>
          Tus estadísticas ⚡
        </Text>

        <Text
          style={{
            color: "#94a3b8",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          Un vistazo épico a tu actividad
        </Text>

        {/* Tarjetas principales */}
        <View style={{ flexDirection: "row", marginBottom: 18 }}>
          <StatCard
            label="Eventos inscritos"
            value={registered}
            colors={["#06f7ff44", "#7c3aed55"]}
          />
          <View style={{ width: 14 }} />
          <StatCard
            label="Eventos asistidos"
            value={attended}
            colors={["#4f46e555", "#06f7ff55"]}
          />
        </View>

        <StatCard
          label="Eventos organizados"
          value={organized}
          colors={["#7c3aed55", "#06f7ff33"]}
          big
        />

        {/* Indicador circular manual (sin librerías) */}
        <Text
          style={{
            color: "white",
            fontSize: 20,
            marginTop: 30,
            fontWeight: "700",
          }}
        >
          Distribución general
        </Text>

        <View
          style={{
            marginTop: 20,
            alignSelf: "center",
            width: 200,
            height: 200,
            borderRadius: 999,
            borderWidth: 12,
            borderColor: "rgba(255,255,255,0.08)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#06f7ff",
              fontSize: 40,
              fontWeight: "900",
            }}
          >
            {registered + attended + organized}
          </Text>
          <Text style={{ color: "#94a3b8", marginTop: -6 }}>
            Total eventos
          </Text>
        </View>

        {/* Breakdown simple */}
        <View style={{ marginTop: 30 }}>
          <BreakdownItem label="Inscritos" value={registered} color="#06f7ff" />
          <BreakdownItem label="Asistidos" value={attended} color="#3b82f6" />
          <BreakdownItem label="Organizados" value={organized} color="#7c3aed" />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, colors, big }) {
  return (
    <LinearGradient
      colors={colors}
      style={{
        flex: big ? 1 : 1,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        minHeight: big ? 120 : 110,
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#cbd5e1", fontSize: 14 }}>{label}</Text>
      <Text
        style={{
          color: "white",
          fontSize: big ? 38 : 34,
          fontWeight: "900",
          marginTop: 10,
        }}
      >
        {value}
      </Text>
    </LinearGradient>
  );
}

function BreakdownItem({ label, value, color }) {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingVertical: 12,
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <Text style={{ color: "white", fontSize: 16 }}>{label}</Text>
      <Text style={{ color, fontSize: 18, fontWeight: "800" }}>{value}</Text>
    </View>
  );
}
