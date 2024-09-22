import React from 'react';
import { View, Modal, Text, Pressable, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';

const ScrollableModal = ({ visible, onClose, title, children, style, theme }) => {
  const renderItem = ({ item }) => item;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalView, style, theme === 'dark' && styles.darkModalView]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme === 'dark' ? '#FFFFFF' : '#3F51B5' }]}>{title}</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={24} color={theme === 'dark' ? '#FFFFFF' : '#333'} />
            </Pressable>
          </View>
          <FlatList
            data={Array.isArray(children) ? children : [children]}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.scrollableModalContent}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ScrollableModal;