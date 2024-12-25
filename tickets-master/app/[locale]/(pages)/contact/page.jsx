import CallToActions from "@/components/common/CallToActions";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Address from "@/components/block/Address";
import Social from "@/components/common/social/Social";
import ContactForm from "@/components/common/ContactForm";
import Faq from "@/components/faq/Faq";
import TranslationProvider from '@/providers/TranslationProvider';
import initTranslations from '@/app/i18n';
import { getDomainConfig } from '@/utils/domainConfig';
import { headers } from "next/headers";
import { getAlternates } from '@/utils/getAlternates';
import { getContent } from '@/utils/appContent'

export async function generateMetadata({ params: { locale } }) {
  const headerList = headers();
  const reqHost = headerList.get("x-current-domain");
  const { domain, langs: locales } = getDomainConfig({ host: reqHost });

  const { t } = await initTranslations(domain, locales, locale, ['metatags']);

  const domainName = domain.toUpperCase();
  const title = t('metatags.contact.title', { domain: domainName });
  const description = t('metatags.contact.description', { domain: domainName });
  const imgAlt = t('metatags.contact.img_alt', { domain: domainName });

  const alternates = getAlternates({ pageUrl: 'contact', domain, lang: locale });

  return {
    title: title,
    description: description,
    alternates: alternates,
    openGraph: {
      title: title,
      description: description,
      url: `https://${domain}/contact`,
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
  };
}

const Contact = async ({ params: { locale } }) => {
  const i18nNamespaces = ['main', 'pages/contact'];

  const headerList = headers();
  const reqHost = headerList.get("x-current-domain");
  const { domain, langs: locales, appName } = getDomainConfig({ host: reqHost });
  const mapCoordinates = getContent(domain, 'mapCoordinates');

  const { t, resources } = await initTranslations(domain, locales, locale, i18nNamespaces);

  return (
    <TranslationProvider
      domain={domain}
      locales={locales}
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <div className="header-margin"></div>
      {/* header top margin */}

      <Header />

      <div className="map-outer">
        <div className="map-canvas">
          <iframe
            src={mapCoordinates}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      {/* End map section */}

      <section className="relative container layout-pb-md sm:pb-60">
        <div className="row justify-end">
          <div className="col-xl-5 col-lg-7">
            <div className="map-form px-40 pt-40 pb-50 lg:px-30 lg:py-30 md:px-24 md:py-24 bg-white rounded-22 shadow-1">
              <h1 className="text-22 fw-500">{t('contact.send_message')}</h1>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      {/* End contact section form */}

      <section className="layout-pt-md layout-pb-md bg-light-2">
        <div className="container">
          <div className="row x-gap-80 y-gap-20 justify-between">
            <div className="col-12">
              <div className="text-30 sm:text-24 fw-600">{t('contact.get_in_touch')}</div>
            </div>
            {/* End .col */}

            <Address t={t} />
            {/* End address com */}

            <div className="col-auto">
              <div className="text-14 text-light-1">
                {t('contact.social_follow')}
              </div>
              <div className="d-flex x-gap-20 items-center mt-10">
                <Social />
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* End Address Section */}

      <section className="layout-pt-md layout-pb-lg sm:pt-60">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  {t('contact.title_faq')}
                </h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  {t('contact.subtitle_faq')}
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row y-gap-30 justify-center pt-40 sm:pt-20">
            <div className="col-xl-7 col-lg-10">
              <div
                className="accordion -simple row y-gap-20 js-accordion"
                id="Faq1"
              >
                <Faq dataName="contact" dataValue={appName} />
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End faq section block */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <Footer />
      {/* End Footer */}
    </TranslationProvider>
  );
};

export default Contact;
