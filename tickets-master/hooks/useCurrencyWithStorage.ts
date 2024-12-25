import useLocalStorage from './useLocalStorage'
import { currencies } from '@/data/currencies'

export const useCurrencyWithStorage = (defaultCurrency) => {
    const currencyItem = currencies.find(item => item.currency === defaultCurrency)
    const [currency, setCurrency] = useLocalStorage('selectedCurrency', currencyItem)

    return [currency, setCurrency];
}