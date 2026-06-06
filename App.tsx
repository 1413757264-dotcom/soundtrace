import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SongDetailScreen from './src/screens/SongDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const theme = { ...DefaultTheme, dark: true, colors: { ...DefaultTheme.colors, background: '#000' } };

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = { '首页': '🏠', '搜索': '🔍', '发现': '🧬', '我的': '👤' };
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{icons[label] || '●'}</Text>;
}

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {() => (
            <Tab.Navigator screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: { backgroundColor: '#111', borderTopColor: '#222', height: 56 },
              tabBarActiveTintColor: '#FF6B35',
              tabBarInactiveTintColor: '#666',
              tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
            })}>
              <Tab.Screen name="首页" component={HomeScreen} />
              <Tab.Screen name="搜索" component={SearchScreen} />
              <Tab.Screen name="发现" component={ProfileScreen} />
              <Tab.Screen name="我的" component={ProfileScreen} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="SongDetail" component={SongDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
