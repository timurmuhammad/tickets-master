'use client'

import { Link } from "@/navigation"
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { Trans } from "react-i18next"

const DetailsContent = () => {
  const { t } = useTranslation(['about'])

  const { appName } = useContext(AppContext)

  return (
    <>
      <Trans
        i18nKey="about.content"
        values={{ appName: appName }}
        components={{
          titleText: (
            <h3 className="text-20 fw-500 mb-10"/>
          ),
          itemText: (
            <div className='text-15'/>
          ),
          itemTextBig: (
            <div className='text-18 fw-500 mt-30 mb-20'/>
          ),
          linkText: (
            <Link
              href="/"
              className="underline"
            />
          ),
          bText: (
            <b />
          ),
          quote: (
            <div className="quote mt-40 mb-40">
              <div className="quote__line bg-dark-1" />
              <div className="quote__icon">
                <img src="/img/misc/quote-light.svg" alt={t('about.quote_imgAlt', { appName: appName })} />
              </div>
              <div className="text-18 fw-500">
                {t('about.quote', { appName: appName })}
              </div>
            </div>
          ),
          ulText: (
            <ul className="list-disc text-16"/>
          ),
          liItem: (
            <li />
          ),
          liText: (
            <div className="text-15 text-dark-1 mb-15"/>
          )
        }}
      />
    </>
  );
};

export default DetailsContent;
