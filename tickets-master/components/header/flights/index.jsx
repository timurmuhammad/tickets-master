
'use client'

import { useSearchForm } from '@/components/search-form/flights/FlightsSearchProvider'
import { Link } from "@/navigation"
import { useEffect, useState } from "react"
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { getContent } from '@/utils/appContent'
import CurrencyMegaMenu from "../CurrencyMegaMenu"
import LanguageMegaMenu from "../LanguageMegaMenu"

const Header = () => {
  const { flightsSearchData } = useSearchForm()
  const { domain } = useContext(AppContext)
  const { imageSrc, altName } = getContent(domain, 'logo')

  const [header, setHeader] = useState(false);
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
    if (window.scrollY >= 200) {
      setHeader(true);
    } else {
      setHeader(false);
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
      <header className={`header ${navbar ? `${header && flightsSearchData.fromPlace ? 'd-none' : ''} is-sticky bg-white` : ""}`}>
        <div className="header__container container sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <Link href="/" className="header-logo mr-50"> 
                  <img src={imageSrc} alt={altName} />
                </Link>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="row x-gap-20 items-center xl:d-none">
                  <CurrencyMegaMenu textClass="text-dark-1" />
                  <LanguageMegaMenu textClass="text-dark-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
