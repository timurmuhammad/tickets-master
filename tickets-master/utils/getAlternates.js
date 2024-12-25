import { getDomainConfig } from '@/utils/domainConfig'
import { getContent } from '@/utils/appContent'

export const getAlternates = ({ pageUrl = '/', domain, lang }) => {
  // Retrieve configuration for the domain
  const { market, langs: locales } = getDomainConfig({ host: domain })
  const { addMarketToMain = false, langswithMarkets } = getContent(domain, 'alternates') || {};

  // Determine the default locale, assumed to be the first in the array
  const defaultLocale = locales[0];

  // Object to hold the language alternatives
  const languages = {};

  // Helper function to insert language code after domain but before the rest of the path
  const createUrlWithLang = (path, langCode) => {
    if (langCode === defaultLocale) return path === '/' ? path : path.replace(/\/$/, '');
    
    // Special handling for root path
    if (path === '/') {
      return `/${langCode}`;
    }

    // Get the path parts and remove any existing language code
    const pathParts = path.split('/').filter(Boolean);
    if (locales.includes(pathParts[0])) {
      pathParts.shift();
    }

    // Construct the new URL with language code and path
    const url = pathParts.length > 0 ? `/${langCode}/${pathParts.join('/')}` : `/${langCode}`;
    return url.replace(/\/$/, ''); // Remove trailing slash if present
  };

  // Set x-default to use the current language path if it's not the default locale
  languages[`x-default`] = createUrlWithLang(pageUrl, defaultLocale);

  // Helper function to handle default language market codes
  const handleDefaultLanguage = (locale) => {
    if (Array.isArray(addMarketToMain) && addMarketToMain.length > 0) {
      // Add all specified markets for the main language
      addMarketToMain.forEach(specificMarket => {
        languages[`${locale}-${specificMarket}`] = createUrlWithLang(pageUrl, locale);
      });
    } else if (addMarketToMain === true) {
      // Add default market only
      languages[`${locale}-${market}`] = createUrlWithLang(pageUrl, locale);
    } else {
      // No market
      languages[locale] = createUrlWithLang(pageUrl, locale);
    }
  };

  // Adding primary locales, consider default locale in the URL
  locales.forEach((locale) => {
    if (langswithMarkets) {
      // If langswithMarkets exists, use its configuration
      const markets = langswithMarkets[locale];
      
      if (markets === undefined) {
        // If language not specified in langswithMarkets
        if (locale === defaultLocale) {
          handleDefaultLanguage(locale);
        } else {
          languages[`${locale}-${market}`] = createUrlWithLang(pageUrl, locale);
        }
      } else if (markets.length > 0) {
        // Add specified markets for this language
        markets.forEach(specificMarket => {
          languages[`${locale}-${specificMarket}`] = createUrlWithLang(pageUrl, locale);
        });
      } else {
        // Empty array means no market code
        languages[locale] = createUrlWithLang(pageUrl, locale);
      }
    } else {
      // If langswithMarkets doesn't exist
      if (locale === defaultLocale) {
        handleDefaultLanguage(locale);
      } else {
        languages[`${locale}-${market}`] = createUrlWithLang(pageUrl, locale);
      }
    }
  });

  // Constructing the result object
  return {
    canonical: createUrlWithLang(pageUrl, lang),
    languages: languages
  };
}