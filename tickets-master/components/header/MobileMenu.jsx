"use client";

import { Link } from "@/navigation";
import CurrencyMegaMenu from "./CurrencyMegaMenu";
import LanguageMegaMenu from "./LanguageMegaMenu";
import {
  Sidebar,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
import Social from "../common/social/Social";
import ContactInfo from "./ContactInfo";
import { usePathname, useRouter } from "@/navigation";
import useMenu from "@/hooks/useMenu"
import { mainMenu as mainMenuData } from "@/data/menu"
import { useTranslation } from 'react-i18next'

const MobileMenu = ({ imageSrc, altName, minimalistic = false }) => {
  const { t } = useTranslation(['header', 'badges'])

  const pathname = usePathname()
  const router = useRouter()
  const mainMenu = useMenu({ menu: mainMenuData })

  return (
    <>
      <div className="pro-header d-flex align-items-center justify-between border-bottom-light">
        {pathname === "/" ? (
          <div>
            <img src={imageSrc} alt={altName} className="h-20 pl-10" />
          </div>
        ) : (
          <Link href="/">
            <img src={imageSrc} alt={altName} className="h-20 pl-10" />
          </Link>
        )}

        <div
          className="fix-icon"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="icon icon-close"></i>
        </div>
        {/* icon close */}
      </div>
      {/* End pro-header */}

      {!minimalistic && (
        <Sidebar width="400" backgroundColor="#fff">
          <Menu>
            
            {mainMenu.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  onClick={item.openInNewTab ? ()=>window.open(item.link, '_blank') : ()=>router.push(item.link)}
                  className={
                    pathname === item.link
                      ? "menu-active-link"
                      : ""
                  }
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  rel={item.rel ? Object.keys(item.rel).filter(key => item.rel[key]).join(' ') : ''}
                >
                  <div className="d-flex align-items-center">
                    {t(`header.${item.title}`)}

                    {item.badge && (
                      <div
                        className="pl-8"
                      >
                        <div
                          className={`text-12 fw-600 flex-center ${item.badgeClassName}`}
                          style={{ padding: '1px 7px', minWidth: '28px' }}
                        >
                          <span>{t(`badges.${item.badge}`)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </MenuItem>
              )
            })}

          </Menu>
        </Sidebar>
      )}

      <div className="mobile-footer px-20 py-5 border-top-light"></div>

      <div className="pro-footer">
        <ContactInfo t={t} />
        <div className="mt-10">
          <div className="text-16 fw-500 mb-10">{t('header.social_follow')}</div>
          <div className="d-flex x-gap-20 items-center">
            <Social />
          </div>
        </div>
      </div>

      <div className="mobile-footer px-20 py-5 border-top-light"></div>

      <div className="d-flex px-20 pro-footer text-16">

        <CurrencyMegaMenu textClass="text-dark-1 text-16 mr-20" />
        {/* End Megamenu for Currencty */}

        <LanguageMegaMenu textClass="text-dark-1 text-16" />
        {/* End Megamenu for Language */}

      </div>
      {/* End language and currency selector */}
    </>
  );
};

export default MobileMenu;
