import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import ResetPassword from '@/components/user/reset-password'
import { redirect } from 'next/navigation'
import Header from "@/components/header"
import initTranslations from '@/app/i18n'
import TranslationProvider from '@/providers/TranslationProvider'
import { getDomainConfig } from '@/utils/domainConfig'
import { headers } from "next/headers"
import { getAlternates } from '@/utils/getAlternates'

export async function generateMetadata({ params: { locale } }) {
  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })
  
  const { t } = await initTranslations(domain, locales, locale, ['metatags'])
  
  const domainName = domain.toUpperCase()
  const title = t('metatags.user.reset_password.title', { domain: domainName })
  const description = t('metatags.user.reset_password.description', { domain: domainName })
  const imgAlt = t('metatags.user.reset_password.img_alt', { domain: domainName })

  const alternates = getAlternates({ pageUrl: 'reset_password', domain, lang: locale })

  return {
    title: title,
    description: description,
    alternates: alternates,
    openGraph: {
      title: title,
      description: description,
      url: `https://${domain}/reset-password`,
      images: `/img/about/about.png`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@TPN",
      creator: "@TPN",
      title: title,
      description: description,
      image: {
        src: `/img/about/about.png`,
        alt: imgAlt,
      },
    },
  }
}

export default async function ResetPasswordPage({ params: { locale } }) {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }
  
  const i18nNamespaces = [
    'main', 'user'
  ]

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })

  const { resources } = await initTranslations(domain, locales, locale, i18nNamespaces)

  return (
    <TranslationProvider
      domain={domain}
      locales={locales}
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <Header />
      <section className="d-flex justify-center items-center p-4" style={{ height: "100vh" }}>
        <ResetPassword />
      </section>
    </TranslationProvider>
  )
}
