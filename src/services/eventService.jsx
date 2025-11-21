import api from './api';

export const eventService = {
  // Obtener eventos próximos
  async getUpcomingEvents() {
    try {
      const response = await api.get('/events/upcoming');
      // La API devuelve {events: Array}, así que devolvemos directamente la respuesta
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Error al obtener eventos';
      throw new Error(errorMessage);
    }
  },

  // Obtener eventos pasados
  async getPastEvents() {
    try {
      const response = await api.get('/events/past');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          'Error al obtener eventos pasados';
      throw new Error(errorMessage);
    }
  },

  // Obtener evento por ID
  async getEventById(id) {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          'Error al obtener el evento';
      throw new Error(errorMessage);
    }
  },

  // Crear evento
  async createEvent(eventData) {
    try {
      const response = await api.post('/events/', eventData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          'Error al crear el evento';
      throw new Error(errorMessage);
    }
  },

  // Actualizar evento
  async updateEvent(id, eventData) {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          'Error al actualizar el evento';
      throw new Error(errorMessage);
    }
  },

  // Eliminar evento
  async deleteEvent(id) {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          'Error al eliminar el evento';
      throw new Error(errorMessage);
    }
  },

  // Registrar asistencia
  async attendEvent(userId, eventId) {
    try {
      const response = await api.post('/events/attend', {
        user_id: userId,
        event_id: eventId
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          'Error al registrar asistencia';
      throw new Error(errorMessage);
    }
  },

  // Obtener asistentes de un evento
  async getEventAttendees(eventId) {
    try {
      const response = await api.get(`/events/${eventId}/attendees`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          'Error al obtener asistentes';
      throw new Error(errorMessage);
    }
  },
};