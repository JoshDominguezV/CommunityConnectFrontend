// /src/navigation/AppNavigator.jsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import DashboardScreen from "../screens/DashboardScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import LicenseScreen from "../screens/LicenseScreen";

<Stack.Screen name="License" component={LicenseScreen} />

const Stack = createStackNavigator();

export default function AppNavigator({ user, onLogout }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Dashboard"
          children={(props) => (
            <DashboardScreen {...props} user={user} onLogout={onLogout} />
          )}
        />

        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
