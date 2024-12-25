import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import SignupForm from '@/components/user/signup-form'
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
  const title = t('metatags.user.signup.title', { domain: domainName })
  const description = t('metatags.user.signup.description', { domain: domainName })
  const imgAlt = t('metatags.user.signup.img_alt', { domain: domainName })

  const alternates = getAlternates({ pageUrl: 'signup', domain, lang: locale })

  return {
    title: title,
    description: description,
    alternates: alternates,
    openGraph: {
      title: title,
      description: description,
      url: `https://${domain}/signup`,
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

export default async function SignupPage({ params: { locale } }) {
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
        <SignupForm />
      </section>
    </TranslationProvider>
  )
}
