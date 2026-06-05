import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabParamList } from './types';
import { Colors, Typography, Radius, Spacing } from '../constants/theme';
import { ErrorBoundary } from '../components/common/ux';
import { ToastRoot } from '../components/common/toast';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import SongDetailScreen from '../screens/SongDetailScreen';
import SampleDeconstructionScreen from '../screens/SampleDeconstructionScreen';
import SampleComparisonScreen from '../screens/SampleComparisonScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import ProducerGraphScreen from '../screens/ProducerGraphScreen';
import ArtistDetailScreen from '../screens/ArtistDetailScreen';
import FullPlayerScreen from '../screens/FullPlayerScreen';
import PlayQueueScreen from '../screens/PlayQueueScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MiniPlayer from '../components/player/MiniPlayer';
import CustomTabBar from '../components/common/CustomTabBar';
import { NetworkStatus } from '../components/common/NetworkStatus';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const DiscoverStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Dark navigation theme
const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: { ...DefaultTheme.colors, background: Colors.bg, card: Colors.bg, text: Colors.textPrimary, border: Colors.divider },
};

const stackOpts = {
  headerShown: false,
  contentStyle: { backgroundColor: Colors.bg },
  animation: 'fade_from_bottom' as const,
  animationDuration: 280,
};

// ─── Stack Navigators ─────────────────────────────────

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={stackOpts}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="SongDetail" component={SongDetailScreen} />
      <HomeStack.Screen name="SampleDeconstruction" component={SampleDeconstructionScreen} />
      <HomeStack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
    </HomeStack.Navigator>
  );
}
function SearchStackNav() {
  return (
    <SearchStack.Navigator screenOptions={stackOpts}>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen name="SearchResults" component={SearchResultsScreen} />
      <SearchStack.Screen name="SongDetail" component={SongDetailScreen} />
      <SearchStack.Screen name="ProducerGraph" component={ProducerGraphScreen} />
    </SearchStack.Navigator>
  );
}
function DiscoverStackNav() {
  return (
    <DiscoverStack.Navigator screenOptions={stackOpts}>
      <DiscoverStack.Screen name="Discover" component={RecommendationsScreen} />
      <DiscoverStack.Screen name="SongDetail" component={SongDetailScreen} />
      <DiscoverStack.Screen name="SampleDeconstruction" component={SampleDeconstructionScreen} />
    </DiscoverStack.Navigator>
  );
}
function ProfileStackNav() {
  return (
    <ProfileStack.Navigator screenOptions={stackOpts}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
}

// ─── Main Tabs ────────────────────────────────────────

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          onRecordPress={() => {
            // Navigate to search tab with audio mode
            props.navigation.navigate('SearchTab', { screen: 'Search' });
          }}
        />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNav} options={{ tabBarLabel: '首页' }} />
      <Tab.Screen name="SearchTab" component={SearchStackNav} options={{ tabBarLabel: '搜索' }} />
      <Tab.Screen name="DiscoverTab" component={DiscoverStackNav} options={{ tabBarLabel: '发现' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNav} options={{ tabBarLabel: '我的' }} />
    </Tab.Navigator>
  );
}

// ─── Root ─────────────────────────────────────────────

export default function RootNavigator() {
  return (
    <ErrorBoundary>
      <NavigationContainer theme={navTheme}>
        <View style={root.container}>
          <RootStack.Navigator screenOptions={stackOpts}>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen name="SongDetail" component={SongDetailScreen} />
            <RootStack.Screen name="SampleDeconstruction" component={SampleDeconstructionScreen} />
            <RootStack.Screen name="SampleComparison" component={SampleComparisonScreen} />
            <RootStack.Screen name="ProducerGraph" component={ProducerGraphScreen} />
            <RootStack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
            <RootStack.Screen name="FullPlayer" component={FullPlayerScreen} options={{ animation: 'fade_from_bottom', animationDuration: 350 }} />
            <RootStack.Screen name="PlayQueue" component={PlayQueueScreen} />
            <RootStack.Screen name="Settings" component={SettingsScreen} />
          </RootStack.Navigator>
          <NetworkStatus />
          <MiniPlayer />
          <ToastRoot />
        </View>
      </NavigationContainer>
    </ErrorBoundary>
  );
}

const root = StyleSheet.create({ container: { flex: 1, backgroundColor: Colors.bg } });
