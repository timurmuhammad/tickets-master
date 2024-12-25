import { locales } from "@/data/locales"
import { defaultLocale } from "@/navigation"
import { continents } from "@/data/skyscannerContinents"
import { countries } from "@/data/skyscannerCountries"
import { cities } from "@/data/skyscannerCities"

interface DateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export const formatDateTime = ({
  datetime,
  isShort = false,
  data = ['year', 'month', 'day'],
  locale = defaultLocale
} : {
  datetime: DateTime;
  isShort?: boolean;
  data?: Array<'year' | 'month' | 'day' | 'weekday'>;
  locale?: string;
}): { formattedDate: string; formattedTime: string } => {
  const newLocale = locales.find((lang) => lang.shortName === locale)?.longName

  let formattedDate = ''
  let formattedTime = ''

  if (datetime) {
    const newData: Intl.DateTimeFormatOptions = {};
    if (data.includes('year')) {
      newData.year = 'numeric';
    }
    if (data.includes('month')) {
      newData.month = 'short';
    }
    if (data.includes('day')) {
      newData.day = 'numeric';
    }
    if (data.includes('weekday')) {
      newData.weekday = 'long';
    }

    const date = new Date(datetime.year, datetime.month - 1, datetime.day, datetime?.hour ?? 0, datetime?.minute ?? 0);
    formattedDate = isShort ?
      date.toLocaleDateString(newLocale, {
        ...newData,
        month: 'short',
        weekday: data.includes('weekday') ? 'short' : undefined
      }) : date.toLocaleDateString(newLocale, newData);

    // Using toLocaleTimeString for better localization support
    formattedTime = date.toLocaleTimeString(newLocale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  return { formattedDate, formattedTime };
}

export const formatMinutes = (mins) => {
  const hours = Math.floor(mins / 60)
  const minutes = mins % 60

  return { minutes, hours}
}

export function getLocation({ locationType = null, toPlace = null, exclude = [] }: { locationType: any, toPlace: any, exclude: any[] }) {
  let locationId = {}
  let locationArr: any[] = []

  if (locationType == 'city') {
    locationId = toPlace?.entityId
    locationArr = cities
    if (toPlace?.type && toPlace?.type == 'PLACE_TYPE_AIRPORT') {
      locationId = toPlace?.parentId
    }
  } else if (locationType == 'country') {
    locationId = toPlace?.entityId
    locationArr = countries
  } else if (locationType == 'continent') {
    locationId = toPlace?.entityId
    locationArr = continents
  } else {
    if (toPlace?.slug == 'anywhere') {
      return {
        name: 'Anywhere',
        slug: 'anywhere',
        type: 'PLACE_TYPE_ANYWHERE'
      }
    } else {
      return (!exclude.includes('cities')
        ? cities.find(item => item.entityId === toPlace?.parentId || item.entityId === toPlace?.entityId || (item.slug && item.slug === toPlace?.slug))
        : null)
      ?? (!exclude.includes('countries')
        ? countries.find(item => item.entityId === toPlace?.entityId || (item.slug && item.slug === toPlace?.slug))
        : null)
      ?? (!exclude.includes('continents')
        ? continents.find(item => item.entityId === toPlace?.entityId || (item.slug && item.slug === toPlace?.slug))
        : null)
    }
  }

  const location = locationArr.find(item => item.entityId == locationId)

  return location
}

export function getLocationUrl({ locationType = null, location = null }: { locationType: any, location: any }) {
  if (locationType == 'anywhere' || location?.type == 'PLACE_TYPE_ANYWHERE') {
    return '/cheap-flights-anywhere'
  }

  let url = '/destinations'

  if (locationType == 'city' || location?.type == 'PLACE_TYPE_CITY') {
    const country = countries.find(item => item.entityId == location?.parentId)
    const continent = continents.find(item => item.entityId == country?.parentId)
    url += `/${continent?.slug}/${country?.slug}/${location?.slug}`
  } else if (locationType == 'country' || location?.type == 'PLACE_TYPE_COUNTRY') {
    const continent = continents.find(item => item.entityId == location?.parentId)
    url += `/${continent?.slug}/${location?.slug}`
  } else {
    url += `/${location?.slug}`
  }

  return url
}

export function getDestinations(entityIds, array) {
  return entityIds.map((item) => {
    return array.find(findItem => findItem.entityId == item)
  })
}

export function objectDeepMerge(target, source) {
  if (typeof target !== 'object' || target === null) target = {};
  if (typeof source !== 'object' || source === null) return source;

  const output = Array.isArray(target) ? [...target] : { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (Array.isArray(source[key])) {
        output[key] = [...source[key]];
      } else if (source[key] instanceof Object && key in target) {
        output[key] = objectDeepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }

  return output;
}

export function getI18nConfig(locales = []) {
  const newLocales = [...locales]
  const defaultLocale = newLocales[0]
  return {
    locales,
    defaultLocale,
  }
}