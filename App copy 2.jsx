import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);

  const redirectUri = "com.communityconnect.frontend:/oauthredirect";

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "927898196412-j2a1cek87o3ro1q03vdd0pc90n3ldaa7.apps.googleusercontent.com", // 👈 Reemplazar
    webClientId:
      "927898196412-djt7f0b3j0gpqebvc42vvbp139qg5d4j.apps.googleusercontent.com", // 👈 Reemplazar
    redirectUri,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    handleEffect();
  }, [response]);

  async function handleEffect() {
    const storedUser = await getLocalUser();

    if (!storedUser) {
      if (response?.type === "success") {
        const accessToken = response.authentication.accessToken;
        getUserInfo(accessToken);
      }
    } else {
      setUserInfo(storedUser);
    }
  }

  const getLocalUser = async () => {
    const json = await AsyncStorage.getItem("@user");
    if (!json) return null;
    return JSON.parse(json);
  };

  const getUserInfo = async (token) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await res.json();

      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.log("Error obteniendo userinfo", error);
    }
  };

  return (
    <View style={styles.container}>
      {!userInfo ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      ) : (
        <View style={styles.card}>
          {userInfo?.picture && (
            <Image source={{ uri: userInfo.picture }} style={styles.image} />
          )}
          <Text style={styles.text}>Email: {userInfo.email}</Text>
          <Text style={styles.text}>
            Verificado: {userInfo.email_verified ? "Sí" : "No"}
          </Text>
          <Text style={styles.text}>Nombre: {userInfo.name}</Text>
        </View>
      )}

      <Button
        title="Eliminar usuario guardado"
        onPress={async () => {
          await AsyncStorage.removeItem("@user");
          setUserInfo(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
