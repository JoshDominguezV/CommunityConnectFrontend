// /src/services/eventService.js
import api from "./api";

export const eventService = {
  // 🔹 Obtener TODOS los eventos (próximos + pasados)
  async getAllEvents() {
    try {
      console.log("🔄 Making API Request: GET /events/upcoming + /events/past");

      const [upcomingRes, pastRes] = await Promise.all([
        api.get("/events/upcoming"),
        api.get("/events/past"),
      ]);

      const upcoming = upcomingRes.data?.events ?? upcomingRes.data ?? [];
      const past = pastRes.data?.events ?? pastRes.data ?? [];

      console.log("✅ Combined events:", {
        upcoming: upcoming.length,
        past: past.length,
      });

      return [...upcoming, ...past];
    } catch (error) {
      console.log("❌ Error getAllEvents:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Error al obtener eventos";
      throw new Error(errorMessage);
    }
  },

  // 🔹 Obtener eventos próximos
  async getUpcomingEvents() {
    try {
      console.log("🔄 Making API Request: GET /events/upcoming");
      const response = await api.get("/events/upcoming");
      console.log("✅ API Response /events/upcoming:", response.status);
      return response.data;
    } catch (error) {
      console.log("❌ Error /events/upcoming:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Error al obtener eventos";
      throw new Error(errorMessage);
    }
  },

  // 🔹 Obtener eventos pasados
  async getPastEvents() {
    try {
      console.log("🔄 Making API Request: GET /events/past");
      const response = await api.get("/events/past");
      console.log("✅ API Response /events/past:", response.status);
      return response.data;
    } catch (error) {
      console.log("❌ Error /events/past:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage =
        error.response?.data?.detail || "Error al obtener eventos pasados";
      throw new Error(errorMessage);
    }
  },

  // 🔹 Obtener evento por ID
  async getEventById(id) {
    try {
      console.log("🔄 GET /events/" + id);
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.log("❌ Error getEventById:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage =
        error.response?.data?.detail || "Error al obtener el evento";
      throw new Error(errorMessage);
    }
  },

  // 🔹 Crear evento
  async createEvent(eventData) {
    try {
      console.log("🔄 POST /events/ payload:", eventData);
      const response = await api.post("/events/", eventData);
      console.log("✅ Evento creado:", response.data?.id || response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error createEvent:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage =
        error.response?.data?.detail || "Error al crear el evento";
      throw new Error(errorMessage);
    }
  },

  // 🔹 Actualizar evento
  async updateEvent(id, eventData) {
    try {
      console.log("🔄 PUT /events/" + id, "payload:", eventData);
      const response = await api.put(`/events/${id}`, eventData);
      console.log("✅ Evento actualizado:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error updateEvent:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage =
        error.response?.data?.detail || "Error al actualizar el evento";
      throw new Error(errorMessage);
    }
  },

  // 🔹 Eliminar evento
  async deleteEvent(id) {
    try {
      console.log("🔄 DELETE /events/" + id);
      const response = await api.delete(`/events/${id}`);
      console.log("✅ Evento eliminado:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error deleteEvent:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage =
        error.response?.data?.detail || "Error al eliminar el evento";
      throw new Error(errorMessage);
    }
  },

  // 🔹 Registrar asistencia
  async attendEvent(userId, eventId) {
    try {
      const payload = { user_id: userId, event_id: eventId };
      console.log("🔄 Making API Request: POST /events/attend", payload);

      const response = await api.post("/events/attend", payload);

      console.log("✅ API Response /events/attend:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error) {
      console.log("❌ API Error /events/attend:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.detail || "Error al registrar asistencia";
      throw new Error(errorMessage);
    }
  },

  // 🔹 Obtener asistentes de un evento
  async getEventAttendees(eventId) {
    try {
      console.log("🔄 GET /events/" + eventId + "/attendees");
      const response = await api.get(`/events/${eventId}/attendees`);
      return response.data;
    } catch (error) {
      console.log("❌ Error getEventAttendees:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage =
        error.response?.data?.detail || "Error al obtener asistentes";
      throw new Error(errorMessage);
    }
  },

  // ========================================
  // 💬 COMMENTS
  // ========================================

  // Obtener todos los comentarios de un evento
  async getEventComments(eventId) {
    try {
      console.log("🔄 GET /social/events/" + eventId + "/comments");
      const response = await api.get(`/social/events/${eventId}/comments`);
      return response.data;
    } catch (error) {
      console.log("❌ Error getEventComments:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al obtener los comentarios");
    }
  },

  // Crear comentario (con rating opcional, puede ser 0)
  async addComment(eventId, userId, content, rating = null) {
    try {
      const payload = {
        user_id: userId,
        event_id: eventId,
        content,
      };
      if (rating !== null) {
        payload.rating = rating;
      }

      console.log("🔄 POST /social/comments", payload);
      const response = await api.post("/social/comments", payload);
      console.log("✅ Comentario creado:", response.data);
      return response.data;
    } catch (error) {
      console.log("❌ Error addComment:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al agregar comentario");
    }
  },

  // Actualizar comentario (contenido y/o rating)
  async updateComment(commentId, { content, rating }) {
    try {
      const payload = {};
      if (content !== undefined) payload.content = content;
      if (rating !== undefined) payload.rating = rating;

      console.log("🔄 PUT /social/comments/" + commentId, payload);
      const response = await api.put(`/social/comments/${commentId}`, payload);
      return response.data;
    } catch (error) {
      console.log("❌ Error updateComment:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al actualizar comentario");
    }
  },

  // Eliminar comentario
  async deleteComment(commentId) {
    try {
      console.log("🔄 DELETE /social/comments/" + commentId);
      const response = await api.delete(`/social/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.log("❌ Error deleteComment:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al eliminar comentario");
    }
  },

  // Obtener todos los comentarios de un usuario
  async getUserComments(userId) {
    try {
      console.log("🔄 GET /social/users/" + userId + "/comments");
      const response = await api.get(`/social/users/${userId}/comments`);
      return response.data;
    } catch (error) {
      console.log("❌ Error getUserComments:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al obtener comentarios del usuario");
    }
  },

  // ========================================
  // 🔗 SHARES
  // ========================================

  async shareEvent(eventId, shareType = "social_media", recipient = null) {
    try {
      const payload = { event_id: eventId, share_type: shareType, recipient };
      console.log("🔄 POST /social/share", payload);
      const response = await api.post("/social/share", payload);
      return response.data;
    } catch (error) {
      console.log("❌ Error shareEvent:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al registrar compartición del evento");
    }
  },

  async getEventShares(eventId) {
    try {
      console.log("🔄 GET /social/events/" + eventId + "/shares");
      const response = await api.get(`/social/events/${eventId}/shares`);
      return response.data;
    } catch (error) {
      console.log("❌ Error getEventShares:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al obtener comparticiones del evento");
    }
  },

  // ========================================
  // 📊 STATS
  // ========================================

  async getUserStats(userId) {
    try {
      console.log("🔄 GET /stats/user/" + userId);
      const response = await api.get(`/stats/user/${userId}`);
      return response.data;
    } catch (error) {
      console.log("❌ Error getUserStats:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al obtener estadísticas del usuario");
    }
  },

  async getEventStats(eventId) {
    try {
      console.log("🔄 GET /stats/event/" + eventId);
      const response = await api.get(`/stats/event/${eventId}`);
      return response.data;
    } catch (error) {
      console.log("❌ Error getEventStats:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al obtener estadísticas del evento");
    }
  },

  // ========================================
  // 👤 USERS (para mostrar nombre en comentarios)
  // ========================================

  async getAllUsers() {
    try {
      console.log("🔄 GET /auth/users");
      const response = await api.get("/auth/users");
      return response.data;
    } catch (error) {
      console.log("❌ Error getAllUsers:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al obtener usuarios");
    }
  },

  async getUserById(userId) {
    try {
      console.log("🔄 GET /auth/users/" + userId);
      const response = await api.get(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      console.log("❌ Error getUserById:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Error al obtener usuario");
    }
  },


  // ========================================
  // 🔔 NOTIFICACIONES
  // ========================================

  getUserNotifications: async (userId) => {
    const res = await api.get(`/social/notifications/user/${userId}`);
    return res.data;
  },

  markNotificationAsRead: async (notificationId) => {
    return api.post("/social/notifications/mark-as-read", {
      notification_id: notificationId,
    });
  },

  markMultipleNotificationsAsRead: async (notificationIds) => {
    return api.post("/social/notifications/mark-multiple-as-read", {
      notification_ids: notificationIds,
    });
  },

  markAllNotificationsAsRead: async (userId) => {
    return api.post(`/social/notifications/mark-all-as-read/${userId}`);
  },



};
