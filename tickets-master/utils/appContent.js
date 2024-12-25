import { defaultContent, domainContent } from "@/data/content"
import { objectDeepMerge } from '@/helpers/main'

export const getContent = (domain, contentKey, locale = null) => {
  const domainItem = domainContent[domain]?.[contentKey] ? domainContent[domain][contentKey] : {}
  const defaultItem = defaultContent[contentKey] ? defaultContent[contentKey] : {}
  let item = objectDeepMerge(defaultItem, domainItem)

  // For non-array items, if locale is specified and exists, merge it
  if (locale) {
    const localeItem = domainContent[domain]?.[contentKey]?.[locale] || domainContent[domain]?.[contentKey]?.default || {}
    const defaultLocaleItem = defaultContent[contentKey]?.[locale] || defaultContent[contentKey]?.default || {}
    item = objectDeepMerge(defaultLocaleItem, localeItem)
  }

  return item
}