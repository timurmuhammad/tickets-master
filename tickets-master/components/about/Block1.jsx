'use client'

import { Link } from "@/navigation"
import Image from "next/image"
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { getContent } from '@/utils/appContent'

const Block1 = () => {
  const { t } = useTranslation(['about'])

  const { appName, domain } = useContext(AppContext)

  const { imageSrc, altName } = getContent(domain, 'aboutCounter')

  return (
    <>
      <div className="col-xl-4 col-lg-5">
        <h2 className="text-30 fw-600"><Link href="/">{t('about.content_title', { appName: appName })}</Link></h2>
        <h3 className="text-14 fw-400 mt-5">{t('about.content_sub')}</h3>
        <p className="text-dark-1 mt-40 xl:mt-30 lg:mt-20">
          {t('about.content_description_1', { appName: appName })}
          <br/>
          <br/>
          {t('about.content_description_2', { appName: appName })}
        </p>
      </div>
      {/* End .col */}

      <div className="col-xl-5 col-lg-5">
        <Image
          width={400}
          height={400}
          src={imageSrc}
          alt={t(`${altName}`, { appName: appName })}
          className="rounded-22 w-100"
        />
      </div>
      {/* End .col */}
    </>
  );
};

export default Block1;
