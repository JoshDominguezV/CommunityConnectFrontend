import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { eventService } from '../services/eventService';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import CategoryFilter from '../components/CategoryFilter';
import FloatingParticles from '../components/FloatingParticles';

import styles from '../styles/dashboardStyles';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ user, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar eventos
  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getUpcomingEvents();
      console.log('📅 Events loaded:', response);
      
      // La API devuelve {events: Array(0)}, necesitamos extraer el array
      const eventsArray = response.events || response || [];
      console.log('📊 Events array:', eventsArray);
      
      setEvents(eventsArray);
      setFilteredEvents(eventsArray);
    } catch (error) {
      console.log('❌ Error loading events:', error);
      // Datos mock para testing
      const mockEvents = [
        {
          id: 1,
          title: "Conferencia de Tecnología 2024",
          description: "Evento anual sobre las últimas tendencias en tecnología",
          date: "2024-12-15T10:00:00",
          location: "Centro de Convenciones",
          max_participants: 200,
          attendees_count: 45,
          organizer_name: "Tech Community"
        },
        {
          id: 2,
          title: "Taller de Python Avanzado",
          description: "Taller práctico sobre técnicas avanzadas de Python",
          date: "2024-11-20T14:00:00",
          location: "Aula Magna Universidad",
          max_participants: 50,
          attendees_count: 32,
          organizer_name: "Python User Group"
        }
      ];
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Filtrar eventos por categoría y búsqueda
  useEffect(() => {
    let filtered = Array.isArray(events) ? events : [];
    
    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => 
        event.title?.toLowerCase().includes(selectedCategory) ||
        event.description?.toLowerCase().includes(selectedCategory)
      );
    }
    
    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedCategory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleAttendEvent = async (eventId) => {
    try {
      if (user && user.id) {
        await eventService.attendEvent(user.id, eventId);
        Alert.alert('Éxito', 'Te has registrado al evento');
        loadEvents();
      } else {
        Alert.alert('Error', 'Usuario no identificado');
      }
    } catch (error) {
      console.log('❌ Error attending event:', error);
      Alert.alert('Error', error.message || 'No se pudo registrar la asistencia');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateEvent = () => {
    Alert.alert('Crear Evento', 'Funcionalidad en desarrollo');
  };

  const handleProfilePress = () => {
    Alert.alert('Perfil', `Usuario: ${user?.full_name || 'Invitado'}\nEmail: ${user?.email || 'No disponible'}`);
  };

  const handleNotificationsPress = () => {
    Alert.alert('Notificaciones', 'No tienes notificaciones nuevas');
  };

  const renderEventCard = ({ item, index }) => (
    <View style={[
      styles.eventCardWrapper,
      index % 2 === 0 ? styles.eventCardLeft : styles.eventCardRight
    ]}>
      <EventCard
        event={item}
        onPress={() => Alert.alert(
          item.title, 
          `${item.description}\n\n📍 ${item.location}\n📅 ${new Date(item.date).toLocaleDateString('es-ES')}\n👥 ${item.attendees_count || 0}/${item.max_participants} asistentes`
        )}
        onAttend={handleAttendEvent}
      />
    </View>
  );

  // Calcular estadísticas de forma segura
  const totalAttendees = Array.isArray(events) 
    ? events.reduce((total, event) => total + (event.attendees_count || 0), 0)
    : 0;

  const upcomingEventsCount = Array.isArray(events)
    ? events.filter(event => new Date(event.date) > new Date()).length
    : 0;

  return (
    <View style={styles.container}>
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={['#1e293b', '#4f46e5']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Partículas flotantes */}
      <FloatingParticles />

      {/* Header */}
      <Header
        user={user}
        onSearch={handleSearch}
        onProfilePress={handleProfilePress}
        onNotificationsPress={handleNotificationsPress}

      />

      {/* Contenido principal */}
      <View style={styles.content}>
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#10b981']}
              tintColor="#10b981"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Bienvenida */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              ¡Bienvenido de vuelta, {user?.full_name?.split(' ')[0] || 'Usuario'}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Descubre eventos increíbles en tu comunidad
            </Text>
          </View>

          {/* Filtros de categoría */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {/* Estadísticas rápidas */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#10b981" />
              <Text style={styles.statNumber}>
                {Array.isArray(filteredEvents) ? filteredEvents.length : 0}
              </Text>
              <Text style={styles.statLabel}>Eventos</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color="#06b6d4" />
              <Text style={styles.statNumber}>
                {totalAttendees}
              </Text>
              <Text style={styles.statLabel}>Asistentes</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color="#f59e0b" />
              <Text style={styles.statNumber}>
                {upcomingEventsCount}
              </Text>
              <Text style={styles.statLabel}>Próximos</Text>
            </View>
          </View>

          {/* Lista de eventos */}
          <View style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Eventos Destacados
              </Text>
              <Text style={styles.sectionSubtitle}>
                {Array.isArray(filteredEvents) ? filteredEvents.length : 0} eventos encontrados
              </Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando eventos...</Text>
              </View>
            ) : Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
              <FlatList
                data={filteredEvents}
                renderItem={renderEventCard}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.eventsGrid}
                numColumns={2}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={64} color="#94a3b8" />
                <Text style={styles.emptyStateTitle}>No hay eventos</Text>
                <Text style={styles.emptyStateText}>
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'No se encontraron eventos que coincidan con tu búsqueda' 
                    : 'No hay eventos disponibles en este momento'
                  }
                </Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={loadEvents}
                >
                  <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Espacio extra al final */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCreateEvent}
      >
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;