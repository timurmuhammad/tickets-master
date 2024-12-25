'use client'

import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { Link } from "@/navigation"
import { useTranslation } from 'react-i18next'

const AboutIntro = () => {
  const { t } = useTranslation(['home'])
  const { appName } = useContext(AppContext)

  return (
    <section className="section-bg layout-pt-lg layout-pb-lg">
      <div className="section-bg__item -right -w-1165 bg-light-2" />
      <div className="section-bg__item -video-left">
        <div className="row y-gap-30">
          <div className="col-sm-6">
            <img src="/img/misc/eiffel-tower.jpg" className="rounded-22 shadow-new" alt={t('home.about_img_1', { name: appName })} />
          </div>
          {/* End .col */}

          <div className="col-sm-6">
            <img src="/img/misc/palm.jpg" className="rounded-22 shadow-new" alt={t('home.about_img_2', { name: appName })} />
          </div>
        </div>
        {/* End .row */}
      </div>
      {/* End .section-bg__item */}

      <div className="container lg:mt-30">
        <div className="row">
          <div className="offset-xl-6 col-xl-5 col-lg-6">
            <h2 className="text-30 fw-600">{t('home.about_title', { name: appName })}</h2>
            <p className="text-dark-1 mt-40 lg:mt-20 sm:mt-15">
              {t('home.about_sub')}
            </p>
            <div className="d-inline-block mt-40 lg:mt-30 sm:mt-20">
              <Link
                href="https://ttm.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="button -md -blue-1 bg-dark-4 text-white"
              >
                {t('home.about_us')} <div className="icon-arrow-top-right ml-15" />
              </Link>
            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
      {/* End .col */}
    </section>
  );
};

export default AboutIntro;
