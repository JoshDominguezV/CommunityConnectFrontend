import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';

// Configuración de Facebook OAuth
export const useFacebookAuth = () => {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    // REEMPLAZA CON TU APP ID DE FACEBOOK
    clientId: 'TU_FACEBOOK_APP_ID',
    scopes: ['public_profile', 'email'],
  });

  return {
    request,
    response,
    promptAsync,
  };
};

// Función para verificar el token de Facebook
export const verifyFacebookToken = async (accessToken) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    
    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    throw new Error('Error verificando token de Facebook');
  }
};