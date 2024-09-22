import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const baseStyles = {
  // ... copy all your existing styles from styles.js here ...
};

const createResponsiveStyles = () => {
  const isLandscape = width > height;

  return StyleSheet.create({
    ...baseStyles,
    container: {
      ...baseStyles.container,
      paddingHorizontal: isLandscape ? 20 : 16,
    },
    title: {
      ...baseStyles.title,
      fontSize: isLandscape ? 28 : 24,
    },
    summaryCard: {
      ...baseStyles.summaryCard,
      flexDirection: isLandscape ? 'row' : 'column',
      justifyContent: isLandscape ? 'space-between' : 'flex-start',
    },
    bottomButtonsContainer: {
      ...baseStyles.bottomButtonsContainer,
      flexDirection: isLandscape ? 'row' : 'column',
      alignItems: isLandscape ? 'center' : 'stretch',
    },
    bottomButton: {
      ...baseStyles.bottomButton,
      marginVertical: isLandscape ? 0 : 8,
      marginHorizontal: isLandscape ? 8 : 0,
    },
    modalView: {
      ...baseStyles.modalView,
      width: isLandscape ? '70%' : '90%',
      maxHeight: isLandscape ? '90%' : '80%',
    },
    table: {
      ...baseStyles.table,
      maxHeight: isLandscape ? height * 0.6 : height * 0.5,
    },
  });
};

export default createResponsiveStyles;