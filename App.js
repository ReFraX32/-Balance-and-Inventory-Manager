import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, View } from 'react-native';
import MainScreen from './MainScreen';
import Menu from './Menu';
import * as ScreenOrientation from 'expo-screen-orientation';
import { SettingsProvider, useTheme } from './SettingsContext';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F5' }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Menu" component={Menu} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const App = () => {
  useEffect(() => {
    async function setupScreen() {
      await ScreenOrientation.unlockAsync();
      StatusBar.setHidden(true);
    }
    setupScreen();

    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  return (
    <SettingsProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppContent />
      </GestureHandlerRootView>
    </SettingsProvider>
  );
};

export default App;