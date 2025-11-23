// /src/screens/DashboardScreen.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import FloatingParticles from "../components/FloatingParticles";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CategoryFilter from "../components/CategoryFilter";
import EventCard from "../components/EventCard";
import StatsRow from "../components/StatsRow";

import EventDetailScreen from "./EventDetailScreen";
import LicenseScreen from "./LicenseScreen";
import NotificationsScreen from "./NotificationsScreen";
import UserHistoryScreen from "./UserHistoryScreen";
import UserStatsScreen from "./UserStatsScreen";

import { eventService } from "../services/eventService";
import styles from "../styles/dashboardStyles";

export default function DashboardScreen({ user, onLogout, onCreateEvent }) {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [showLicense, setShowLicense] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ------------------------------------
  // NOTIFICACIONES
  // ------------------------------------
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await eventService.getUserNotifications(user.id);

      // Nuevo backend:
      // {
      //   user_id,
      //   total_notifications,
      //   unread_count,
      //   notifications: [ { open: 1|0 } ]
      // }
      const unread = data?.unread_count ?? (
        data?.notifications?.filter((n) => n.open === 1).length || 0
      );

      setUnreadCount(unread);
    } catch (e) {
      console.log("❌ Error notificaciones:", e);
    }
  };

  useEffect(() => {
    loadNotifications();
    const it = setInterval(loadNotifications, 25000);
    return () => clearInterval(it);
  }, []);

  // ------------------------------------
  // EVENTOS
  // ------------------------------------
  const loadEvents = async () => {
    try {
      setLoading(true);

      const all = await eventService.getAllEvents();
      setEvents(all);
      setFiltered(all);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      console.log("❌ Error eventos:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ------------------------------------
  // FILTROS
  // ------------------------------------
  useEffect(() => {
    let list = [...events];
    const now = new Date();

    if (category === "today") {
      list = list.filter(
        (e) => new Date(e.date).toDateString() === now.toDateString()
      );
    }

    if (category === "upcoming") {
      list = list.filter((e) => new Date(e.date) > now);
    }

    if (category === "past") {
      list = list.filter((e) => new Date(e.date) < now);
    }

    if (query) {
      const q = query.toLowerCase();
      list = list.filter((e) =>
        (e.title + e.description + e.location).toLowerCase().includes(q)
      );
    }

    setFiltered(list);
  }, [events, query, category]);

  // ------------------------------------
  // REFRESH
  // ------------------------------------
  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    await loadNotifications();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* FONDO */}
      <LinearGradient colors={["#1e293b", "#4f46e5"]} style={styles.background} />
      <FloatingParticles />

      {/* HEADER */}
      <Header
        user={user}
        searchQuery={query}
        onSearchChange={setQuery}
        onMenuPress={() => setSidebarOpen(true)}
        notificationsCount={unreadCount}   // 🔥 SOLO no leídas
        onNotificationsPress={() => setShowNotifications(true)}
      />

      {/* SIDEBAR */}
      <Sidebar
        visible={sidebarOpen}
        user={user}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        navigateTo={(screen) => {
          if (screen === "History") setShowHistory(true);
          if (screen === "Stats") setShowStats(true);
          if (screen === "License") setShowLicense(true);
        }}
      />

      {/* CONTENIDO */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Bienvenida */}
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeTitle, { fontSize: 26 }]}>
              Hola, {user?.full_name?.split(" ")[0]} 👋
            </Text>
            <Text style={[styles.welcomeSubtitle, { fontSize: 15 }]}>
              Descubre eventos increíbles cerca de ti ✨
            </Text>
          </View>

          {/* Filtros */}
          <CategoryFilter selected={category} onSelect={setCategory} />

          {/* Stats */}
          <StatsRow
            events={filtered.length}
            communities={8}
            connections={events.reduce((s, e) => s + (e.attendees_count || 0), 0)}
          />

          {/* Header de sección */}
          <View style={styles.eventHeaderRow}>
            <Text style={styles.sectionTitle}>Eventos</Text>
          </View>

          {/* LISTA DE EVENTOS */}
          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            {loading ? (
              <Text style={styles.emptyStateText}>Cargando...</Text>
            ) : filtered.length === 0 ? (
              <Text style={styles.emptyStateText}>No hay eventos</Text>
            ) : (
              filtered.map((ev) => (
                <View key={ev.id} style={styles.eventCardWrapper}>
                  <EventCard event={ev} onOpen={() => setSelectedEvent(ev)} />
                </View>
              ))
            )}
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>
      </Animated.View>

      {/* FAB para organizadores */}
      {user.role === "organizer" && (
        <TouchableOpacity style={styles.fab} onPress={onCreateEvent}>
          <LinearGradient colors={["#06f7ff", "#7c3aed"]} style={styles.fabGradient}>
            <Text style={{ fontSize: 28, fontWeight: "900", color: "#021025" }}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* OVERLAYS */}
      {selectedEvent && (
        <EventDetailScreen
          user={user}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {showHistory && (
        <UserHistoryScreen
          user={user}
          onClose={() => setShowHistory(false)}
          onOpenEvent={(ev) => {
            setShowHistory(false);
            setSelectedEvent(ev);
          }}
        />
      )}

      {showStats && (
        <UserStatsScreen user={user} onClose={() => setShowStats(false)} />
      )}

      {showLicense && <LicenseScreen onClose={() => setShowLicense(false)} />}

      {showNotifications && (
        <NotificationsScreen
          user={user}
          onClose={() => {
            setShowNotifications(false);
            loadNotifications(); // recarga contador después de cerrar
          }}
          onUnreadCountChange={setUnreadCount} // 🔥 se actualiza en tiempo real
        />
      )}
    </View>
  );
}
