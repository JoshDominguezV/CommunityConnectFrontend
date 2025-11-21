import React from "react";
import { View, Text, TextInput, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";

const Header = ({ user, searchQuery, onSearchChange, onMenuPress, onNotificationsPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="cube" size={18} color="#a78bfa" />
          </View>
          <Text style={styles.logoText}>CommunityConnect</Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar eventos, lugares, organizadores..."
          placeholderTextColor="#9aa6bf"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconBtn} onPress={onNotificationsPress}>
          <Ionicons name="notifications-outline" size={22} color="#e6f7ff" />
          <View style={styles.notifyDot} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userBtn} onPress={onMenuPress}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text numberOfLines={1} style={styles.userName}>
            {user?.full_name?.split(' ')[0] || "Usuario"}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#9aa6bf" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
