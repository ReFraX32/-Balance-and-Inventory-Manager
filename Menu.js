import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';
import loadStyles from './loadStyles';
import { formatCurrency } from './utils';
import CustomAlert from './CustomAlert';
import ScrollableModal from './ScrollableModal';
import { languages } from './languages';
import { useLanguage, useTheme, useConversionMode, useCurrencySymbol } from './SettingsContext';
import createMenuStyles from './menuStyles';
import Storage from './Storage';


const SWIPE_THRESHOLD = 50;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_PREFIX = 'BalanceApp_menu_';

const EntryItem = React.memo(({ entry, index, onEdit, onDelete, calculateSaldoDiario, calculateSaldoTotal, conversionMode, currencySymbol, theme }) => (

  <View style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }, theme === 'dark' && styles.darkCell, theme === 'dark' && styles.darkDateText]}>{entry.fecha}</Text>
    <Text style={[styles.cell, { flex: 4 }, theme === 'dark' && styles.darkCell, theme === 'dark' && styles.darkDescriptionText]} numberOfLines={2} ellipsizeMode="tail">{entry.descripcion}</Text>
    <Text style={[styles.cell, styles.ingresosCell, { flex: 2 }]}>
      {formatCurrency(entry.ingresos, conversionMode, currencySymbol)}
    </Text>
    <Text style={[styles.cell, styles.egresosCell, { flex: 2 }]}>
      {formatCurrency(entry.egresos, conversionMode, currencySymbol)}
    </Text>
    <Text 
      style={[
        styles.cell, 
        { flex: 2 },
        theme === 'dark' && styles.darkCell,
        calculateSaldoDiario(entry) > 0 ? styles.saldoDiarioPositiveCell : 
        calculateSaldoDiario(entry) < 0 ? styles.saldoDiarioNegativeCell : 
        styles.saldoDiarioNeutralCell
      ]}
    >
      {formatCurrency(calculateSaldoDiario(entry), conversionMode, currencySymbol)}
    </Text>
    <Text 
      style={[
        styles.cell, 
        { flex: 2 },
        theme === 'dark' && styles.darkCell,
        calculateSaldoTotal(index) > 0 ? styles.saldoTotalPositiveCell : 
        calculateSaldoTotal(index) < 0 ? styles.saldoTotalNegativeCell : 
        styles.saldoTotalNeutralCell
      ]}
    >
      {formatCurrency(calculateSaldoTotal(index), conversionMode, currencySymbol)}
    </Text>
    <View style={[styles.cell, styles.actionCell, { flex: 2 }]}>
      <Pressable onPress={() => onEdit(entry)}>
        <MaterialIcons name="edit" size={24} color="#2196F3" />
      </Pressable>
      <Pressable onPress={() => onDelete(entry.id)}>
        <MaterialIcons name="delete" size={24} color="#F44336" />
      </Pressable>
    </View>
  </View>
));

