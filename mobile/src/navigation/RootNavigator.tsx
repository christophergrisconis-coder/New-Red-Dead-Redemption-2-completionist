import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { MapScreen } from '../screens/MapScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { theme } from '../theme/theme';
import { useProgress } from '../lib/progress';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const NavTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.bg,
    card: theme.colors.bgElev,
    border: theme.colors.border,
    primary: theme.colors.brass,
    text: theme.colors.parchment,
    notification: theme.colors.accent,
  },
};

function icon(glyph: string) {
  return ({ color }: { color: string }) => (
    <Text style={{ fontSize: 20, color }}>{glyph}</Text>
  );
}

function HomeTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.bgElev },
        headerTitleStyle: { color: theme.colors.parchment, fontFamily: 'Georgia' },
        tabBarStyle: { backgroundColor: theme.colors.bgElev, borderTopColor: theme.colors.border },
        tabBarActiveTintColor: theme.colors.brass,
        tabBarInactiveTintColor: theme.colors.muted,
      }}
    >
      <Tabs.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: icon('★') }} />
      <Tabs.Screen name="Map" component={MapScreen} options={{ tabBarIcon: icon('🗺') }} />
      <Tabs.Screen name="Settings" component={SettingsScreen} options={{ title: 'Progress', tabBarIcon: icon('⚙') }} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const hydrate = useProgress((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <NavigationContainer theme={NavTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.bgElev },
          headerTintColor: theme.colors.parchment,
          headerTitleStyle: { color: theme.colors.parchment, fontFamily: 'Georgia' },
          contentStyle: { backgroundColor: theme.colors.bg },
        }}
      >
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
