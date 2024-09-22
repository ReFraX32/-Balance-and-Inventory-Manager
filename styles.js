import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F51B5',
    marginBottom: 16,
    textAlign: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#E8EAF6',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F51B5',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 40,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  halfInput: {
    width: width < 600 ? '100%' : '48%',
  },
  addButton: {
    backgroundColor: '#3F51B5',
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  productItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F51B5',
    marginBottom: 8,
  },
  productDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  productTotalsCost: {
    fontSize: 14,
    color: 'darkred',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  productTotalsProfit: {
    fontSize: 14,
    color: 'green',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  productTotalsLost: {
    fontSize: 14,
    color: 'red',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  productTotalsPrice: {
    fontSize: 14,
    color: 'darkgreen',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 4,
    flex: 1,
  },
  editButton: {
    backgroundColor: '#FF9800',
    marginRight: 4,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    marginLeft: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  editCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F51B5',
    marginBottom: 16,
  },
  editField: {
    marginBottom: 16,
  },
  editLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  editInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  halfWidth: {
    width: width < 600 ? '100%' : '48%',
  },
  animatedContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  saveChangesButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bottomButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  loadButton: {
    backgroundColor: '#2196F3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  modalInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  modalButtons: {
    alignItems: 'center',
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    width: '50%',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    marginLeft: 8,
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alertMessage: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  alertButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  alertButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#3F51B5',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addProductModalView: {
    maxHeight: '80%',
  },
  editProductModalView: {
    width: '90%',
    maxWidth: 400,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    textAlign: 'center',
  },
  productItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F51B5',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 32,
  },
  addButton: {
    backgroundColor: '#FF9800',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  tableContainer: {
    flex: 1,
    marginBottom: 80,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cell: {
    fontSize: 14,
    color: '#333',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    textAlign: 'right',
    justifyContent: 'center',
  },
  swipeIndicatorLeft: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 10,
    zIndex: 1,
  },
  swipeIndicatorRight: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 10,
    zIndex: 1,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    padding: 10,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  lastCell: {
    borderRightWidth: 0,
  },
  editEntryModalView: {
    width: '90%',
    maxWidth: 400,
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  ingresosCell: {
    color: 'darkgreen',
    fontWeight: 'bold',
  },
  egresosCell: {
    color: 'darkred',
    fontWeight: 'bold',
  },
  saldoDiarioPositiveCell: {
    color: 'seagreen',
    fontWeight: 'bold',
  },
  saldoDiarioNegativeCell: {
    color: 'crimson',
    fontWeight: 'bold',
  },
  saldoDiarioNeutralCell: {
    color: 'grey',
    fontWeight: 'bold',
  },
  saldoTotalPositiveCell: {
    color: 'green',
    fontWeight: 'bold',
  },
  saldoTotalNegativeCell: {
    color: 'red',
    fontWeight: 'bold',
  },
  saldoTotalNeutralCell: {
    color: 'grey',
    fontWeight: 'bold',
  },
  scrollableModalView: {
    maxHeight: '80%',
  },
  scrollableModalContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
    padding: 10,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  searchCloseButton: {
    padding: 10,
  },
  listContentContainer: {
    flexGrow: 1,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  darkText: {
    color: '#fff',
  },
  darkProductItem: {
    backgroundColor: '#333',
  },
  darkSummaryCard: {
    backgroundColor: '#1E1E1E',
  },
  productTotalsNeutral: {
    color: '#757575',
  },
  optionsIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
    padding: 10,
  },
  darkSaveButton: {
    backgroundColor: '#45a049', // Slightly darker green for dark theme
  },
  darkLoadButton: {
    backgroundColor: '#1e88e5', // Slightly darker blue for dark theme
  },
  darkNeutralBalance: {
    color: '#9e9e9e', // Lighter grey for dark theme
  },
  darkTotalProfit: {
    color: '#66bb6a', // Lighter green for dark theme
  },
  darkTotalLoss: {
    color: '#ef5350', // Lighter red for dark theme
  },
  darkProductProfit: {
    color: '#66bb6a', // Lighter green for dark theme
  },
  darkProductLoss: {
    color: '#ef5350', // Lighter red for dark theme
  },
  darkProductNeutralBalance: {
    color: '#9e9e9e', // Lighter grey for dark theme
  },
  productTotalsProfit: {
    color: '#4CAF50', // Green for light mode
  },
  productTotalsLost: {
    color: '#F44336', // Red for light mode
  },
  productTotalsNeutral: {
    color: '#757575', // Grey for light mode
  },
  darkProductTotalsProfit: {
    color: '#66bb6a', // Green for dark mode
  },
  darkProductTotalsLost: {
    color: '#ef5350', // Red for dark mode
  },
  darkProductTotalsNeutral: {
    color: '#9e9e9e', // Grey for dark mode
  },
  darkTableHeader: {
    backgroundColor: '#333',
  },
  darkTableRow: {
    borderBottomColor: '#444',
  },
  darkCell: {
    color: '#FFFFFF',
    borderRightColor: '#444',
  },
  darkBottomButtonsContainer: {
    backgroundColor: '#121212',
    borderTopColor: '#333',
  },
  darkModalView: {
    backgroundColor: '#121212',
  },
  darkModalTitle: {
    color: '#FFFFFF',
  },
  darkModalInput: {
    color: '#FFFFFF',
    backgroundColor: '#333',
    borderColor: '#555',
  },
  darkHeaderCell: {
    color: '#FFFFFF',
  },

  darkDescriptionText: {
    color: '#FFFFFF',
  },
  darkDateText: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
    textAlign: 'center',
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 10,
    textAlign: 'center',
    maxWidth: '80%',
  },
  darkText: {
    color: '#999',
  },
  darkRecommendationText: {
    color: '#999',
  },
  darkAnimatedContainer: {
    backgroundColor: '#121212', // Dark mode background
  },
});

export default styles;