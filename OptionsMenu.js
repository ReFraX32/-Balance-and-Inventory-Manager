import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScrollableModal from './ScrollableModal';
import { useLanguage, useTheme, useConversionMode, useCurrencySymbol } from './SettingsContext';
import { languages } from './languages';
import createMenuStyles from './menuStyles';

const OptionsMenu = ({ visible, onClose }) => {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { conversionMode, setConversionMode } = useConversionMode();
  const { currencySymbol, setCurrencySymbol } = useCurrencySymbol();

  const menuStyles = createMenuStyles(theme);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleConversionModeChange = () => {
    setConversionMode(conversionMode === 'point' ? 'comma' : 'point');
  };

  const handleCurrencySymbolChange = (newSymbol) => {
    setCurrencySymbol(newSymbol);
  };

  return (
    <ScrollableModal
      visible={visible}
      onClose={onClose}
      title={languages[language].options}
      theme={theme}
      style={menuStyles.optionsMenu}
    >
      <View style={menuStyles.section}>
        <Text style={menuStyles.sectionTitle}>{languages[language].changeLanguage}</Text>
        {Object.keys(languages).map((lang) => (
          <Pressable
            key={lang}
            style={[menuStyles.option, language === lang && menuStyles.selectedOption]}
            onPress={() => handleLanguageChange(lang)}
          >
            <Text style={menuStyles.optionText}>{languages[lang].nativeName}</Text>
            {language === lang && <MaterialIcons name="check" size={24} color={theme === 'dark' ? "#4CAF50" : "#4CAF50"} />}
          </Pressable>
        ))}
      </View>

      <View style={menuStyles.section}>
        <Text style={menuStyles.sectionTitle}>{languages[language].changeMode}</Text>
        <Pressable
          style={menuStyles.option}
          onPress={handleThemeChange}
        >
          <Text style={menuStyles.optionText}>
            {theme === 'light' ? languages[language].darkMode : languages[language].lightMode}
          </Text>
          <MaterialIcons name={theme === 'light' ? "brightness-2" : "brightness-5"} size={24} color={theme === 'dark' ? "#FFFFFF" : "#000000"} />
        </Pressable>
      </View>

      <View style={menuStyles.section}>
        <Text style={menuStyles.sectionTitle}>{languages[language].changeConversionMode}</Text>
        <Pressable
          style={menuStyles.option}
          onPress={handleConversionModeChange}
        >
          <Text style={menuStyles.optionText}>
            {conversionMode === 'point' ? languages[language].useComma : languages[language].usePoint}
          </Text>
          <MaterialIcons name="swap-horiz" size={24} color={theme === 'dark' ? "#FFFFFF" : "#000000"} />
        </Pressable>
      </View>

      <View style={menuStyles.section}>
        <Text style={menuStyles.sectionTitle}>{languages[language].changeMoneySymbol}</Text>
        {['$', '€', '£', '¥'].map((symbol) => (
          <Pressable
            key={symbol}
            style={[menuStyles.option, currencySymbol === symbol && menuStyles.selectedOption]}
            onPress={() => handleCurrencySymbolChange(symbol)}
          >
            <Text style={menuStyles.optionText}>{symbol}</Text>
            {currencySymbol === symbol && <MaterialIcons name="check" size={24} color={theme === 'dark' ? "#4CAF50" : "#4CAF50"} />}
          </Pressable>
        ))}
      </View>
    </ScrollableModal>
  );
};

export default OptionsMenu;