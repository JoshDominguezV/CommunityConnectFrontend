// /src/components/EventCard.jsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/dashboardStyles";

const EventCard = ({ event, onOpen }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onOpen}>
      <LinearGradient
        colors={["rgba(255,255,255,0.05)", "rgba(60,70,120,0.1)"]}
        style={styles.eventCard}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.eventTitle}>{event.title}</Text>

          <View style={styles.badgeIcon}>
            <Ionicons name="code-slash" size={18} color="#fff" />
          </View>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.eventInfoRow}>
          <View style={styles.eventInfoLeft}>
            <Ionicons name="calendar-outline" size={14} color="#9aa6bf" />
            <Text style={styles.infoText}>
              {new Date(event.date).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
              })}
            </Text>
            <Ionicons name="time-outline" size={14} color="#9aa6bf" />
            <Text style={styles.infoText}>00:00</Text>
          </View>

          <View style={styles.eventRightGroup}>
            <View style={styles.avatarStack}>
              {[1, 2, 3].map((i) => (
                <Image
                  key={i}
                  source={{ uri: "https://i.pravatar.cc/150?img=" + (i + 3) }}
                  style={styles.avatarSmall}
                />
              ))}
            </View>
            <Text style={styles.countText}>
              +{event.attendees_count || 0}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default EventCard;

