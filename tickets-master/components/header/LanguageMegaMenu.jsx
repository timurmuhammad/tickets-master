'use client'

import { useState } from "react"
import { Link, usePathname } from '@/navigation'
import { useSearchParams } from 'next/navigation'
import { useHash } from '@/hooks/useHash'
import { locales as fullLocales } from "@/data/locales"
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { useTranslation } from 'react-i18next'
import NextLink from 'next/link'

const LanguageMegaMenu = ({ textClass }) => {
  const { t } = useTranslation(['header'])

  const pathname = usePathname()
  const hash = useHash()
  const search = useSearchParams()
  const urlData = `${search ? `?${search}` : ''}${hash}`
  const { langs, locale } = useContext(AppContext)
  const defaultLocale = langs[0]
  const [selectedLanguage, setSelectedLanguage] = useState(fullLocales.find((lang) => lang.shortName === locale))
  
  const availableLanguages = langs.map((locale) => {
    return fullLocales.find((lang) => lang.shortName === locale);
  });

  const [click, setClick] = useState(false);
  const handleLanguage = () => setClick((prevState) => !prevState);

  const handleItemClick = (item) => {
    setSelectedLanguage(item);
    setClick(false);
  };

  const localeItem = (item, isActive) => {
    return (
      <div className={`modalMenu__item py-15 px-20 sm:px-15 sm:py-10 ${isActive ? 'active' : ''}`}>
        <div className="text-15 lh-15 fw-500 text-dark-1">
          {item.name}
        </div>
        <div className="text-14 lh-15 mt-5 js-title">
          {item.native}
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="col-auto">
        <button
          className={`d-flex items-center text-14 ${textClass}`}
          onClick={handleLanguage}
        >
          <i className="icon icon-globe text-16 mr-5" />
          <span className="js-langMenu-mainTitle">
            {" "}
            {selectedLanguage?.native}
          </span>
        </button>
      </div>

      {click && (
        <div className={`modalMenu js-langMenu`}>
          <div className="modalMenu__bg" onClick={handleLanguage}></div>
          <div className="modalMenu__content">
            <div className="bg-white rounded-16">
              <div className="d-flex items-center justify-between px-30 py-20 sm:px-25 border-bottom-light">
                <div className="text-20 fw-500 lh-15">{t('header.select_language')}</div>
                <button className="pointer" onClick={handleLanguage}>
                  <i className="icon-close" />
                </button>
              </div>
              <div className="row px-30 py-30 y-gap-20 sm:px-15 sm:py-15" style={{ flexWrap: 'wrap' }}>
                {availableLanguages.map((item, index) => {
                  const isSelected = selectedLanguage?.native === item.native
                  return (
                    <div
                      className={`col-6 col-md-3 col-sm-3`}
                      key={index}
                      onClick={() => handleItemClick(item)}
                    >
                      {isSelected ? (
                        localeItem(item, true)
                      ) : (item.shortName == defaultLocale ? (
                        <NextLink href={`${pathname.replace(`/${locale}`, '')}${urlData}`}>
                          {localeItem(item, false)}
                        </NextLink>
                      ) : (
                        <Link href={`${pathname}${urlData}`} locale={item.shortName}>
                          {localeItem(item, false)}
                        </Link>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageMegaMenu;
