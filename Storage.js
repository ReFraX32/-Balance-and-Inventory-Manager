import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const Storage = {
  saveItem: async (key, value) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      const fileUri = `${FileSystem.documentDirectory}${key}.json`;
      await FileSystem.writeAsStringAsync(fileUri, value);
    }
  },
  getItem: async (key) => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      const fileUri = `${FileSystem.documentDirectory}${key}.json`;
      return await FileSystem.readAsStringAsync(fileUri);
    }
  },
  getAllKeys: async () => {
    if (Platform.OS === 'web') {
      const keys = await AsyncStorage.getAllKeys();
      return keys.filter(key => key !== 'productData');
    } else {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      return files
        .filter(file => file.endsWith('.json') && file !== 'productData.json')
        .map(file => file.replace('.json', ''));
    }
  },
  removeItem: async (key) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      const fileUri = `${FileSystem.documentDirectory}${key}.json`;
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }
  }
};

export default Storage;