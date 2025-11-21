import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FloatingParticles from "../components/FloatingParticles";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CategoryFilter from "../components/CategoryFilter";
import EventCard from "../components/EventCard";
import StatsRow from "../components/StatsRow";
import { eventService } from "../services/eventService";

import styles from "../styles/dashboardStyles";

const DashboardScreen = ({ user, onLogout, onCreateEvent }) => {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await eventService.getUpcomingEvents();
      const list = res?.events ?? res ?? [];
      setEvents(list);
      setFiltered(list);
    } catch (err) {
      console.error(err);
      setEvents([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let list = [...events];

    if (query) {
      list = list.filter((e) =>
        (e.title + e.description + e.location)
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }

    if (category !== "all") {
      list = list.filter((e) => e.category === category);
    }

    setFiltered(list);
  }, [events, query, category]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1e293b", "#4f46e5"]}
        style={styles.background}
      />

      <FloatingParticles />

      <Header
        user={user}
        searchQuery={query}
        onSearchChange={setQuery}
        onMenuPress={() => setSidebarOpen(true)}
        onNotificationsPress={() => alert("Sin notificaciones")}
      />

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              ¡Bienvenido de vuelta, {user?.full_name?.split(" ")[0]}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Descubre eventos increíbles en tu comunidad
            </Text>
          </View>

          <CategoryFilter selected={category} onSelect={setCategory} />

          <StatsRow
            events={filtered.length}
            attendees={events.reduce(
              (s, e) => s + (e.attendees_count || 0),
              0
            )}
            upcoming={events.filter(
              (e) => new Date(e.date) > new Date()
            ).length}
          />

          <View style={styles.eventsSection}>
            <Text style={styles.sectionTitle}>Eventos Destacados</Text>

            {loading ? (
              <Text style={styles.emptyStateText}>Cargando...</Text>
            ) : filtered.length === 0 ? (
              <Text style={styles.emptyStateText}>No hay eventos</Text>
            ) : (
              filtered.map((ev) => (
                <View key={ev.id} style={styles.eventCardWrapper}>
                  <EventCard
                    event={ev}
                    onOpen={() => alert("Detalles pronto...")}
                  />
                </View>
              ))
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={onCreateEvent}>
        <LinearGradient
          colors={["#06f7ff", "#7c3aed"]}
          style={styles.fabGradient}
        >
          <Text style={{ fontSize: 26, fontWeight: "900", color: "#021025" }}>
            +
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;
