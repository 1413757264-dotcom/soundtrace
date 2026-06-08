import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SongDetailScreen from './src/screens/SongDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const theme = { ...DefaultTheme, dark: true, colors: { ...DefaultTheme.colors, background: '#050505' } };

function TabBarIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 6 }}>
      <Text style={{
        color: focused ? '#CC3333' : '#333',
        fontSize: 11, fontWeight: '800', letterSpacing: 2,
      }}>
        {label}
      </Text>
      {focused && (
        <View style={{
          width: 4, height: 4, borderRadius: 2,
          backgroundColor: '#CC3333', marginTop: 4,
        }} />
      )}
    </View>
  );
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
              tabBarStyle: {
                backgroundColor: '#080808', borderTopColor: '#111', height: 52,
                borderTopWidth: 0,
              },
              tabBarActiveTintColor: '#CC3333',
              tabBarInactiveTintColor: '#333',
              tabBarIcon: ({ focused }) => <TabBarIcon label={route.name} focused={focused} />,
              tabBarLabel: () => null,
            })}>
              <Tab.Screen name="ARCHIVE" component={HomeScreen} />
              <Tab.Screen name="TRACE" component={SearchScreen} />
              <Tab.Screen name="DATA" component={ProfileScreen} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="SongDetail" component={SongDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
