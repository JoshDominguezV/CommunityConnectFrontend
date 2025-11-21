// src/screens/DashboardScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  RefreshControl,
  FlatList,
  Dimensions,
  Platform,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FloatingParticles from '../components/FloatingParticles';
import { eventService } from '../services/eventService';
/* Opcionales (crea estos servicios si aún no los tienes):
   import { commentService } from '../services/commentService';
   import { shareService } from '../services/shareService';
   import { statsService } from '../services/statsService';
*/
import styles from '../styles/dashboardStyles';

const DashboardScreen = ({ user, onLogout }) => {
  const { width } = useWindowDimensions();

  // Responsive columns: 1 para móvil, 2 tablet, 3 escritorio anchos
  const getNumColumns = () => {
    if (width > 1100) return 3;
    if (width > 700) return 2;
    return 1;
  };

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState({ visible: false, event: null });
  const [actionLoading, setActionLoading] = useState(false);

  // Cargar eventos (safe)
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await eventService.getUpcomingEvents();
      // Soportar distintas formas de respuesta: { events: [...] } o directamente [...]
      const eventsArray = Array.isArray(response)
        ? response
        : response?.events ?? response ?? [];
      setEvents(eventsArray);
      setFilteredEvents(eventsArray);
    } catch (error) {
      console.warn('Error loading events:', error);
      // Si falla, deja los mock (útil en modo offline/desarrollo)
      setEvents(prev => prev.length ? prev : []);
      setFilteredEvents(prev => prev.length ? prev : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Filtrado (búsqueda + categoría)
  useEffect(() => {
    let filtered = Array.isArray(events) ? events.slice() : [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        (e.title || '').toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q) ||
        (e.location || '').toLowerCase().includes(q)
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      const cat = selectedCategory.toLowerCase();
      filtered = filtered.filter(e =>
        (e.category || '').toLowerCase().includes(cat) ||
        (e.title || '').toLowerCase().includes(cat)
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedCategory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  // Asistir a evento: bloquea si lleno o si ya asististe
  const handleAttendEvent = async (eventObj) => {
    if (!user?.id) {
      Alert.alert('Error', 'Debes iniciar sesión para confirmar asistencia.');
      return;
    }

    // Si evento reach max participants
    const attendees = eventObj.attendees_count || 0;
    const max = eventObj.max_participants || 0;
    if (max > 0 && attendees >= max) {
      Alert.alert('Plazas completas', 'Lo sentimos, el evento ya alcanzó el máximo de participantes.');
      return;
    }

    setActionLoading(true);
    try {
      await eventService.attendEvent(user.id, eventObj.id);
      // Actualizar UI localmente para mejor UX (incrementar asistentes)
      setEvents(prev => prev.map(ev => ev.id === eventObj.id ? { ...ev, attendees_count: (ev.attendees_count || 0) + 1 } : ev));
      Alert.alert('¡Listo!', 'Tu asistencia fue registrada.');
    } catch (error) {
      console.error('Error attending event:', error);
      Alert.alert('Error', error.message || 'No se pudo registrar la asistencia.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleCreateEvent = () => {
    // Si tu rol es organizer puedes crear
    if (user?.role === 'organizer') {
      Alert.alert('Crear Evento', 'Acceso al formulario de creación (implementación pendiente).');
    } else {
      Alert.alert('Acceso denegado', 'Solo organizadores pueden crear eventos.');
    }
  };

  const openEventDetails = async (eventObj) => {
    // Cargar asistentes o comentarios si quieres (ejemplo: lazy load)
    // if (commentService) { const comments = await commentService.getEventComments(eventObj.id) ... }
    setDetailsModal({ visible: true, event: eventObj });
  };

  // Logout: cerrar modal primero, luego ejecutar onLogout (async-safe)
  const confirmLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            setIsSidebarOpen(false);
            try {
              // onLogout viene de App.jsx; puede ser async
              await onLogout();
            } catch (err) {
              console.error('Error during logout:', err);
            }
          }
        }
      ]
    );
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: 'calendar' },
    { id: 'tecnologia', name: 'Tecnología', icon: 'laptop' },
    { id: 'musica', name: 'Música', icon: 'musical-notes' },
    { id: 'negocios', name: 'Negocios', icon: 'briefcase' },
    { id: 'salud', name: 'Salud', icon: 'heart' },
    { id: 'deportes', name: 'Deportes', icon: 'football' },
    { id: 'arte', name: 'Arte', icon: 'color-palette' },
    { id: 'educacion', name: 'Educación', icon: 'school' }
  ];

  // Estadísticas locales (puedes sustituir por statsService)
  const totalAttendees = Array.isArray(events) ? events.reduce((s, e) => s + (e.attendees_count || 0), 0) : 0;
  const upcomingEventsCount = Array.isArray(events) ? events.filter(e => new Date(e.date) > new Date()).length : 0;

  // Render card optimizado
  const renderEventCard = ({ item }) => {
    const isUpcoming = new Date(item.date) > new Date();
    const attendees = item.attendees_count || 0;
    const full = item.max_participants ? attendees >= item.max_participants : false;

    return (
      <View style={[localStyles.cardContainer]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']}
          style={localStyles.card}
        >
          <View style={localStyles.cardHeader}>
            <View style={localStyles.dateBox}>
              <Text style={localStyles.dateDay}>{new Date(item.date).getDate()}</Text>
              <Text style={localStyles.dateMonth}>
                {new Date(item.date).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
              </Text>
            </View>
            <View style={localStyles.statusWrap}>
              <View style={[localStyles.statusIndicator, isUpcoming ? localStyles.statusUpcoming : localStyles.statusPast]}>
                <Text style={localStyles.statusText}>{isUpcoming ? 'PRÓXIMO' : 'PASADO'}</Text>
              </View>
            </View>
          </View>

          <View style={localStyles.cardBody}>
            <Text style={localStyles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={localStyles.description} numberOfLines={3}>{item.description}</Text>

            <View style={localStyles.infoRow}>
              <View style={localStyles.infoItem}>
                <Ionicons name="location-outline" size={14} color="#94a3b8" />
                <Text style={localStyles.infoText} numberOfLines={1}>{item.location}</Text>
              </View>
              <View style={localStyles.infoItem}>
                <Ionicons name="people-outline" size={14} color="#94a3b8" />
                <Text style={localStyles.infoText}>{attendees}/{item.max_participants || '∞'}</Text>
              </View>
            </View>
          </View>

          <View style={localStyles.cardFooter}>
            <TouchableOpacity
              disabled={actionLoading || full}
              style={[localStyles.attendBtn, (full || actionLoading) && localStyles.attendDisabled]}
              onPress={() => handleAttendEvent(item)}
            >
              {actionLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={14} color="white" />
                  <Text style={localStyles.attendText}>{full ? 'Completo' : 'Asistir'}</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={localStyles.rightActions}>
              <TouchableOpacity onPress={() => openEventDetails(item)} style={localStyles.iconBtn}>
                <Ionicons name="eye-outline" size={18} color="#cbd5e1" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                // Integración shareService placeholder
                Alert.alert('Compartir', 'Función de compartir (a implementar).');
              }} style={localStyles.iconBtn}>
                <Ionicons name="share-social-outline" size={18} color="#cbd5e1" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1e293b', '#4f46e5']} style={styles.background} />
      <FloatingParticles />

      {/* HEADER */}
      <View style={[styles.header, { zIndex: 10 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Ionicons name="cube" size={24} color="white" />
            <Text style={styles.logoText}>CommunityConnect</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar eventos..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert('Notificaciones', 'No tienes notificaciones nuevas')}>
            <Ionicons name="notifications" size={20} color="white" />
            <View style={styles.notificationBadge}><Text style={styles.badgeText}>3</Text></View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.userButton} onPress={() => setIsSidebarOpen(true)}>
            <View style={styles.userAvatar}><Text style={styles.avatarText}>{user?.full_name?.charAt(0)?.toUpperCase() || 'U'}</Text></View>
            <Text style={styles.userName}>{user?.full_name?.split(' ')[0] || 'Usuario'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <FlatList
        contentContainerStyle={styles.content}
        data={filteredEvents}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderEventCard}
        numColumns={getNumColumns()}
        columnWrapperStyle={getNumColumns() > 1 ? { justifyContent: 'space-between' } : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#10b981" />}
        ListHeaderComponent={() => (
          <>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>¡Bienvenido de vuelta, {user?.full_name?.split(' ')[0] || 'Usuario'}!</Text>
              <Text style={styles.welcomeSubtitle}>Descubre eventos increíbles en tu comunidad</Text>
            </View>

            <View style={styles.categoriesContainer}>
              <FlatList
                horizontal={true}
                data={categories}
                keyExtractor={c => c.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.categoryPill, selectedCategory === item.id && styles.categoryPillActive]}
                    onPress={() => setSelectedCategory(item.id)}
                  >
                    <Ionicons name={item.icon} size={16} color={selectedCategory === item.id ? '#10b981' : '#94a3b8'} />
                    <Text style={[styles.categoryText, selectedCategory === item.id && styles.categoryTextActive]}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}><Ionicons name="calendar" size={24} color="#10b981" /><Text style={styles.statNumber}>{filteredEvents.length}</Text><Text style={styles.statLabel}>Eventos</Text></View>
              <View style={styles.statCard}><Ionicons name="people" size={24} color="#06b6d4" /><Text style={styles.statNumber}>{totalAttendees}</Text><Text style={styles.statLabel}>Asistentes</Text></View>
              <View style={styles.statCard}><Ionicons name="time" size={24} color="#f59e0b" /><Text style={styles.statNumber}>{upcomingEventsCount}</Text><Text style={styles.statLabel}>Próximos</Text></View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Eventos Destacados</Text>
              <Text style={styles.sectionSubtitle}>{filteredEvents.length} eventos encontrados</Text>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          loading ? (
            <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#10b981" /></View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>No hay eventos</Text>
              <Text style={styles.emptyStateText}>{searchQuery || selectedCategory !== 'all' ? 'No se encontraron eventos que coincidan' : 'No hay eventos disponibles'}</Text>
            </View>
          )
        )}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleCreateEvent}>
        <LinearGradient colors={['#10b981', '#059669']} style={styles.fabGradient}><Ionicons name="add" size={24} color="white" /></LinearGradient>
      </TouchableOpacity>

      {/* SIDEBAR (Modal) */}
      <Modal
        visible={isSidebarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSidebarOpen(false)}
      >
        <View style={styles.sidebarOverlay}>

          {/* PANEL – importante: NO está dentro del TouchableWithoutFeedback */}
          <TouchableWithoutFeedback>
            <View style={styles.sidebar}>

              <View style={styles.sidebarHeader}>
                <View style={styles.sidebarUser}>
                  <View style={styles.sidebarAvatar}>
                    <Text style={styles.avatarText}>
                      {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.sidebarUserName}>
                      {user?.full_name}
                    </Text>
                    <Text style={styles.sidebarUserEmail}>
                      {user?.email}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.sidebarMenu}>
                <TouchableOpacity style={styles.sidebarItem}>
                  <Ionicons name="person-outline" size={20} color="#94a3b8" />
                  <Text style={styles.sidebarItemText}>Mi Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sidebarItem}>
                  <Ionicons name="settings-outline" size={20} color="#94a3b8" />
                  <Text style={styles.sidebarItemText}>Configuración</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sidebarItem}>
                  <Ionicons name="help-circle-outline" size={20} color="#94a3b8" />
                  <Text style={styles.sidebarItemText}>Ayuda</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                {/* BOTÓN DE CERRAR SESIÓN ARREGLADO */}
                <TouchableOpacity
                  style={[styles.sidebarItem, styles.menuItemDanger]}
                  onPress={() => {
                    setIsSidebarOpen(false);
                    setTimeout(() => {
                      onLogout();
                    }, 200);
                  }}
                >
                  <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                  <Text style={[styles.sidebarItemText, styles.logoutText]}>
                    Cerrar Sesión
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>

          {/* ZONA OSCURA CLICABLE PARA CERRAR */}
          <TouchableWithoutFeedback onPress={() => setIsSidebarOpen(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

        </View>
      </Modal>


      {/* EVENT DETAILS MODAL */}
      <Modal visible={detailsModal.visible} transparent animationType="slide" onRequestClose={() => setDetailsModal({ visible: false, event: null })}>
        <TouchableWithoutFeedback onPress={() => setDetailsModal({ visible: false, event: null })}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.detailsWrapper}>
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>{detailsModal.event?.title}</Text>
            <Text style={styles.detailsText}>{detailsModal.event?.description}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Text style={styles.detailsMeta}>Lugar: {detailsModal.event?.location}</Text>
              <Text style={styles.detailsMeta}>Asistentes: {detailsModal.event?.attendees_count || 0}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <TouchableOpacity style={styles.detailsBtn} onPress={() => {
                setDetailsModal({ visible: false, event: null });
                Alert.alert('Comentarios', 'Abrir comentarios (pendiente).');
              }}>
                <Text style={styles.detailsBtnText}>Comentarios</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.detailsBtn, { marginLeft: 8 }]} onPress={() => {
                setDetailsModal({ visible: false, event: null });
                Alert.alert('Compartir', 'Compartir evento (pendiente).');
              }}>
                <Text style={styles.detailsBtnText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 8,
  },
  card: {
    borderRadius: 16,
    padding: 12,
    minHeight: 160,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  dateBox: { alignItems: 'center', padding: 6, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 8, width: 64 },
  dateDay: { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  dateMonth: { color: '#cbd5e1', fontSize: 10, textAlign: 'center' },
  statusWrap: { justifyContent: 'center' },
  statusIndicator: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusUpcoming: { backgroundColor: 'rgba(16,185,129,0.12)' },
  statusPast: { backgroundColor: 'rgba(203,213,225,0.06)' },
  statusText: { color: '#a8b1c6', fontSize: 11, fontWeight: '700' },
  cardBody: { marginTop: 8 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  description: { color: '#cbd5e1', fontSize: 13, marginTop: 6 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { color: '#94a3b8', marginLeft: 6, maxWidth: 140 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  attendBtn: { backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  attendDisabled: { backgroundColor: 'rgba(16,185,129,0.4)' },
  attendText: { color: '#fff', marginLeft: 8, fontWeight: '700' },
  rightActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, marginLeft: 8, borderRadius: 8 },
});

export default DashboardScreen;
