import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Modal } from 'react-native';

const CustomAlert = ({ visible, title, message, onCancel, onConfirm, cancelText = "Cancel", confirmText = "Confirm", theme }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={[styles.alertBox, theme === 'dark' && styles.darkAlertBox]}>
          <Text style={[styles.title, theme === 'dark' && styles.darkText]}>{title}</Text>
          <Text style={[styles.message, theme === 'dark' && styles.darkText]}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.button, styles.cancelButton, theme === 'dark' && styles.darkCancelButton]} 
              onPress={onCancel}
              android_ripple={{color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}
            >
              <Text style={[styles.buttonText, theme === 'dark' && styles.darkCancelButtonText]}>{cancelText}</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.confirmButton]} 
              onPress={onConfirm}
              android_ripple={{color: 'rgba(255,255,255,0.1)'}}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  darkAlertBox: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  darkCancelButton: {
    backgroundColor: '#555',
  },
  confirmButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  darkCancelButtonText: {
    color: '#fff',
  },
});

export default CustomAlert;