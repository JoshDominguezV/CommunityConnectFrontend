import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  // Para desarrollo en Expo Go
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "com.communityconnect.frontend",
    // Opcional: forzar el uso del esquema en desarrollo
    // useProxy: false
  });

  console.log("👉 Redirect URI:", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "927898196412-sj18979sqoc4cdl6faanp70uepolsqe1.apps.googleusercontent.com",
    expoClientId: "927898196412-sj18979sqoc4cdl6faanp70uepolsqe1.apps.googleusercontent.com",
    iosClientId: "927898196412-sj18979sqoc4cdl6faanp70uepolsqe1.apps.googleusercontent.com",
    webClientId: "927898196412-sj18979sqoc4cdl6faanp70uepolsqe1.apps.googleusercontent.com",
    
    redirectUri,
    responseType: "token",
  });

  return { request, response, promptAsync };
};