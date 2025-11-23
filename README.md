# CommunityConnect - Aplicación de Gestión de Eventos Comunitarios

<div align="center">

**Plataforma móvil para descubrir, crear y gestionar eventos comunitarios**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.24-purple.svg)](https://expo.dev/)

• [Backend](https://github.com/KrevsX/event-management.git) • [🔗 Trello Board](https://trello.com/invite/b/691ce1706f3b6e3be6bf0e82/ATTI03451bbfa4fd5b54aad02bcd44f53bce40504595/aplicacion-de-gestion-de-eventos-comunitarios) • [🎨 Diseños Mock-Ups](https://www.figma.com/design/66euKyXbzYtYLZokOleJJx/DPS?node-id=0-1&t=0S5bkxmaG97tYISF-1) • [📖 Documentación](./docs/DPS_Gestión_Eventos_Comunitarios_CommunityConnect.pdf)

</div>

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [Integrantes del Equipo](#-integrantes-del-equipo)
- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación](#-documentación)
- [Licencia](#-licencia)

---

## 🌟 Sobre el Proyecto

**CommunityConnect** es una aplicación móvil multiplataforma (Android) que permite a los usuarios descubrir eventos comunitarios, registrar su asistencia y crear nuevos eventos. La aplicación ofrece una experiencia moderna con autenticación social, interfaz glassmorphism y gestión en tiempo real.

### 🎯 Objetivos del Proyecto

- Facilitar la conexión entre organizadores y participantes de eventos
- Proporcionar una plataforma intuitiva para la gestión de eventos
- Fomentar la participación comunitaria
- Ofrecer una experiencia de usuario moderna y accesible

---

## 👥 Integrantes del Equipo

### Grupo Teórico: **[DPS941 G01T]**

| Nombre Completo | Carnet | Rol | GitHub |
|----------------|--------|-----|--------|
| **[TEC. JOSUE NAHUM DOMINGUEZ VELASQUEZ]** | [DV241624] | Frontend Developer | [@JoshDominguezV] (#) |
| **[TEC. KEVIN ARMANDO LEMUS ALAS]** | [LA242415] | Backend Developer | [@KrevsX](#) |


---

## ✨ Características

### 🔐 Autenticación
- ✅ Registro e inicio de sesión tradicional
- ✅ Login con Google OAuth 2.0
- ✅ Persistencia de sesión segura

### 📅 Gestión de Eventos
- ✅ Visualización de eventos próximos y pasados
- ✅ Creación de eventos con formulario completo
- ✅ Búsqueda en tiempo real
- ✅ Confirmación de asistencia
- ✅ Control de capacidad máxima

### 🎨 Interfaz de Usuario
- ✅ Diseño moderno con glassmorphism
- ✅ Animaciones fluidas y partículas flotantes
- ✅ Modo oscuro nativo
- ✅ Diseño responsive (móvil/tablet)
- ✅ Componentes reutilizables

### 📊 Dashboard
- ✅ Estadísticas de eventos
- ✅ Lista personalizada de eventos
- ✅ Navegación intuitiva
- ✅ Actualización pull-to-refresh

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React Native** `0.81.5` - Framework principal
- **Expo** `~54.0.24` - Plataforma de desarrollo
- **React** `19.1.0` - Biblioteca UI
- **Expo Linear Gradient** - Gradientes nativos
- **React Native Modal DateTime Picker** - Selector de fecha/hora

### Autenticación & OAuth
- **expo-auth-session** - Flujos OAuth
- **expo-web-browser** - Navegador in-app
- **@react-native-async-storage/async-storage** - Almacenamiento local
- **expo-secure-store** - Almacenamiento seguro

### Navegación & UI
- **@expo/vector-icons** - Iconos (Ionicons)
- **react-native-ui-datepicker** - Selector de fecha universal
- **dayjs** - Manejo de fechas

### HTTP & API
- **Axios** `^1.13.2` - Cliente HTTP
- **Custom API Service Layer** - Manejo centralizado de requests

### Desarrollo
- **JavaScript** `~5.9.2`
- **EAS CLI** - Build y deployment
- **Expo Dev Client** - Desarrollo nativo

---

## 📥 Instalación

### Prerrequisitos
```bash
# Node.js (v18 o superior)
node --version

# npm o yarn
npm --version

# Expo CLI (opcional, pero recomendado)
npm install -g expo-cli
```

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/JoshDominguezV/CommunityConnectFrontend.git
cd CommunityConnectFrontend
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del proyecto
cp .env.example .env
```

Editar `.env`:
```env
API_BASE_URL=http://10.0.2.2:8000
GOOGLE_WEB_CLIENT_ID=tu-google-client-id
GOOGLE_ANDROID_CLIENT_ID=tu-android-client-id
GOOGLE_IOS_CLIENT_ID=tu-ios-client-id
```

4. **Iniciar la aplicación**
```bash
# Desarrollo con Expo Go
npm start

# Android
npm run android

# iOS (solo macOS)
npm run ios

# Web
npm run web
```

---

## ⚙️ Configuración

### 🔵 Configurar Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto o seleccionar uno existente
3. Habilitar **Google+ API**
4. Crear credenciales OAuth 2.0:
   - **Tipo:** Multiplataforma
   - **URIs de redirección autorizados:**
     - `https://auth.expo.io/@tu-usuario/CommunityConnectFrontend`
     - `com.communityconnect.frontend:/oauthredirect`

5. Copiar el `Client ID` y agregarlo al archivo `src/services/googleAuth.jsx`

### 📱 Configurar URI Scheme

Editar `app.json`:
```json
{
  "expo": {
    "scheme": "com.communityconnect.frontend",
    "ios": {
      "bundleIdentifier": "com.communityconnect.frontend"
    },
    "android": {
      "package": "com.communityconnect.frontend"
    }
  }
}
```

### 🔧 Configurar Backend URL

Para desarrollo local:

- **Android Emulator:** `http://10.0.2.2:8000`
- **iOS Simulator:** `http://localhost:8000`
- **Dispositivo físico:** `http://TU_IP_LOCAL:8000`

Editar `src/services/api.jsx`:
```javascript
const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8000' 
  : 'http://localhost:8000';
```

---

## 📁 Estructura del Proyecto
```
CommunityConnectFrontend/
├── assets/                    # Recursos estáticos (imágenes, fuentes)
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
│
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── CategoryFilter.jsx
│   │   ├── EventCard.jsx
│   │   ├── FloatingParticles.jsx
│   │   ├── GlassCard.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └──StatsRow.jsx
│   │
│   ├── navigation/             
│   │   AppNavigatior.js
│   │
│   ├── screens/             # Pantallas principales
│   │   ├── AuthScreen.jsx
│   │   ├── DashboardScreen.jsx
│   │   ├── EventsScreen.jsx
│   │   └── CreateEventScreen.jsx
│   │
│   ├── services/            # Lógica de negocio y API
│   │   ├── api.jsx          # Configuración Axios
│   │   ├── authService.jsx  # Servicios de autenticación
│   │   ├── eventService.jsx # Servicios de eventos
│   │   └── googleAuth.jsx   # Configuración Google OAuth
│   │
│   ├── styles/              # Estilos globales
│   │   ├── authStyles.jsx
│   │   └── dashboardStyles.jsx
│   │
│   └── navigation/          # Configuración de navegación
│       └── AppNavigator.js
│
├── docs/                    # 📄 Documentación del proyecto
│   └── DPS_Gestión_Eventos_Comunitarios_CommunityConnect.pdf  # Guía completa y manual de usuario
│
├── App.jsx                  # Componente principal
├── index.ts                 # Punto de entrada
├── app.json                 # Configuración Expo
├── eas.json                 # Configuración EAS Build
├── package.json
├── tsconfig.json
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Scripts Disponibles
```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en Web
npm run web

# Limpiar caché
expo start -c

# Build de producción (EAS)
eas build --platform android
eas build --platform ios
```

---

## 📖 Documentación

La documentación completa del proyecto, incluyendo:

- 📘 **Guía de Usuario:** Instrucciones paso a paso para usar la aplicación
- 🔧 **Manual de Instalación:** Configuración detallada del entorno
- 🏗️ **Arquitectura del Sistema:** Diagramas y explicaciones técnicas
- 🎨 **Guía de Diseño:** Tokens de diseño y componentes UI

**Se encuentra disponible en la carpeta:** [`/docs`](./docs/DPS_Gestión_Eventos_Comunitarios_CommunityConnect.pdf)


---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT License**.
```
MIT License

Copyright (c) 2024 CommunityConnect

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Ver el archivo [`LICENSE`](./LICENSE) para más detalles.

### ¿Por qué MIT License?

- ✅ Permisiva y flexible
- ✅ Permite uso comercial
- ✅ Compatible con otros proyectos open source
- ✅ Reconocida internacionalmente

---

## 🔗 Recursos Adicionales

### 🎯 Gestión del Proyecto
- **[Tablero Trello](https://trello.com/invite/b/691ce1706f3b6e3be6bf0e82/ATTI03451bbfa4fd5b54aad02bcd44f53bce40504595/aplicacion-de-gestion-de-eventos-comunitarios)** - Seguimiento de tareas y sprints

### 🎨 Diseño
- **[Mock-Ups en Figma](https://www.figma.com/design/66euKyXbzYtYLZokOleJJx/DPS?node-id=0-1&t=0S5bkxmaG97tYISF-1)** - Prototipos y diseños de la aplicación
- **Paleta de Colores:**
  - Primary: `#06b6d4` (Cyan)
  - Secondary: `#7e22ce` (Purple)
  - Background: `#1e293b` (Slate)

