'use client'

import Image from "next/image"
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { getContent } from '@/utils/appContent'

const DetailsContent = () => {
  const { t } = useTranslation(['about'])

  const { appName, domain } = useContext(AppContext)

  const { imageSrc, altName } = getContent(domain, 'aboutHero')

  return (
    <section className="section-bg layout-pt-lg layout-pb-lg">
      <div className="section-bg__item col-12">
        <Image
          width={1920}
          height={400}
          src={imageSrc}
          alt={t(`${altName}`, { appName: appName })}
          priority
        />
      </div>
      {/* End section-bg__item */}

      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-xl-6 col-lg-8 col-md-10">
            <h1 className="text-60 md:text-20 fw-500 text-white lh-1">
              {t('about.hero_title', { appName: appName })}
            </h1>
            <h2 className="text-white md:text-25 mt-15 fw-400 lh-1">
              {t('about.hero_sub')}
            </h2>
          </div>
        </div>
      </div>
      {/* End .container */}
    </section>
  );
};

export default DetailsContent;
