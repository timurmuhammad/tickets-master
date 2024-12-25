import { createLocalizedPathnamesNavigation } from 'next-intl/navigation'
import { Pathnames } from 'next-intl/routing'
import { allLocales } from '@/data/locales'

export const defaultLocale = 'en'
export const locales = allLocales

export const localePrefix = 'as-needed'

export const pathnames = {} satisfies Pathnames<typeof locales>;

export const {Link, redirect, usePathname, useRouter} = createLocalizedPathnamesNavigation({
  locales,
  localePrefix,
  pathnames
})