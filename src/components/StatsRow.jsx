import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";

const Stat = ({ icon, value, label, color }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={22} color={color || "#06f7ff"} />
    <Text style={styles.statNumber}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const StatsRow = ({ events, attendees, upcoming }) => {
  return (
    <View style={styles.statsContainer}>
      <Stat icon="calendar-outline" value={events} label="Eventos" color="#7c3aed" />
      <Stat icon="people-outline" value={attendees} label="Asistentes" color="#06f7ff" />
      <Stat icon="time-outline" value={upcoming} label="Próximos" color="#ffb86b" />
    </View>
  );
};

export default StatsRow;

