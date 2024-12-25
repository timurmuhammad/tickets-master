"use client"

import { Link } from "@/navigation"
import { footerContent, footerContinents } from "@/data/footerContent"
import { usePathname } from "@/navigation"
import { useTranslation } from 'react-i18next'
import useMenu from "@/hooks/useMenu"

const FooterContent = () => {
  const pathname = usePathname()

  const { t } = useTranslation(['footer', 'continents'])

  return (
    <>
      {footerContent.map((item) => {
        const newMenu = useMenu({ menu: item.menuList })

        return (
          <div className="col-xl-2 col-lg-4 col-sm-6" key={item.id}>
            <div className="text-16 fw-500 mb-30">{t(`footer.${item.title}`)}</div>
            <div className="d-flex flex-column">
              {newMenu.map((menu, i) => {
                return (
                  <div key={i}>
                    {pathname === menu.link ? (
                      <div>
                        {t(`footer.${menu.title}`)}
                      </div>
                    ) : (
                      <Link 
                        href={menu.link}
                        target={menu.openInNewTab ? '_blank' : '_self'}
                        rel={menu.rel ? Object.keys(menu.rel).filter(key => menu.rel[key]).join(' ') : ''}
                      >
                        {t(`footer.${menu.title}`)}
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {footerContinents && footerContinents.menuList.length > 0 && (
      <div className="col-xl-2 col-lg-4 col-sm-6">
        <div className="text-16 fw-500 mb-30">{t(`footer.${footerContinents.title}`)}</div>
        <div className="d-flex flex-column">
          {footerContinents.menuList.map((menu, i) => {
            return (
              <div key={i}>
                {pathname === menu.link ? (
                  <div>
                    {t(`continents.${menu.title}`)}
                  </div>
                ) : (
                  <Link 
                    href={menu.link}
                    target={menu.openInNewTab ? '_blank' : '_self'}
                    rel={menu.rel ? Object.keys(menu.rel).filter(key => menu.rel[key]).join(' ') : ''}
                  >
                    {t(`continents.${menu.title}`)}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
      )}
    </>
  );
};

export default FooterContent;
