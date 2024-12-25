import Header from "@/components/header";
import Footer from "@/components/footer";
import NotFound from "@/components/common/NotFound";
import CallToActions from "@/components/common/CallToActions";
import initTranslations from '@/app/i18n';
import TranslationProvider from '@/providers/TranslationProvider';
import { getDomainConfig } from '@/utils/domainConfig'
import { headers } from "next/headers"

export const metadata = {
  title: "404 | TICKETS",
  description: "Page not found",
};

const index = async ({ params: { locale } }) => {
  const i18nNamespaces = [
    'main'
  ]

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain, langs: locales } = getDomainConfig({ host: reqHost })

  const { resources } = await initTranslations(domain, locales, locale, i18nNamespaces);

  return (
    <TranslationProvider
      domain={domain}
      locales={locales}
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <div className="header-margin"></div>

      <Header />

      <NotFound />

      <CallToActions />

      <Footer />
    </TranslationProvider>
  );
};

export default index
