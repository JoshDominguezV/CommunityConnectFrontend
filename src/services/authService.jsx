// /src/services/authService.js
import api from "./api";

const API_URL = api.defaults.baseURL;

export const authService = {

  async register(userData) {
    const res = await api.post("/auth/register", userData);
    return res.data;
  },

  async login(credentials) {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },

  async loginWithGoogle(accessToken, role = "participant", platform = "mobile") {
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
    if (!response.ok) throw new Error(data.detail || "Google OAuth error");

    return data;
  },

  async verifyToken(token) {
    const response = await api.get("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },
};
