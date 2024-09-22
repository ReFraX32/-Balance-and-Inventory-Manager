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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import loadStyles from './loadStyles';
import { formatCurrency } from './utils';
import CustomAlert from './CustomAlert';
import ScrollableModal from './ScrollableModal';
import OptionsMenu from './OptionsMenu';
import { useLanguage, useTheme, useConversionMode, useCurrencySymbol } from './SettingsContext';
import { languages } from './languages';
import createMenuStyles from './menuStyles';

const SWIPE_THRESHOLD = 50;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAIN_SCREEN_PREFIX = 'BalanceApp_main_';

const ProductItem = React.memo(({ product, onEdit, onDelete, language, theme, conversionMode, currencySymbol }) => {
  const profit = (product.quantity * product.price) - (product.quantity * product.cost);
  const isProfitable = profit > 0;
  const isNeutral = profit === 0;

  const getTotalProductCostColor = (cost) => {
    if (cost > 0) return theme === 'dark' ? '#ff6b6b' : '#d32f2f'; // darkred
    if (cost < 0) return theme === 'dark' ? '#66bb6a' : '#388e3c'; // darkgreen
    return theme === 'dark' ? '#9e9e9e' : '#757575'; // grey
  };

  const getTotalProductSellingPriceColor = (price) => {
    if (price > 0) return theme === 'dark' ? '#66bb6a' : '#388e3c'; // darkgreen
    if (price < 0) return theme === 'dark' ? '#ff6b6b' : '#d32f2f'; // darkred
    return theme === 'dark' ? '#9e9e9e' : '#757575'; // grey
  };

  let profitLossText = '';
  if (profit > 0) {
    profitLossText = `${languages[language].productProfit}: ${formatCurrency(profit, conversionMode, currencySymbol)}`;
  } else if (profit < 0) {
    profitLossText = `${languages[language].productLoss}: ${formatCurrency(Math.abs(profit), conversionMode, currencySymbol)}`;
  } else {
    profitLossText = `${languages[language].productNeutralBalance}: ${formatCurrency(0, conversionMode, currencySymbol)}`;
  }

  const totalProductCost = product.quantity * product.cost;
  const totalProductSellingPrice = product.quantity * product.price;

  return (
    <View style={[styles.productItem, theme === 'dark' && styles.darkProductItem]}>
      <Text style={[styles.productName, theme === 'dark' && styles.darkText]} selectable={true}>{product.name}</Text>
      <Text style={[styles.productDetails, theme === 'dark' && styles.darkText]} selectable={true}>
        {languages[language].quantity}: {product.quantity} | {languages[language].cost}: {formatCurrency(product.cost, conversionMode, currencySymbol)} | {languages[language].sellingPrice}: {formatCurrency(product.price, conversionMode, currencySymbol)}
      </Text>
      <Text selectable={true}>
        <Text style={[styles.productTotalsCost, { color: getTotalProductCostColor(totalProductCost) }]}>
          {languages[language].totalProductCost}: {formatCurrency(totalProductCost, conversionMode, currencySymbol)}
        </Text>
        <Text style={theme === 'dark' && styles.darkText}> | </Text>
        <Text style={[styles.productTotalsPrice, { color: getTotalProductSellingPriceColor(totalProductSellingPrice) }]}>
          {languages[language].totalProductSellingPrice}: {formatCurrency(totalProductSellingPrice, conversionMode, currencySymbol)}
        </Text>
      </Text>
      <Text 
        style={[
          isProfitable ? (theme === 'dark' ? styles.darkProductTotalsProfit : styles.productTotalsProfit) 
          : isNeutral ? (theme === 'dark' ? styles.darkProductTotalsNeutral : styles.productTotalsNeutral) 
          : (theme === 'dark' ? styles.darkProductTotalsLost : styles.productTotalsLost),
          { selectable: true }
        ]}
      >
        {profitLossText}
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.editButton]} onPress={() => onEdit(product)}>
          <MaterialIcons name="edit" size={18} color="white" />
          <Text style={styles.buttonText}>{languages[language].edit}</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.deleteButton]} onPress={() => onDelete(product.id)}>
          <MaterialIcons name="delete" size={18} color="white" />
          <Text style={styles.buttonText}>{languages[language].delete}</Text>
        </Pressable>
      </View>
    </View>
  );
});

