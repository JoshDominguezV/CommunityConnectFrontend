import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "927898196412-djt7f0b3j0gpqebvc42vvbp139qg5d4j.apps.googleusercontent.com",
    iosClientId: "927898196412-djt7f0b3j0gpqebvc42vvbp139qg5d4j.apps.googleusercontent.com",
    androidClientId: "927898196412-djt7f0b3j0gpqebvc42vvbp139qg5d4j.apps.googleusercontent.com",

    // 👇 IMPORTANTE PARA EVITAR redirect_uri_mismatch
    webClientId: "927898196412-djt7f0b3j0gpqebvc42vvbp139qg5d4j.apps.googleusercontent.com",

    redirectUri:
      Platform.select({
        web: "http://localhost:8081",        // Expo Web
        android: "com.josue.app:/oauthredirect",
        ios: "com.josue.app:/oauthredirect",
      }) || "http://localhost:8081",

    responseType: "token",
  });

  return { request, response, promptAsync };
};
