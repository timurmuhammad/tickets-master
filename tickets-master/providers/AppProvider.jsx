'use client';

import { AppContext } from '@/contexts/AppContext';
import { getDomainConfig } from '@/utils/domainConfig';
import { useCurrencyWithStorage } from '@/hooks/useCurrencyWithStorage'; // Updated import
import { getI18nConfig } from '@/helpers/main';

export const AppProvider = ({ children, host, locale }) => {
  const { domain, appName, langs, defaultCurrency } = getDomainConfig({ host })
  const { defaultLocale } = getI18nConfig(langs)
  const localePrefix = locale === defaultLocale ? '' : locale
  const [currencyItem, setCurrencyItem] = useCurrencyWithStorage(defaultCurrency)
  const { currency, symbol } = currencyItem

  return (
    <AppContext.Provider value={{ domain, appName, langs, locale, localePrefix, currency, currencySymbol: symbol, setCurrencyItem }}>
      {children}
    </AppContext.Provider>
  );
};
