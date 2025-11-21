import api from "./api";

const API_URL = api.defaults.baseURL;

export const authService = {
  // ================================
  // 🔐 REGISTRO
  // ================================
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Error de conexión";
      throw new Error(message);
    }
  },

  // ================================
  // 🔑 LOGIN NORMAL
  // ================================
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data; // Devuelve: user_id, username, email, full_name, role, access_token
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Credenciales incorrectas";
      throw new Error(message);
    }
  },

  // ================================
  // 🔵 LOGIN CON GOOGLE (CORREGIDO)
  // ================================
  async loginWithGoogle(
    accessToken,
    role = "participant",
    platform = "mobile"
  ) {
    try {
      const response = await fetch(`${API_URL}/oauth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          role,
          platform,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Google OAuth error");
      }

      return data; // Retorna user info + token
    } catch (error) {
      console.log("❌ Error en Google OAuth:", error);
      throw error;
    }
  },

  // ================================
  // 🔵 LOGIN CON FACEBOOK (OPCIONAL)
  // ================================
  async loginWithFacebook(accessToken, role = "participant") {
    try {
      const response = await fetch(`${API_URL}/oauth/facebook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Facebook OAuth error");
      }

      return data;
    } catch (error) {
      console.log("❌ Error en Facebook OAuth:", error);
      throw error;
    }
  },

  // ================================
  // 🔍 VERIFICAR TOKEN
  // ================================
  async verifyToken(token) {
    try {
      const response = await api.get("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch {
      throw new Error("Token inválido");
    }
  },
};
