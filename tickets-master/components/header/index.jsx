
'use client'

import { Link } from "@/navigation";
import { usePathname } from "@/navigation"
import { useEffect, useState } from "react";
import MainMenu from "./MainMenu";
import MobileMenu from "./MobileMenu";
import Bonus from "./bonus/Bonus";
import CurrencyMegaMenu from "./CurrencyMegaMenu";
import LanguageMegaMenu from "./LanguageMegaMenu";
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { getContent } from '@/utils/appContent';
import { useTranslation } from 'react-i18next'

const Header = ({ marginTop, minimalistic = false }) => {
  const { t } = useTranslation(['header'])

  const [navbar, setNavbar] = useState(false)
  const { domain } = useContext(AppContext)
  const { imageSrc, altName } = getContent(domain, 'logo');
  const pathname = usePathname()

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <>
      {" "}
      <header className={`header ${navbar ? "is-sticky bg-white " : ""}${marginTop} sm:mt-0`}>
        <div className="header__container header__container-1500 mx-auto px-30 sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                {pathname === "/" ? (
                  <div className="header-logo mr-50">
                    <img src={imageSrc} alt={altName} />
                  </div>
                ) : (
                  <Link href="/" className="header-logo mr-50"> 
                    <img src={imageSrc} alt={altName} />
                  </Link>
                )}
                {/* End logo */}

                {!minimalistic && (
                  <div className="header-menu">
                    <div className="header-menu__content">
                      <MainMenu style="text-dark-1" t={t} />
                    </div>
                  </div>
                )}
                {/* End header-menu */}

              </div>
              {/* End d-flex */}
            </div>
            {/* End col */}

            <div className="col-auto">
              <div className="d-flex items-center">

                <Bonus t={t} />

                <div className="row x-gap-20 items-center xl:d-none">

                  <CurrencyMegaMenu textClass="text-dark-1" />
                  {/* End Megamenu for Currencty */}

                  <LanguageMegaMenu textClass="text-dark-1" />
                  {/* End Megamenu for Language */}

                </div>
                {/* End language and currency selector */}

                {/* Start mobile menu icon */}
                <div className="d-none xl:d-flex x-gap-20 items-center pl-20 text-dark-1">
                  {/*<div>
                    <Link
                      href=""
                      className="d-flex items-center icon-user text-inherit text-22"
                    />
                  </div>*/}
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-inherit text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    />

                    <div
                      className="offcanvas offcanvas-start  mobile_menu-contnet"
                      tabIndex="-1"
                      id="mobile-sidebar_menu"
                      aria-labelledby="offcanvasMenuLabel"
                      data-bs-scroll="true"
                    >
                      <MobileMenu imageSrc={imageSrc} altName={altName} minimalistic={minimalistic} />
                    </div>
                  </div>
                </div>
                {/* End mobile menu icon */}
              </div>
              {/* End d-flex */}
            </div>
            {/* End col-auto */}
          </div>
          {/* End .row */}
        </div>
        {/* End header_container */}
      </header>
      {/* End header */}
    </>
  );
};

export default Header;
