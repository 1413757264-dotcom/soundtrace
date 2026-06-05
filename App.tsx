import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from './src/constants/theme';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import SongDetailScreen from './src/screens/SongDetailScreen';
import SampleDeconstructionScreen from './src/screens/SampleDeconstructionScreen';
import ProducerGraphScreen from './src/screens/ProducerGraphScreen';
import ArtistDetailScreen from './src/screens/ArtistDetailScreen';
import RecommendationsScreen from './src/screens/RecommendationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MiniPlayer from './src/components/player/MiniPlayer';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const DiscoverStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const theme = { ...DefaultTheme, dark: true, colors: { ...DefaultTheme.colors, background: Colors.bg } };
const s = { headerShown: false, contentStyle: { backgroundColor: Colors.bg } };

function HomeStackNav() {
  return <HomeStack.Navigator screenOptions={s}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="SongDetail" component={SongDetailScreen} />
    <HomeStack.Screen name="SampleDeconstruction" component={SampleDeconstructionScreen} />
    <HomeStack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
  </HomeStack.Navigator>;
}

function SearchStackNav() {
  return <SearchStack.Navigator screenOptions={s}>
    <SearchStack.Screen name="SearchMain" component={SearchScreen} />
    <SearchStack.Screen name="SearchResults" component={SearchResultsScreen} />
    <SearchStack.Screen name="SongDetail" component={SongDetailScreen} />
    <SearchStack.Screen name="ProducerGraph" component={ProducerGraphScreen} />
  </SearchStack.Navigator>;
}

function MainTabs() {
  return <Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarStyle: { backgroundColor: Colors.tabBarBg, borderTopColor: Colors.divider, height: 56 },
    tabBarActiveTintColor: Colors.tabActive,
    tabBarInactiveTintColor: Colors.tabInactive,
  }}>
    <Tab.Screen name="HomeTab" component={HomeStackNav} options={{ tabBarLabel: '首页' }} />
    <Tab.Screen name="SearchTab" component={SearchStackNav} options={{ tabBarLabel: '搜索' }} />
    <Tab.Screen name="DiscoverTab" component={RecommendationsScreen} options={{ tabBarLabel: '发现' }} />
    <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: '我的' }} />
  </Tab.Navigator>;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer theme={theme}>
          <RootStack.Navigator screenOptions={s}>
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen name="SongDetail" component={SongDetailScreen} />
            <RootStack.Screen name="SampleDeconstruction" component={SampleDeconstructionScreen} />
            <RootStack.Screen name="ProducerGraph" component={ProducerGraphScreen} />
          </RootStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
