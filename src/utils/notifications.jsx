// /src/utils/notifications.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Handler global: cómo se muestran las notificaciones cuando la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Registrar el dispositivo y obtener el push token (si luego quieres mandarlo al backend)
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log("🧪 Notificaciones solo en dispositivo físico");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Permisos de notificación denegados");
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;
  console.log("📲 Expo push token:", token);

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FFFFFF",
    });
  }

  return token;
}

// Programa notificaciones locales de recordatorio para un evento
// - 24 horas antes
// - 1 hora antes
export async function scheduleEventReminders(event) {
  try {
    if (!event?.date) return;

    const eventDate = new Date(event.date);
    const now = new Date();

    if (eventDate <= now) {
      console.log("⚠️ Evento ya pasó, no se programan recordatorios");
      return;
    }

    const title = event.title || "Recordatorio de evento";
    const location = event.location || "Ubicación por definir";

    // 24 horas antes
    const dayBefore = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);

    if (dayBefore > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📅 Mañana tienes un evento",
          body: `${title} en ${location}`,
          data: { eventId: event.id },
        },
        trigger: dayBefore,
      });
      console.log("⏰ Notificación 24h programada:", dayBefore.toISOString());
    }

    // 1 hora antes
    const oneHourBefore = new Date(eventDate.getTime() - 60 * 60 * 1000);

    if (oneHourBefore > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ Tu evento comienza en 1 hora",
          body: `${title} en ${location}`,
          data: { eventId: event.id },
        },
        trigger: oneHourBefore,
      });
      console.log("⏰ Notificación 1h programada:", oneHourBefore.toISOString());
    }
  } catch (error) {
    console.log("❌ Error al programar recordatorios:", error);
  }
}
