import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();
const ThemeContext = createContext();
const ConversionModeContext = createContext();
const CurrencySymbolContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [conversionMode, setConversionMode] = useState('point');
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    saveSettings();
  }, [language, theme, conversionMode, currencySymbol]);

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedConversionMode = await AsyncStorage.getItem('conversionMode');
      const savedCurrencySymbol = await AsyncStorage.getItem('currencySymbol');

      if (savedLanguage) setLanguage(savedLanguage);
      if (savedTheme) setTheme(savedTheme);
      if (savedConversionMode) setConversionMode(savedConversionMode);
      if (savedCurrencySymbol) setCurrencySymbol(savedCurrencySymbol);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('language', language);
      await AsyncStorage.setItem('theme', theme);
      await AsyncStorage.setItem('conversionMode', conversionMode);
      await AsyncStorage.setItem('currencySymbol', currencySymbol);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <ConversionModeContext.Provider value={{ conversionMode, setConversionMode }}>
          <CurrencySymbolContext.Provider value={{ currencySymbol, setCurrencySymbol }}>
            {children}
          </CurrencySymbolContext.Provider>
        </ConversionModeContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export const useTheme = () => useContext(ThemeContext);
export const useConversionMode = () => useContext(ConversionModeContext);
export const useCurrencySymbol = () => useContext(CurrencySymbolContext);