import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { SplashScreen } from './src/components/common/SplashScreen';
import { hasOnboarded } from './src/services/storage';
import { checkBackendHealth } from './src/services/api/client';
import { Colors } from './src/constants/theme';

export default function App() {
  const [phase, setPhase] = useState<'splash' | 'loading' | 'onboarding' | 'app'>('splash');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSplashDone = useCallback(() => {
    setPhase('loading');
    Promise.all([hasOnboarded(), checkBackendHealth()]).then(([onboarded, backendOk]) => {
      if (backendOk) console.log('🔗 后端已连接');
      setShowOnboarding(!onboarded);
      setPhase(onboarded ? 'app' : 'onboarding');
    });
  }, []);

  if (phase === 'splash') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <SplashScreen onFinish={handleSplashDone} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (phase === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {showOnboarding ? (
          <OnboardingScreen onDone={() => { setShowOnboarding(false); setPhase('app'); }} />
        ) : (
          <RootNavigator />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
