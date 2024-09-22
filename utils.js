import { useConversionMode, useCurrencySymbol } from './SettingsContext';

export const formatCurrency = (number, conversionMode, currencySymbol) => {

    if (number == null) return `${currencySymbol}0${conversionMode === 'point' ? '.' : ','}00`;
    
    const parts = Number(number).toFixed(2).split('.');

    if (conversionMode === 'point') {
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${currencySymbol}${parts.join(',')}`;
    } else {
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${currencySymbol}${parts.join('.')}`;
    }
};