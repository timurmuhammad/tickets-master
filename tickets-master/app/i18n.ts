import { Resource, createInstance, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getI18nConfig, objectDeepMerge } from '@/helpers/main';

export default async function initTranslations(
  domain: string,
  locales: string[],
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
  resources?: Resource
) {
  const i18nConfig = getI18nConfig(locales);
  i18nInstance = i18nInstance || createInstance();
  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(async (language: string) => {
        // Initialize a new object to hold all combined translations
        let combinedTranslations = {};

        // Load default translations
        const defaultPromises = namespaces.map(async (namespace) => {
          const path = namespace.includes('/')
          ? `${namespace}/main`
          : `common/${namespace}`;
          try {
            const translations = (await import(`@/messages/default/${language}/${path}.json`)).default;
            combinedTranslations = objectDeepMerge(combinedTranslations, translations);
          } catch (error) {
            console.error(`Error loading default translations for namespace ${namespace}:`, error);
          }
        })

        // Load domain-specific translations if a domain is provided
        const domainPromises = domain
          ? namespaces.map(async (namespace) => {
              const path = namespace.includes('/')
                ? `${namespace}/main`
                : `common/${namespace}`;
              try {
                const translations = (await import(`@/messages/${domain}/${language}/${path}.json`)).default;
                combinedTranslations = objectDeepMerge(combinedTranslations, translations);
              } catch (error) {
                console.error(`Error loading domain translations for namespace ${namespace}:`, error);
              }
            })
          : []

        // Wait for all translations to load and merge into combinedTranslations
        await Promise.all([...defaultPromises, ...domainPromises]);

        return combinedTranslations;
      })
    );
  }

  // Initialize i18n instance with the configuration and resources
  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: ['main'],
    fallbackNS: ['main'],
    ns: ['main'],
    preload: resources ? [] : i18nConfig.locales,
    detection: {
      order: ['cookie', 'path']
    }
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t
  };
}