const MainScreen = ({ navigation }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { conversionMode } = useConversionMode();
  const { currencySymbol } = useCurrencySymbol();
  
  const [products, setProducts] = useState([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [loadModalVisible, setLoadModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [savedFiles, setSavedFiles] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', cost: '', price: '' });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const panX = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: panX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      if (Math.abs(translationX) > SWIPE_THRESHOLD) {
        if (translationX < 0) {
          navigation.navigate('Menu');
        }
      }

      Animated.spring(panX, { toValue: 0, useNativeDriver: true }).start();
    }
  };

  useEffect(() => {
    loadData();
    updateSavedFilesList();
  }, []);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('productData');
      if (savedData) {
        setProducts(JSON.parse(savedData));
      }
    } catch (e) {
      console.error('Failed to load data', e);
    }
  };

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem('productData', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };

  const updateSavedFilesList = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const fileNames = keys
        .filter(key => key.startsWith(MAIN_SCREEN_PREFIX))
        .map(key => key.slice(MAIN_SCREEN_PREFIX.length));
      setSavedFiles(fileNames);
    } catch (e) {
      console.error('Failed to get saved files', e);
    }
  };

  const calculateTotalProfit = () => {
    return products.reduce((total, product) => {
      const profit = (product.totalPrice || 0) - (product.totalCost || 0);
      return total + profit;
    }, 0);
  };

  const calculateTotalCost = () => {
    return products.reduce((total, product) => {
      return total + (product.totalCost || 0);
    }, 0);
  };

  const calculateTotalSellingPrice = () => {
    return products.reduce((total, product) => {
      return total + (product.totalPrice || 0);
    }, 0);
  };

  const getProfitText = (profit) => {
    if (profit > 0) return languages[language].profitTotal;
    if (profit < 0) return languages[language].lossTotal;
    return languages[language].neutralBalance;
  };

  const getProfitColor = (profit) => {
    if (profit > 0) return theme === 'dark' ? 'green' : '#4CAF50';
    if (profit < 0) return theme === 'dark' ? '#ef5350' : '#F44336';
    return theme === 'dark' ? '#9e9e9e' : '#757575';
  };

  const getTotalCostColor = (totalCost) => {
    if (totalCost > 0) return theme === 'dark' ? '#ff6b6b' : '#d32f2f'; // darkred
    if (totalCost < 0) return theme === 'dark' ? '#66bb6a' : '#388e3c'; // darkgreen
    return theme === 'dark' ? '#9e9e9e' : '#757575'; // grey
  };

  const getTotalSellingPriceColor = (totalSellingPrice) => {
    if (totalSellingPrice > 0) return theme === 'dark' ? '#66bb6a' : '#388e3c'; // darkgreen
    if (totalSellingPrice < 0) return theme === 'dark' ? '#ff6b6b' : '#d32f2f'; // darkred
    return theme === 'dark' ? '#9e9e9e' : '#757575'; // grey
  };

  const totalProfit = calculateTotalProfit();
  const totalCost = calculateTotalCost();
  const totalSellingPrice = calculateTotalSellingPrice();

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (!searchVisible) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  };

  const renderSearchBar = () => (
    <Animated.View style={[styles.searchBarContainer, menuStyles.searchBarContainer]}>
      <TextInput
        ref={searchInputRef}
        style={[styles.searchInput, menuStyles.searchInput]}
        placeholder={languages[language].searchProducts}
        placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Pressable onPress={toggleSearch} style={styles.searchCloseButton}>
        <MaterialIcons name="close" size={24} style={menuStyles.crossIcon} />
      </Pressable>
    </Animated.View>
  );

  const handleSave = async () => {
    if (!fileName.trim()) {
      Alert.alert(languages[language].error, languages[language].enterFileName);
      return;
    }
    try {
      const key = MAIN_SCREEN_PREFIX + fileName;
      await AsyncStorage.setItem(key, JSON.stringify(products));
      setSaveModalVisible(false);
      setFileName('');
      updateSavedFilesList();
      Alert.alert(languages[language].success, languages[language].dataSavedSuccessfully);
    } catch (e) {
      console.error('Failed to save data', e);
      Alert.alert(languages[language].error, languages[language].failedToSaveData);
    }
  };

  const handleLoad = async (fileName) => {
    try {
      const key = MAIN_SCREEN_PREFIX + fileName;
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        setProducts(JSON.parse(data));
        setLoadModalVisible(false);
      } else {
        Alert.alert(languages[language].error, languages[language].noDataForFile);
      }
    } catch (e) {
      console.error('Failed to load data', e);
      Alert.alert(languages[language].error, languages[language].failedToLoadFile);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.quantity || !newProduct.cost || !newProduct.price) {
      Alert.alert(languages[language].error, languages[language].fillAllFields);
      return;
    }
    const productToAdd = {
      id: Date.now().toString(),
      name: newProduct.name.trim(),
      quantity: parseInt(newProduct.quantity) || 0,
      cost: parseFloat(newProduct.cost) || 0,
      price: parseFloat(newProduct.price) || 0,
      totalCost: (parseInt(newProduct.quantity) || 0) * (parseFloat(newProduct.cost) || 0),
      totalPrice: (parseInt(newProduct.quantity) || 0) * (parseFloat(newProduct.price) || 0),
    };
    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    saveData(updatedProducts);
    setAddModalVisible(false);
    setNewProduct({ name: '', quantity: '', cost: '', price: '' });
  };

  const handleEditProduct = (product) => {
    setEditingProduct({...product}); // Create a copy of the product
    setEditModalVisible(true);
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setAlertVisible(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      const updatedProducts = products.filter(p => p.id !== productToDelete);
      setProducts(updatedProducts);
      saveData(updatedProducts);
    }
    setAlertVisible(false);
    setProductToDelete(null);
  };

  const handleSaveEdit = () => {
    if (editingProduct) {
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? {
          ...editingProduct,
          totalCost: editingProduct.quantity * editingProduct.cost,
          totalPrice: editingProduct.quantity * editingProduct.price
        } : p
      );
      setProducts(updatedProducts);
      saveData(updatedProducts);
      setEditModalVisible(false);
      setEditingProduct(null);
    }
  };

  const handleDeleteFile = (fileName) => {
    setFileToDelete(fileName);
    setDeleteAlertVisible(true);
  };

  const confirmDeleteFile = async () => {
    if (fileToDelete) {
      try {
        const key = MAIN_SCREEN_PREFIX + fileToDelete;
        await AsyncStorage.removeItem(key);
        updateSavedFilesList();
        Alert.alert(languages[language].success, languages[language].fileDeletedSuccessfully);
      } catch (e) {
        console.error('Failed to delete file', e);
        Alert.alert(languages[language].error, languages[language].failedToDeleteFile);
      }
    }
    setDeleteAlertVisible(false);
    setFileToDelete(null);
  };

  const renderItem = useCallback(({ item }) => (
    <ProductItem
      product={item}
      onEdit={handleEditProduct}
      onDelete={handleDeleteProduct}
      language={language}
      theme={theme}
      conversionMode={conversionMode}
      currencySymbol={currencySymbol}
    />
  ), [language, theme, conversionMode, currencySymbol, handleEditProduct, handleDeleteProduct]);

  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback((data, index) => ({
    length: 150,
    offset: 150 * index,
    index,
  }), []);

  const ListHeaderComponent = useCallback(() => (
    <>
      <Text style={[styles.title]}>{languages[language].inventoryManagement}</Text>
      <View style={[styles.summaryCard, theme === 'dark' && styles.darkSummaryCard]}>
        <Text style={[styles.summaryText, theme === 'dark' && styles.darkText]} selectable={true}>{languages[language].products}: {products.length}</Text>
        <Text style={[styles.summaryText, { color: getProfitColor(totalProfit) }]} selectable={true}>
          {getProfitText(totalProfit)}: {formatCurrency(Math.abs(totalProfit), conversionMode, currencySymbol)}
        </Text>
        <Text style={[styles.summaryText, { color: getTotalCostColor(totalCost) }]} selectable={true}>
          {languages[language].totalCost}: {formatCurrency(Math.abs(totalCost), conversionMode, currencySymbol)}
        </Text>
        <Text style={[styles.summaryText, { color: getTotalSellingPriceColor(totalSellingPrice) }]} selectable={true}>
          {languages[language].totalSellingPrice}: {formatCurrency(Math.abs(totalSellingPrice), conversionMode, currencySymbol)}
        </Text>
        {totalProfit === 0 && (
          <Text style={[styles.recommendationText, theme === 'dark' && styles.darkText]} selectable={true}>
            {languages[language].recommendation}
          </Text>
        )}
      </View>
    </>
  ), [products.length, totalProfit, totalCost, totalSellingPrice, language, theme, conversionMode, currencySymbol]);

  const menuStyles = createMenuStyles(theme);

  const iconColor = theme === 'dark' ? '#FFFFFF' : '#333333';

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.keyboardAvoidingView, theme === 'dark' && styles.darkContainer]}
      >
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetX={[-20, 20]}
        >
          <Animated.View style={[
            styles.animatedContainer,
            theme === 'dark' && styles.darkAnimatedContainer,
            {
              transform: [{ 
                translateX: panX.interpolate({
                  inputRange: [-SCREEN_WIDTH, 0],
                  outputRange: [-SCREEN_WIDTH / 3, 0],
                  extrapolate: 'clamp',
                })
              }],
            },
          ]}>
            <TouchableOpacity 
              style={styles.swipeIndicatorRight}
              onPress={() => navigation.navigate('Menu')}
            >
              <MaterialIcons name="chevron-right" size={24} color={theme === 'dark' ? "#fff" : "#888"} />
            </TouchableOpacity>
            
            {/* Options Icon */}
            <Pressable style={styles.optionsIcon} onPress={() => setOptionsModalVisible(true)}>
              <MaterialIcons name="settings" size={24} color={theme === 'dark' ? "#fff" : "#333"} />
            </Pressable>

            {/* Search Icon - Only show when search is not visible */}
            {!searchVisible && (
              <Pressable style={styles.searchIcon} onPress={toggleSearch}>
                <MaterialIcons name="search" size={24} color={theme === 'dark' ? "#fff" : "#333"} />
              </Pressable>
            )}

            {searchVisible && renderSearchBar()}

            <FlatList
              data={filteredProducts}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              ListHeaderComponent={ListHeaderComponent}
              ListEmptyComponent={<Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>{languages[language].noProducts}</Text>}
              contentContainerStyle={styles.contentContainer}
              removeClippedSubviews={true}
              windowSize={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={10}
            />
            <View style={[styles.bottomButtonsContainer, menuStyles.bottomButtonsContainer]}>
              <Pressable style={[styles.bottomButton, menuStyles.bottomButton, menuStyles.saveButton]} onPress={() => setSaveModalVisible(true)}>
                <MaterialIcons name="save" size={18} color="white" />
                <Text style={menuStyles.buttonText}>{languages[language].save}</Text>
              </Pressable>
              <Pressable style={[styles.bottomButton, menuStyles.bottomButton, menuStyles.loadButton]} onPress={() => setLoadModalVisible(true)}>
                <MaterialIcons name="folder-open" size={18} color="white" />
                <Text style={menuStyles.buttonText}>{languages[language].load}</Text>
              </Pressable>
            </View>
          </Animated.View>
        </PanGestureHandler>
        <Pressable style={styles.fab} onPress={() => setAddModalVisible(true)}>
          <MaterialIcons name="add" size={24} color="white" />
        </Pressable>
      </KeyboardAvoidingView>

      {/* Save Modal */}
      <ScrollableModal
        visible={saveModalVisible}
        onClose={() => setSaveModalVisible(false)}
        title={languages[language].saveData}
        theme={theme}
        style={menuStyles.modalView}
      >
        {[
          <View key="saveModalContent" style={styles.modalInputContainer}>
            <MaterialIcons name="description" size={24} color={theme === 'dark' ? "#fff" : "#333"} />
            <TextInput
              style={[styles.modalInput, menuStyles.modalInput]}
              placeholder={languages[language].fileName}
              placeholderTextColor={theme === 'dark' ? "#888" : "#999"}
              value={fileName}
              onChangeText={setFileName}
            />
          </View>,
          <View key="saveModalButtons" style={styles.modalButtons}>
            <Pressable style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>{languages[language].save}</Text>
            </Pressable>
          </View>
        ]}
      </ScrollableModal>

      {/* Load Modal */}
      <ScrollableModal
        visible={loadModalVisible}
        onClose={() => setLoadModalVisible(false)}
        title={languages[language].loadData}
        theme={theme}
        style={menuStyles.modalView}
      >
        {[
          <FlatList
            key="fileList"
            data={savedFiles}
            renderItem={({ item }) => (
              <View style={[
                loadStyles.fileItemContainer, 
                menuStyles.fileItemContainer,
                { backgroundColor: theme === 'dark' ? '#333' : '#fff' }
              ]}>
                <Pressable style={loadStyles.fileItem} onPress={() => handleLoad(item)}>
                  <MaterialIcons name="insert-drive-file" size={24} color={iconColor} />
                  <Text style={[
                    loadStyles.fileItemText, 
                    menuStyles.fileItemText,
                    { color: theme === 'dark' ? '#fff' : '#000' }
                  ]}>{item}</Text>
                </Pressable>
                <Pressable style={loadStyles.loadDeleteButton} onPress={() => handleDeleteFile(item)}>
                  <MaterialIcons name="delete" size={24} color={theme === 'dark' ? "#FF6B6B" : "#F44336"} />
                </Pressable>
              </View>
            )}
            keyExtractor={(item) => item}
            ListEmptyComponent={<Text style={loadStyles.emptyText}>{languages[language].noSavedFiles}</Text>}
            style={loadStyles.fileList}
          />
        ]}
      </ScrollableModal>

      {/* Add Product Modal */}
      <ScrollableModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        title={languages[language].addProduct}
        theme={theme}
        style={menuStyles.modalView}
      >
        {[
          <View key="addProductModalContent" style={styles.modalInputContainer}>
            <MaterialIcons name="label" size={24} color={iconColor} />
            <TextInput
              style={[styles.modalInput, menuStyles.modalInput]}
              placeholder={languages[language].productName}
              placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
              value={newProduct.name}
              onChangeText={(text) => setNewProduct({...newProduct, name: text})}
            />
          </View>,
          <View key="addProductModalQuantity" style={styles.modalInputContainer}>
            <MaterialIcons name="format-list-numbered" size={24} color={iconColor} />
            <TextInput
              style={[styles.modalInput, menuStyles.modalInput]}
              placeholder={languages[language].quantity}
              placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
              value={newProduct.quantity}
              onChangeText={(text) => setNewProduct({...newProduct, quantity: text})}
              keyboardType="numeric"
            />
          </View>,
          <View key="addProductModalCost" style={styles.modalInputContainer}>
            <MaterialIcons name="attach-money" size={24} color={iconColor} />
            <TextInput
              style={[styles.modalInput, menuStyles.modalInput]}
              placeholder={languages[language].cost}
              placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
              value={newProduct.cost}
              onChangeText={(text) => setNewProduct({...newProduct, cost: text})}
              keyboardType="numeric"
            />
          </View>,
          <View key="addProductModalPrice" style={styles.modalInputContainer}>
            <MaterialIcons name="local-offer" size={24} color={iconColor} />
            <TextInput
              style={[styles.modalInput, menuStyles.modalInput]}
              placeholder={languages[language].sellingPrice}
              placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
              value={newProduct.price}
              onChangeText={(text) => setNewProduct({...newProduct, price: text})}
              keyboardType="numeric"
            />
          </View>,
          <View key="addProductModalButtons" style={styles.modalButtons}>
            <Pressable style={[styles.modalButton, styles.saveButton]} onPress={handleAddProduct}>
              <Text style={styles.buttonText}>{languages[language].add}</Text>
            </Pressable>
          </View>
        ]}
      </ScrollableModal>

      {/* Edit Product Modal */}
      <ScrollableModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title={languages[language].editProduct}
        theme={theme}
        style={menuStyles.modalView}
      >
        {editingProduct && (
          <View style={styles.editProductModalContent}>
            <View style={styles.modalInputContainer}>
              <MaterialIcons name="label" size={24} color={iconColor} />
              <TextInput
                style={[styles.modalInput, menuStyles.modalInput]}
                placeholder={languages[language].productName}
                placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
                value={editingProduct.name}
                onChangeText={(text) => setEditingProduct({...editingProduct, name: text})}
              />
            </View>
            <View style={styles.modalInputContainer}>
              <MaterialIcons name="format-list-numbered" size={24} color={iconColor} />
              <TextInput
                style={[styles.modalInput, menuStyles.modalInput]}
                placeholder={languages[language].quantity}
                placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
                value={editingProduct.quantity.toString()}
                onChangeText={(text) => setEditingProduct({...editingProduct, quantity: parseInt(text) || 0})}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.modalInputContainer}>
              <MaterialIcons name="attach-money" size={24} color={iconColor} />
              <TextInput
                style={[styles.modalInput, menuStyles.modalInput]}
                placeholder={languages[language].cost}
                placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
                value={editingProduct.cost.toString()}
                onChangeText={(text) => setEditingProduct({...editingProduct, cost: parseFloat(text) || 0})}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.modalInputContainer}>
              <MaterialIcons name="local-offer" size={24} color={iconColor} />
              <TextInput
                style={[styles.modalInput, menuStyles.modalInput]}
                placeholder={languages[language].sellingPrice}
                placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
                value={editingProduct.price.toString()}
                onChangeText={(text) => setEditingProduct({...editingProduct, price: parseFloat(text) || 0})}
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

      {/* CustomAlert for product deletion */}
      <CustomAlert
        visible={alertVisible}
        title={languages[language].confirmDeletion}
        message={languages[language].deleteProductConfirmation}
        onCancel={() => setAlertVisible(false)}
        onConfirm={() => {
          confirmDelete();
          setAlertVisible(false);
        }}
        cancelText={languages[language].cancel}
        confirmText={languages[language].delete}
        theme={theme}
      />

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

      {/* Options Menu */}
      <OptionsMenu
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        theme={theme}
      />
    </SafeAreaView>
  );
};

export default MainScreen;