// /src/screens/NotificationsScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";
import { eventService } from "../services/eventService";

export default function NotificationsScreen({ user, onClose, onUnreadCountChange }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const load = async () => {
    try {
      const data = await eventService.getUserNotifications(user.id);

      let notifications = Array.isArray(data)
        ? data
        : data?.notifications || [];

      // 🔥 ORDENAR MÁS RECIENTES PRIMERO
      notifications = notifications.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setList(notifications);

      // 🔥 Actualizar contador de no leídas
      if (onUnreadCountChange) {
        const unread =
          data?.unread_count ??
          notifications.filter((n) => n.open === 1).length;

        onUnreadCountChange(unread);
      }
    } catch (err) {
      console.log("❌ Error notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateUnreadCount = (updatedList) => {
    const unread = updatedList.filter((n) => n.open === 1).length;
    onUnreadCountChange?.(unread);
  };

  const handleNotificationPress = async (item, index) => {
    if (item.open === 0) return; // Ya leída

    try {
      const updated = [...list];
      updated[index] = { ...item, open: 0 };

      setList(updated);
      updateUnreadCount(updated);

      if (item.notification_id) {
        await eventService.markNotificationAsRead(item.notification_id);
      }
    } catch (err) {
      console.log("❌ Error al marcar notificación como leída:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (markingAll || list.length === 0) return;

    setMarkingAll(true);
    try {
      await eventService.markAllNotificationsAsRead(user.id);

      const updated = list.map((n) => ({ ...n, open: 0 }));
      setList(updated);
      updateUnreadCount(updated);
    } catch (err) {
      console.log("❌ Error al marcar todas como leídas:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const renderBadge = (item) => {
    if (item.open === 1) {
      return (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#22c55e",
            marginRight: 8,
          }}
        />
      );
    }
    return (
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: "#64748b",
          marginRight: 8,
        }}
      />
    );
  };

  return (
    <View style={styles.detailOverlay}>
      {/* Cerrar */}
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Ionicons name="close" size={24} color="#e5e7eb" />
      </TouchableOpacity>

      <View style={{ paddingTop: 60, paddingHorizontal: 24, flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white", fontSize: 24, fontWeight: "800" }}>
            Notificaciones
          </Text>

          {list.length > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              disabled={markingAll}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: "rgba(148, 163, 184, 0.6)",
                opacity: markingAll ? 0.6 : 1,
              }}
            >
              <Ionicons name="checkmark-done-outline" size={16} color="#e5e7eb" />
              <Text style={{ color: "#e5e7eb", fontSize: 12, marginLeft: 6 }}>
                Marcar todas como leídas
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lista */}
        {loading ? (
          <ActivityIndicator size="large" color="#06f7ff" />
        ) : list.length === 0 ? (
          <Text style={{ color: "#94a3b8" }}>No tienes notificaciones.</Text>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {list.map((item, index) => (
              <TouchableOpacity
                key={item.notification_id || index}
                onPress={() => handleNotificationPress(item, index)}
                activeOpacity={0.8}
                style={{
                  padding: 14,
                  backgroundColor:
                    item.open === 1
                      ? "rgba(56,189,248,0.12)"
                      : "rgba(15,23,42,0.75)",
                  borderRadius: 14,
                  marginBottom: 14,
                  borderWidth: 1,
                  borderColor:
                    item.open === 1
                      ? "rgba(56,189,248,0.9)"
                      : "rgba(148,163,184,0.4)",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
                >
                  {renderBadge(item)}

                  <Text
                    style={{
                      color: "white",
                      fontWeight: item.open === 1 ? "800" : "600",
                      fontSize: 14,
                    }}
                  >
                    {item.event_title || item.title}
                  </Text>
                </View>

                <Text style={{ color: "#cbd5e1", marginTop: 2, fontSize: 13 }}>
                  {item.message}
                </Text>

                {item.created_at && (
                  <Text
                    style={{
                      color: "#94a3b8",
                      fontSize: 11,
                      textAlign: "right",
                      marginTop: 6,
                    }}
                  >
                    {new Date(item.created_at).toLocaleString()}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
