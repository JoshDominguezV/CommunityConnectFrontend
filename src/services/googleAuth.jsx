import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const redirectUri = AuthSession.makeRedirectUri({
    native: "com.communityconnect.frontend:/oauthredirect",
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "927898196412-j2a1cek87o3ro1q03vdd0pc90n3ldaa7.apps.googleusercontent.com",
    iosClientId:
      "927898196412-j2a1cek87o3ro1q03vdd0pc90n3ldaa7.apps.googleusercontent.com",
    webClientId:
      "927898196412-djt7f0b3j0gpqebvc42vvbp139qg5d4j.apps.googleusercontent.com",

    redirectUri,
    scopes: ["profile", "email"],
  });

  return { request, response, promptAsync };
};

