// /src/components/Header.jsx
import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/headerStyles";

export default function Header({
  user,
  searchQuery,
  onSearchChange,
  onMenuPress,
  notificationsCount,
  onNotificationsPress,
}) {
  return (
    <View style={styles.headerContainer}>


      {/* MENU */}
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu-outline" size={28} color="white" />
      </TouchableOpacity>

      {/* SEARCH */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar eventos..."
        placeholderTextColor="#94a3b8"
        value={searchQuery}
        onChangeText={onSearchChange}
      />


      {/* NOTIFICATIONS */}
      <TouchableOpacity onPress={onNotificationsPress} style={{ marginLeft: 10 }}>
        <View style={{ position: "relative" }}>
          <Ionicons name="notifications-outline" size={26} color="white" />

          {notificationsCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                backgroundColor: "#ef4444",
                borderRadius: 10,
                paddingHorizontal: 4,
                paddingVertical: 1,
                minWidth: 18,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontWeight: "700",
                }}
              >
                {notificationsCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>


    </View>
  );
}
