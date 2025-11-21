import React from "react";
import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/dashboardStyles";

const Sidebar = ({ visible, onClose, user, onLogout }) => {
  const handleLogout = () => {
    onClose();
    setTimeout(() => onLogout && onLogout(), 180);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.sidebarOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <View style={styles.sidebarUser}>
              <View style={styles.sidebarAvatar}>
                <Text style={styles.avatarText}>{user?.full_name?.charAt(0)?.toUpperCase() || "U"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sidebarUserName}>{user?.full_name || "Usuario"}</Text>
                <Text style={styles.sidebarUserEmail}>{user?.email || "no-email@example.com"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sidebarMenu}>
            <TouchableOpacity style={styles.sidebarItem}>
              <Ionicons name="person-circle-outline" size={20} color="#cbd5e1" />
              <Text style={styles.sidebarItemText}>Mi Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem}>
              <Ionicons name="calendar-outline" size={20} color="#cbd5e1" />
              <Text style={styles.sidebarItemText}>Mis Eventos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem}>
              <Ionicons name="settings-outline" size={20} color="#cbd5e1" />
              <Text style={styles.sidebarItemText}>Configuración</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={[styles.sidebarItem, styles.logoutRow]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#ff7a7a" />
              <Text style={[styles.sidebarItemText, styles.logoutText]}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Sidebar;