const Menu = ({ navigation }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { conversionMode } = useConversionMode();
  const { currencySymbol } = useCurrencySymbol();
  const [saldoInicial, setSaldoInicial] = useState('');
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ fecha: new Date(), descripcion: '', ingresos: '', egresos: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [loadModalVisible, setLoadModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [savedFiles, setSavedFiles] = useState([]);
  const [addBalanceModalVisible, setAddBalanceModalVisible] = useState(false);
  const [newBalanceEntry, setNewBalanceEntry] = useState({
    fecha: new Date(),
    descripcion: '',
    ingresos: '',
    egresos: ''
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isPortrait, setIsPortrait] = useState(Dimensions.get('window').height > Dimensions.get('window').width);

  const panX = useRef(new Animated.Value(0)).current;

  const menuStyles = createMenuStyles(theme);

  useEffect(() => {
    loadData();
    updateSavedFilesList();
  }, []);

  useEffect(() => {
    const updateOrientation = () => {
      setIsPortrait(Dimensions.get('window').height > Dimensions.get('window').width);
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => {
      subscription.remove();
    };
  }, []);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('menuData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSaldoInicial(parsedData.saldoInicial);
        setEntries(parsedData.entries);
      }
    } catch (e) {
      console.error('Error al cargar los datos', e);
    }
  };

  const saveData = async () => {
    try {
      const dataToSave = { saldoInicial, entries };
      await AsyncStorage.setItem('menuData', JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error al guardar los datos', e);
    }
  };

  // Call saveData after any changes to saldoInicial or entries
  useEffect(() => {
    saveData();
  }, [saldoInicial, entries]);

  const updateSaldoInicial = () => {
    setSaldoInicial(saldoInicial);
  };

  const addEntry = () => {
    if (newEntry.fecha && newEntry.descripcion && (newEntry.ingresos || newEntry.egresos)) {
      if (editingEntry) {
        setEntries(entries.map(entry => 
          entry.id === editingEntry.id ? { ...newEntry, id: entry.id } : entry
        ));
        setEditingEntry(null);
      } else {
        setEntries([...entries, { ...newEntry, id: Date.now().toString(), fecha: newEntry.fecha.toISOString().split('T')[0] }]);
      }
      setNewEntry({ fecha: new Date(), descripcion: '', ingresos: '', egresos: '' });
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingEntry) {
      const updatedEntries = entries.map(entry => 
        entry.id === editingEntry.id ? editingEntry : entry
      );
      setEntries(updatedEntries);
      setEditModalVisible(false);
      setEditingEntry(null);
    }
  };

  const deleteEntry = (id) => {
    setEntryToDelete(id);
    setAlertVisible(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      setEntries(entries.filter(entry => entry.id !== entryToDelete));
    }
    setAlertVisible(false);
    setEntryToDelete(null);
  };

  const calculateSaldoDiario = (entry) => {
    return parseFloat(entry.ingresos) - parseFloat(entry.egresos);
  };

  const calculateSaldoTotal = (index) => {
    let saldo = parseFloat(saldoInicial) || 0;
    for (let i = 0; i <= index; i++) {
      saldo += calculateSaldoDiario(sortedEntries[i]);
    }
    return saldo;
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newEntry.fecha;
    setShowDatePicker(Platform.OS === 'ios');
    setNewEntry({ ...newEntry, fecha: currentDate });
  };

  const handleSave = async () => {
    if (!fileName.trim()) {
      Alert.alert(languages[language].error, languages[language].enterFileName);
      return;
    }
    try {
      const key = MENU_PREFIX + fileName;
      await AsyncStorage.setItem(key, JSON.stringify({ saldoInicial, entries }));
      setSaveModalVisible(false);
      setFileName('');
      updateSavedFilesList();
      Alert.alert(languages[language].success, languages[language].dataSavedSuccessfully);
    } catch (e) {
      console.error('Error al guardar los datos', e);
      Alert.alert(languages[language].error, languages[language].failedToSaveData);
    }
  };

  const handleLoad = async (fileName) => {
    try {
      const key = MENU_PREFIX + fileName;
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        const parsedData = JSON.parse(data);
        setEntries(parsedData.entries);
        setSaldoInicial(parsedData.saldoInicial);
        setLoadModalVisible(false);
      } else {
        Alert.alert(languages[language].error, languages[language].noDataForFile);
      }
    } catch (e) {
      console.error('Error al cargar el archivo', e);
      Alert.alert(languages[language].error, languages[language].failedToLoadFile);
    }
  };

  const updateSavedFilesList = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const fileNames = keys
        .filter(key => key.startsWith(MENU_PREFIX))
        .map(key => key.slice(MENU_PREFIX.length));
      setSavedFiles(fileNames);
    } catch (e) {
      console.error('Error al obtener los archivos guardados', e);
    }
  };

  const handleAddBalanceEntry = () => {
    if (newBalanceEntry.descripcion && (newBalanceEntry.ingresos || newBalanceEntry.egresos)) {
      const newEntry = {
        ...newBalanceEntry,
        fecha: newBalanceEntry.fecha.toISOString().split('T')[0],
        ingresos: parseFloat(newBalanceEntry.ingresos) || 0,
        egresos: parseFloat(newBalanceEntry.egresos) || 0,
        id: Date.now().toString()
      };
      setEntries([...entries, newEntry]);
      setAddBalanceModalVisible(false);
      setNewBalanceEntry({
        fecha: new Date(),
        descripcion: '',
        ingresos: '',
        egresos: ''
      });
    }
  };

  const handleDeleteFile = (fileName) => {
    setFileToDelete(fileName);
    setDeleteAlertVisible(true);
  };

  const confirmDeleteFile = async () => {
    if (fileToDelete) {
      try {
        const key = MENU_PREFIX + fileToDelete;
        await AsyncStorage.removeItem(key);
        updateSavedFilesList();
      } catch (e) {
        console.error('Failed to delete file', e);
        Alert.alert(languages[language].error, languages[language].failedToDeleteFile);
      }
    }
    setDeleteAlertVisible(false);
    setFileToDelete(null);
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: panX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      if (Math.abs(translationX) > SWIPE_THRESHOLD) {
        if (translationX > 0) {
          navigation.navigate('Main');
        }
      }

      Animated.spring(panX, { toValue: 0, useNativeDriver: true }).start();
    }
  };

  const renderItem = useCallback(({ item, index }) => (
    <EntryItem
      entry={item}
      index={index}
      onEdit={handleEditEntry}
      onDelete={deleteEntry}
      calculateSaldoDiario={calculateSaldoDiario}
      calculateSaldoTotal={calculateSaldoTotal}
      conversionMode={conversionMode}
      currencySymbol={currencySymbol}
      theme={theme}
    />
  ), [handleEditEntry, deleteEntry, calculateSaldoDiario, calculateSaldoTotal, conversionMode, currencySymbol, theme]);

  const keyExtractor = useCallback((item) => item.id, []);

  // Sort entries by date (oldest to newest)
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }, [entries]);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>
          {languages[language].noEntries}
        </Text>
        {isPortrait && (
          <View style={styles.recommendationContainer}>
            <Text  style={[styles.recommendationText, theme === 'dark' && styles.darkRecommendationText]}>
            <MaterialCommunityIcons 
              name="rotate-3d-variant" 
              size={24} 
              color={theme === 'dark' ? '#999' : '#777'} 
            />{languages[language].rotationRecommendation}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={menuStyles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-20, 20]}
      >
        <Animated.View style={[
          menuStyles.animatedContainer,
          {
            transform: [{ 
              translateX: panX.interpolate({
                inputRange: [0, SCREEN_WIDTH],
                outputRange: [0, SCREEN_WIDTH / 3],
                extrapolate: 'clamp',
              })
            }],
          },
        ]}>
          <TouchableOpacity 
            style={styles.swipeIndicatorLeft}
            onPress={() => navigation.navigate('Main')}
          >
            <MaterialIcons name="chevron-left" size={24} color="#888" />
          </TouchableOpacity>
          <Text style={[styles.title]}>{languages[language].balanceManagement}</Text>
          <View style={[styles.tableContainer, theme === 'dark' && styles.darkTableContainer]}>
            <View style={[styles.tableHeader, theme === 'dark' && styles.darkTableHeader]}>
              <Text style={[styles.headerCell, { flex: 2 }, theme === 'dark' && styles.darkHeaderCell, theme === 'dark' && styles.darkDateText]}>{languages[language].date}</Text>
              <Text style={[styles.headerCell, { flex: 4 }, theme === 'dark' && styles.darkHeaderCell, theme === 'dark' && styles.darkDescriptionText]}>{languages[language].description}</Text>
              <Text style={[styles.headerCell, { flex: 2 }, theme === 'dark' && styles.darkHeaderCell]}>{languages[language].income}</Text>
              <Text style={[styles.headerCell, { flex: 2 }, theme === 'dark' && styles.darkHeaderCell]}>{languages[language].expenses}</Text>
              <Text style={[styles.headerCell, { flex: 2 }, theme === 'dark' && styles.darkHeaderCell]}>{languages[language].dailyBalance}</Text>
              <Text style={[styles.headerCell, { flex: 2 }, theme === 'dark' && styles.darkHeaderCell]}>{languages[language].totalBalance}</Text>
              <Text style={[styles.headerCell, { flex: 2 }, theme === 'dark' && styles.darkHeaderCell]}>{languages[language].actions}</Text>
            </View>
            <FlatList
              data={sortedEntries}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={[
                styles.listContentContainer,
                sortedEntries.length === 0 && styles.emptyListContainer
              ]}
              ListEmptyComponent={renderEmptyComponent}
            />
          </View>
          
          <View style={[styles.bottomButtonsContainer, theme === 'dark' && styles.darkBottomButtonsContainer]}>
            <Pressable style={[styles.bottomButton, styles.saveButton]} onPress={() => setSaveModalVisible(true)}>
              <MaterialIcons name="save" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>{languages[language].save}</Text>
            </Pressable>
            <Pressable style={[styles.bottomButton, styles.loadButton]} onPress={() => setLoadModalVisible(true)}>
              <MaterialIcons name="folder-open" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>{languages[language].load}</Text>
            </Pressable>
            <Pressable style={[styles.bottomButton, styles.addButton]} onPress={() => setAddBalanceModalVisible(true)}>
              <MaterialIcons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>{languages[language].add}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </PanGestureHandler>

      {/* Save Modal */}
      <ScrollableModal
        visible={saveModalVisible}
        onClose={() => setSaveModalVisible(false)}
        title={languages[language].saveData}
        theme={theme}
        style={menuStyles.saveDataModalView}
      >
        <View style={[styles.modalInputContainer, theme === 'dark' && styles.darkModalInputContainer]}>
          <MaterialIcons name="description" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333'} />
          <TextInput
            style={[styles.modalInput, theme === 'dark' && styles.darkModalInput]}
            placeholder={languages[language].fileName}
            placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
            value={fileName}
            onChangeText={setFileName}
          />
        </View>
        <View style={styles.modalButtons}>
          <Pressable style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.buttonText}>{languages[language].save}</Text>
          </Pressable>
        </View>
      </ScrollableModal>

      {/* Load Modal */}
      <ScrollableModal
        visible={loadModalVisible}
        onClose={() => setLoadModalVisible(false)}
        title={languages[language].loadData}
        theme={theme}
        style={menuStyles.loadDataModalView}
      >
        <FlatList
          data={savedFiles}
          renderItem={({ item }) => (
            <View style={[
              loadStyles.fileItemContainer, 
              menuStyles.fileItemContainer,
              { backgroundColor: theme === 'dark' ? '#333' : '#fff' },
              theme === 'dark' && loadStyles.darkFileItemContainer
            ]}>
              <Pressable style={loadStyles.fileItem} onPress={() => handleLoad(item)}>
                <MaterialIcons name="insert-drive-file" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
                <Text style={[
                  loadStyles.fileItemText, 
                  menuStyles.fileItemText,
                  { color: theme === 'dark' ? '#fff' : '#000' },
                  theme === 'dark' && loadStyles.darkFileItemText
                ]}>{item}</Text>
              </Pressable>
              <Pressable style={loadStyles.loadDeleteButton} onPress={() => handleDeleteFile(item)}>
                <MaterialIcons name="delete" size={24} color={theme === 'dark' ? "#FF6B6B" : "#F44336"} />
              </Pressable>
            </View>
          )}
          keyExtractor={(item) => item}
          ListEmptyComponent={<Text style={[loadStyles.emptyText, theme === 'dark' && loadStyles.darkEmptyText]}>{languages[language].noSavedFiles}</Text>}
          style={loadStyles.fileList}
        />
      </ScrollableModal>

      {/* Add Balance Entry Modal */}
      <ScrollableModal
        visible={addBalanceModalVisible}
        onClose={() => setAddBalanceModalVisible(false)}
        title={languages[language].addToBalance}
        theme={theme}
        style={menuStyles.addBalanceModalView}
      >
        <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.datePickerText, theme === 'dark' && styles.darkText]}>
            <MaterialIcons name="date-range" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333'} /> {newBalanceEntry.fecha.toISOString().split('T')[0]}
          </Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={newBalanceEntry.fecha}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setNewBalanceEntry({...newBalanceEntry, fecha: selectedDate});
              }
            }}
          />
        )}
        <View style={[styles.modalInputContainer, theme === 'dark' && styles.darkModalInputContainer]}>
          <MaterialIcons name="description" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333'} />
          <TextInput
            style={[styles.modalInput, theme === 'dark' && styles.darkModalInput]}
            placeholder={languages[language].description}
            placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
            value={newBalanceEntry.descripcion}
            onChangeText={(text) => setNewBalanceEntry({...newBalanceEntry, descripcion: text})}
          />
        </View>
        <View style={[styles.modalInputContainer, theme === 'dark' && styles.darkModalInputContainer]}>
          <MaterialIcons name="attach-money" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333'} />
          <TextInput
            style={[styles.modalInput, theme === 'dark' && styles.darkModalInput]}
            placeholder={languages[language].income}
            placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
            value={newBalanceEntry.ingresos}
            onChangeText={(text) => setNewBalanceEntry({...newBalanceEntry, ingresos: text})}
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.modalInputContainer, theme === 'dark' && styles.darkModalInputContainer]}>
          <MaterialIcons name="money-off" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333'} />
          <TextInput
            style={[styles.modalInput, theme === 'dark' && styles.darkModalInput]}
            placeholder={languages[language].expenses}
            placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
            value={newBalanceEntry.egresos}
            onChangeText={(text) => setNewBalanceEntry({...newBalanceEntry, egresos: text})}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.modalButtons}>
          <Pressable style={[styles.modalButton, styles.saveButton]} onPress={handleAddBalanceEntry}>
            <Text style={styles.buttonText}>{languages[language].add}</Text>
          </Pressable>
        </View>
      </ScrollableModal>

      {/* Edit Entry Modal */}
      <ScrollableModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title={languages[language].editEntry}
        theme={theme}
        style={menuStyles.editEntryModalView}
      >
        {editingEntry && (
          <View style={[styles.editEntryModalContent, theme === 'dark' && styles.darkModalView]}>
            <View style={[styles.modalInputContainer, theme === 'dark' && styles.darkModalInputContainer]}>
              <MaterialIcons name="date-range" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333'} />
              <Pressable onPress={() => setShowDatePicker(true)}>
                <Text style={[styles.datePickerText, theme === 'dark' && styles.darkText]}>
                  {editingEntry.fecha}
                </Text>
              </Pressable>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(editingEntry.fecha)}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setEditingEntry({...editingEntry, fecha: selectedDate.toISOString().split('T')[0]});
                  }
                }}
              />
            )}
            <View style={[styles.modalInputContainer, theme === 'dark' && styles.darkModalInputContainer]}>
              <MaterialIcons name="description" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333'} />
              <TextInput
                style={[styles.modalInput, theme === 'dark' && styles.darkModalInput]}
                placeholder={languages[language].description}
                placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
                value={editingEntry.descripcion}
                onChangeText={(text) => setEditingEntry({...editingEntry, descripcion: text})}
              />
            </View>
            <View style={[styles.modalInputContainer, theme === 'dark' && styles.darkModalInputContainer]}>
              <MaterialIcons name="attach-money" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333'} />
              <TextInput
                style={[styles.modalInput, theme === 'dark' && styles.darkModalInput]}
                placeholder={languages[language].income}
                placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
                value={editingEntry.ingresos.toString()}
                onChangeText={(text) => setEditingEntry({...editingEntry, ingresos: parseFloat(text) || 0})}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.modalInputContainer, theme === 'dark' && styles.darkModalInputContainer]}>
              <MaterialIcons name="money-off" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333'} />
              <TextInput
                style={[styles.modalInput, theme === 'dark' && styles.darkModalInput]}
                placeholder={languages[language].expenses}
                placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
                value={editingEntry.egresos.toString()}
                onChangeText={(text) => setEditingEntry({...editingEntry, egresos: parseFloat(text) || 0})}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, styles.saveButton]} onPress={handleSaveEdit}>
                <Text style={styles.buttonText}>{languages[language].save}</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollableModal>

      {/* CustomAlert for file deletion */}
      <CustomAlert
        visible={deleteAlertVisible}
        title={languages[language].confirmDeletion}
        message={`${languages[language].confirmDeleteFile} "${fileToDelete}"?`}
        onCancel={() => setDeleteAlertVisible(false)}
        onConfirm={confirmDeleteFile}
        cancelText={languages[language].cancel}
        confirmText={languages[language].delete}
        theme={theme}
      />

      {/* CustomAlert for entry deletion */}
      <CustomAlert
        visible={alertVisible}
        title={languages[language].confirmDeletion}
        message={languages[language].confirmDeleteEntry}
        onCancel={() => setAlertVisible(false)}
        onConfirm={confirmDelete}
        cancelText={languages[language].cancel}
        confirmText={languages[language].delete}
        theme={theme}
      />
    </SafeAreaView>
  );
};

export default Menu;