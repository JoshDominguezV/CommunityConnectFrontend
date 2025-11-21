// styles/dashboardStyles.js
import { StyleSheet, Dimensions, Platform } from "react-native";
const { width } = Dimensions.get("window");
const isTablet = width > 768;

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071029" },
  background: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },



  /* Header */
  header: {
    flexDirection: isTablet ? "row" : "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 26,           // Aumentado
    paddingTop: Platform.OS === "ios" ? 60 : 46,
    paddingBottom: 18,               // Aumentado
    gap: isTablet ? 0 : 18,          // Más separación entre filas en móvil
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isTablet ? 0 : 6,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,                          // <- NUEVO: más espacio entre icono y texto
  },

  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(124,58,237,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginVertical: isTablet ? 0 : 8,
    marginTop: isTablet ? 0 : 6,

    /**  MÁS ESPACIADO  **/
    width: "100%",
    gap: 12,
    minHeight: 46,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: "#e2e8f0",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,                         // <- MÁS ESPACIO ENTRE ICONOS
    marginTop: isTablet ? 0 : 6,
  },

  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  userBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 10,                        // <- MÁS ESPACIADO INTERNO
  },

  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#06f7ff",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: { color: "#e6f7ff", fontSize: 18, fontWeight: "800" },
  userName: { color: "#dbeafe", fontWeight: "700", maxWidth: 100 },


  /* Welcome */
  welcomeSection: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 6 },
  welcomeTitle: { color: "#f0f9ff", fontSize: isTablet ? 32 : 22, fontWeight: "900" },
  welcomeSubtitle: { color: "#9aa6bf", marginTop: 6 },

  /* Categories */
  categoriesContainer: { paddingHorizontal: 20, marginTop: 8, marginBottom: 14 },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)"
  },
  categoryPillActive: {
    backgroundColor: "linear-gradient(90deg,#06f7ff33,#7c3aed33)",
    borderColor: "rgba(6,247,255,0.28)",
    shadowColor: "#06f7ff88",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18
  },
  categoryText: { color: "#9aa6bf", marginLeft: 8 },
  categoryTextActive: { color: "#06f7ff", fontWeight: "700" },

  /* Stats */
  statsContainer: { flexDirection: "row", paddingHorizontal: 20, gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.08)"
  },
  statNumber: { color: "#f8feff", fontSize: 22, fontWeight: "900", marginTop: 6 },
  statLabel: { color: "#9aa6bf", marginTop: 4 },

  /* Events */
  eventsSection: { paddingHorizontal: 20, paddingTop: 6 },
  sectionTitle: { color: "#f8feff", fontSize: 18, fontWeight: "800", marginBottom: 12 },
  emptyStateText: { color: "#9aa6bf", textAlign: "center", paddingVertical: 30 },

  eventCardWrapper: { marginBottom: 14 },
  eventCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(12,20,34,0.25)",
    shadowColor: "#06f7ff22",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20
  },

  eventHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  eventDate: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.02)", padding: 8, borderRadius: 8 },
  eventDay: { color: "#e6f7ff", fontSize: 20, fontWeight: "900" },
  eventMonth: { color: "#9aa6bf", fontSize: 10 },

  statusIndicator: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusUpcoming: { backgroundColor: "rgba(6,247,255,0.08)" },
  statusPast: { backgroundColor: "rgba(255,255,255,0.02)" },
  statusText: { color: "#9aa6bf", fontSize: 11, fontWeight: "700" },

  eventTitle: { color: "#e6f7ff", fontSize: 16, fontWeight: "800", marginTop: 6 },
  eventDescription: { color: "#9aa6bf", marginTop: 6, lineHeight: 18 },
  infoText: { color: "#9aa6bf", marginLeft: 8 },

  attendButton: { borderRadius: 12, overflow: "hidden" },
  attendButtonGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  attendButtonText: { color: "#021025", fontWeight: "800", marginLeft: 6 },

  /* Sidebar */
  sidebarOverlay: { flex: 1, flexDirection: "row", backgroundColor: "rgba(0,0,0,0.46)" },
  sidebar: {
    width: Math.min(width * 0.75, 320),
    backgroundColor: "rgba(10,16,28,0.98)",
    paddingTop: Platform.OS === "ios" ? 64 : 34,
    paddingHorizontal: 18,
    zIndex: 99
  },
  sidebarHeader: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.04)" },
  sidebarUser: { flexDirection: "row", alignItems: "center", gap: 12 },
  sidebarAvatar: { width: 52, height: 52, borderRadius: 12, backgroundColor: "#06f7ff", justifyContent: "center", alignItems: "center" },
  sidebarUserName: { color: "#e6f7ff", fontSize: 18, fontWeight: "800" },
  sidebarUserEmail: { color: "#9aa6bf", fontSize: 13 },
  sidebarMenu: { marginTop: 18 },
  sidebarItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  sidebarItemText: { color: "#cbd5e1", fontSize: 15 },
  menuDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.04)", marginVertical: 12 },
  logoutRow: { marginTop: 6 },
  logoutText: { color: "#ff7a7a", fontWeight: "800" },

  

  /* FAB */
  fab: { position: "absolute", right: 20, bottom: 28 },
  fabGradient: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center" }
});
