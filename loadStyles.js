import { StyleSheet } from 'react-native';

const loadStyles = StyleSheet.create({
    loadModalView: {
      maxHeight: '70%',
      minHeight: 200,
      width: '90%',
      maxWidth: 400,
      zIndex: 1001, // Higher than modalOverlay but lower than CustomAlert
    },
    fileList: {
      flex: 1,
      marginBottom: 16,
    },
    fileItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    fileItemText: {
      fontSize: 16,
      color: '#333',
      marginLeft: 8,
      flex: 1,
    },
    loadDeleteButton: {
      padding: 8,
    },
    closeButton: {
      padding: 8,
    },
    emptyText: {
      fontSize: 16,
      color: '#757575',
      textAlign: 'center',
      marginTop: 32,
    },
    darkFileItemContainer: {
      backgroundColor: '#333',
    },
    darkFileItemText: {
      color: '#FFFFFF',
    },
    darkEmptyText: {
      color: '#FFFFFF',
    },
  });
export default loadStyles;