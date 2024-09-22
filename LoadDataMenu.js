import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScrollableModal from './ScrollableModal';
import CustomAlert from './CustomAlert';
import { useLanguage, useTheme } from './SettingsContext';
import { languages } from './languages';
import createMenuStyles from './menuStyles';
import Storage from './Storage';

const LoadDataMenu = ({ visible, onClose, onLoad }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedSave, setSelectedSave] = useState(null);
  const [savedFiles, setSavedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const menuStyles = createMenuStyles(theme);

  useEffect(() => {
    if (visible) {
      loadSavedFiles();
    }
  }, [visible]);

  const loadSavedFiles = async () => {
    const files = await Storage.getAllKeys();
    setSavedFiles(files);
  };

  const handleDeleteSave = (saveName) => {
    setSelectedSave(saveName);
    setAlertVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedSave) {
      try {
        await Storage.removeItem(selectedSave);
        await loadSavedFiles(); // Refresh the list after deletion
      } catch (error) {
        console.error('Failed to delete save:', error);
      }
    }
    setAlertVisible(false);
    setSelectedSave(null);
  };

  const handleLoadSave = async (saveName) => {
    try {
      const data = await Storage.getItem(saveName);
      onLoad(JSON.parse(data));
      onClose();
    } catch (error) {
      console.error('Failed to load save:', error);
    }
  };

  const filteredFiles = savedFiles.filter(file => 
    file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSavedFile = ({ item }) => (
    <View style={[menuStyles.option, menuStyles.fileItemContainer]}>
      <Pressable style={menuStyles.fileItem} onPress={() => handleLoadSave(item)}>
        <MaterialIcons name="insert-drive-file" size={24} color={theme === 'dark' ? "#FFFFFF" : "#3F51B5"} />
        <Text style={[menuStyles.fileItemText, theme === 'dark' && menuStyles.darkText]}>{item}</Text>
      </Pressable>
      <Pressable style={menuStyles.loadDeleteButton} onPress={() => handleDeleteSave(item)}>
        <MaterialIcons name="delete" size={24} color={theme === 'dark' ? "#FF6B6B" : "#F44336"} />
      </Pressable>
    </View>
  );

  return (
    <>
      <ScrollableModal
        visible={visible}
        onClose={onClose}
        title={languages[language].loadData}
        theme={theme}
        style={menuStyles.loadDataMenu}
      >
        <View style={menuStyles.searchContainer}>
          <MaterialIcons name="search" size={24} color={theme === 'dark' ? "#FFFFFF" : "#000000"} />
          <TextInput
            style={[menuStyles.searchInput, theme === 'dark' && menuStyles.darkInput]}
            placeholder={languages[language].searchFiles}
            placeholderTextColor={theme === 'dark' ? "#888" : "#999"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          data={filteredFiles}
          renderItem={renderSavedFile}
          keyExtractor={(item) => item}
          ListEmptyComponent={<Text style={[menuStyles.emptyText, theme === 'dark' && menuStyles.darkText]}>{languages[language].noSavedFiles}</Text>}
        />
      </ScrollableModal>

      <CustomAlert
        visible={alertVisible}
        title={languages[language].confirmDeletion}
        message={languages[language].deleteSaveConfirmation}
        onCancel={() => setAlertVisible(false)}
        onConfirm={confirmDelete}
        cancelText={languages[language].cancel}
        confirmText={languages[language].delete}
        theme={theme}
      />
    </>
  );
};

export default LoadDataMenu;