'use client'

import { useTranslation } from 'react-i18next'
import { Link } from "@/navigation"
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'

const AppBlock = () => {
  const { t } = useTranslation(['app_banner'])

  const { appName } = useContext(AppContext)

  return (
    <div className="row y-gap-40 justify-between items-center">
      <div className="col-xl-5">
        <h2 className="text-30 lh-15">{t('app_banner.banner_title', { appName: appName })}</h2>
        <p className="text-dark-1 pr-40 lg:pr-0 mt-15 sm:mt-5">
          {t('app_banner.banner_description', { appName: appName })}
        </p>

        <div className="d-inline-block mt-40 lg:mt-30">
          <Link 
            href="https://apps.apple.com/app/tickets/id1483618935" 
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            className="button -md -blue-1 bg-dark-4 text-white">
              {t('app_banner.banner_img_alt', { appName: appName })} <div className="icon-arrow-top-right ml-15"></div>
          </Link>
        </div>
      </div>

      <div className="col-xl-6">
        <img src="/img/misc/app.png" alt={t('app_banner.banner_img_alt', { appName: appName })} className="rounded-22" />
      </div>
    </div>
  );
};

export default AppBlock;
