import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/dashboardStyles";

const EventCard = ({ event, onAttend, onOpen }) => {
  const isUpcoming = new Date(event.date) > new Date();
  return (
    <TouchableOpacity activeOpacity={0.95} onPress={() => onOpen && onOpen(event)}>
      <LinearGradient
        colors={["rgba(255,255,255,0.03)", "rgba(124,58,237,0.03)"]}
        style={styles.eventCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventDate}>
            <Text style={styles.eventDay}>{new Date(event.date).getDate()}</Text>
            <Text style={styles.eventMonth}>{new Date(event.date).toLocaleString('es-ES', { month: 'short' }).toUpperCase()}</Text>
          </View>

          <View style={[styles.statusIndicator, isUpcoming ? styles.statusUpcoming : styles.statusPast]}>
            <Text style={styles.statusText}>{isUpcoming ? "PRÓXIMO" : "PASADO"}</Text>
          </View>
        </View>

        <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={3}>{event.description}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="location-outline" size={14} color="#9aa6bf" />
            <Text style={styles.infoText}>{event.location}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="people-outline" size={14} color="#9aa6bf" />
            <Text style={styles.infoText}>{event.attendees_count || 0}/{event.max_participants || "∞"}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
          <TouchableOpacity onPress={() => onAttend && onAttend(event.id)} style={styles.attendButton}>
            <LinearGradient colors={["#05f6ff", "#7c3aed"]} style={styles.attendButtonGradient}>
              <Ionicons name="checkmark" size={14} color="#05203a" />
              <Text style={styles.attendButtonText}>Asistir</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default EventCard;
