// /src/components/Sidebar.jsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function Sidebar({
  visible,
  onClose,
  user,
  onLogout,
  navigateTo,
}) {
  const slideAnim = useRef(new Animated.Value(-280)).current;

  // Animación de apertura/cierre
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -280,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <>
      {/* Fondo oscuro cuando está visible */}
      {visible && (
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 9998,
          }}
        />
      )}

      {/* SIDEBAR */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          transform: [{ translateX: slideAnim }],
          backgroundColor: "rgba(15,23,42,0.7)",
          borderRightWidth: 1,
          borderRightColor: "rgba(255,255,255,0.1)",
          overflow: "hidden",
          zIndex: 9999,
        }}
      >
        <BlurView intensity={50} tint="dark" style={{ flex: 1 }}>

          {/* HEADER */}
          <View style={{ padding: 30, paddingBottom: 10 }}>
            <View
              style={{
                width: 62,
                height: 62,
                backgroundColor: "rgba(255,255,255,0.12)",
                borderRadius: 999,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.2)",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "800",
                  color: "#06f7ff",
                }}
              >
                {user?.full_name?.[0] || "U"}
              </Text>
            </View>

            <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
              {user?.full_name}
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 13 }}>
              {user?.email}
            </Text>
          </View>

          {/* OPCIONES */}
          <View style={{ marginTop: 20 }}>

            <SidebarItem
              icon="time-outline"
              label="Historial de eventos"
              onPress={() => navigateTo("History")}
              onClose={onClose}
            />

            <SidebarItem
              icon="analytics-outline"
              label="Mis estadísticas"
              onPress={() => navigateTo("Stats")}
              onClose={onClose}
            />

            <SidebarItem
              icon="information-circle-outline"
              label="Licencia y créditos"
              onPress={() => navigateTo("License")}
              onClose={onClose}
            />

          </View>

          {/* LOGOUT */}
          <View
            style={{
              position: "absolute",
              bottom: 40,
              left: 22,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                onClose();
                setTimeout(() => onLogout(), 180);
              }}
              style={{
                padding: 12,
                paddingHorizontal: 20,
                borderRadius: 14,
                backgroundColor: "rgba(239,68,68,0.15)",
                borderWidth: 1,
                borderColor: "rgba(239,68,68,0.45)",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#f87171" />
              <Text
                style={{ color: "#fca5a5", fontWeight: "700", fontSize: 14 }}
              >
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>

        </BlurView>
      </Animated.View>
    </>
  );
}

/* ITEM DEL MENÚ */
function SidebarItem({ icon, label, onPress, onClose }) {
  return (
    <TouchableOpacity
      onPress={() => {
        onClose(); // cerrar menú
        setTimeout(() => onPress(), 180); // esperar animación
      }}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 22,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
      }}
    >
      <Ionicons name={icon} size={22} color="#06f7ff" />
      <Text style={{ color: "white", fontSize: 15, fontWeight: "600" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
