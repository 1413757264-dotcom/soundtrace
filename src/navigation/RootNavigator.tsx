import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { ToastRoot } from '../components/common/toast';
import { NetworkStatus } from '../components/common/NetworkStatus';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import SongDetailScreen from '../screens/SongDetailScreen';
import SampleDeconstructionScreen from '../screens/SampleDeconstructionScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MiniPlayer from '../components/player/MiniPlayer';
import CustomTabBar from '../components/common/CustomTabBar';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const DiscoverStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const navTheme = { ...DefaultTheme, dark: true, colors: { ...DefaultTheme.colors, background: Colors.bg } };
const screenOpts = { headerShown: false, contentStyle: { backgroundColor: Colors.bg }, animation: 'fade_from_bottom' as const };

function HomeStackNav() {
  return <HomeStack.Navigator screenOptions={screenOpts}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="SongDetail" component={SongDetailScreen} />
    <HomeStack.Screen name="SampleDeconstruction" component={SampleDeconstructionScreen} />
    <HomeStack.Screen name="ArtistDetail" component={require('../screens/ArtistDetailScreen').default} />
  </HomeStack.Navigator>;
}

const ArtistDetailScreen = require('../screens/ArtistDetailScreen').default;

function SearchStackNav() {
  return <SearchStack.Navigator screenOptions={screenOpts}>
    <SearchStack.Screen name="Search" component={SearchScreen} />
    <SearchStack.Screen name="SearchResults" component={SearchResultsScreen} />
    <SearchStack.Screen name="SongDetail" component={SongDetailScreen} />
  </SearchStack.Navigator>;
}

function DiscoverStackNav() {
  return <DiscoverStack.Navigator screenOptions={screenOpts}>
    <DiscoverStack.Screen name="Discover" component={RecommendationsScreen} />
    <DiscoverStack.Screen name="SongDetail" component={SongDetailScreen} />
    <DiscoverStack.Screen name="SampleDeconstruction" component={SampleDeconstructionScreen} />
  </DiscoverStack.Navigator>;
}

function ProfileStackNav() {
  return <ProfileStack.Navigator screenOptions={screenOpts}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
  </ProfileStack.Navigator>;
}

function MainTabs() {
  return <Tab.Navigator
    tabBar={(props: any) => <CustomTabBar {...props} onRecordPress={() => props.navigation.navigate('SearchTab')} />}
    screenOptions={{ headerShown: false }}>
    <Tab.Screen name="HomeTab" component={HomeStackNav} options={{ tabBarLabel: '首页' }} />
    <Tab.Screen name="SearchTab" component={SearchStackNav} options={{ tabBarLabel: '搜索' }} />
    <Tab.Screen name="DiscoverTab" component={DiscoverStackNav} options={{ tabBarLabel: '发现' }} />
    <Tab.Screen name="ProfileTab" component={ProfileStackNav} options={{ tabBarLabel: '我的' }} />
  </Tab.Navigator>;
}

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <View style={root.container}>
        <RootStack.Navigator screenOptions={screenOpts}>
          <RootStack.Screen name="MainTabs" component={MainTabs} />
          <RootStack.Screen name="SongDetail" component={SongDetailScreen} />
          <RootStack.Screen name="SampleDeconstruction" component={SampleDeconstructionScreen} />
          <RootStack.Screen name="ProducerGraph" component={require('../screens/ProducerGraphScreen').default} />
          <RootStack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
          <RootStack.Screen name="FullPlayer" component={require('../screens/FullPlayerScreen').default} />
          <RootStack.Screen name="Settings" component={SettingsScreen} />
        </RootStack.Navigator>
        <NetworkStatus />
        <MiniPlayer />
        <ToastRoot />
      </View>
    </NavigationContainer>
  );
}

const root = StyleSheet.create({ container: { flex: 1, backgroundColor: Colors.bg } });
