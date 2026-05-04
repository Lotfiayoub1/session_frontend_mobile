import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { AppNavigator } from '@/navigation/AppNavigator';
import { theme } from '@/utils/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <AppProvider>
            <AppNavigator />
            <StatusBar style="light" />
          </AppProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
