// /src/utils/shareUtils.js
import * as Sharing from "expo-sharing";
import * as MailComposer from "expo-mail-composer";
import { Share } from "react-native";
import { eventService } from "../services/eventService";

export async function shareEventSocial(event) {
  const message = `
📣 ¡Mira este evento!  
📌 ${event.title}  
📅 ${new Date(event.date).toLocaleString()}  
📍 ${event.location}  
ℹ️ ${event.description}
`;

  try {
    await Share.share({ message });

    await eventService.shareEvent(event.id, "social_media");

    console.log("✅ Evento compartido por redes");
  } catch (error) {
    console.log("❌ Error compartiendo:", error);
  }
}

export async function shareEventByEmail(event, recipientEmail) {
  const message = `
Evento: ${event.title}
Fecha: ${new Date(event.date).toLocaleString()}
Ubicación: ${event.location}

Descripción:
${event.description}
  `;

  try {
    const result = await MailComposer.composeAsync({
      recipients: [recipientEmail],
      subject: `Te comparto este evento: ${event.title}`,
      body: message,
    });

    if (result.status === "sent") {
      await eventService.shareEvent(event.id, "email", recipientEmail);
      console.log("📧 Compartido por email");
    }
  } catch (error) {
    console.log("❌ Error email:", error);
  }
}
