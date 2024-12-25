
'use client'

import { useState } from "react"
import Image from "next/image"
import { formatSkyscannerImageUrl } from "@/helpers/skyscanner"
import { useTranslation } from 'react-i18next'
import { formatPrice } from '@/helpers/price'

const FlightDeals = ({ locale, currency, deals }) => {
  const { t } = useTranslation(['flights'])

  const [click, setClick] = useState(false);
  const handleDetails = () => {
    setClick((prevState) => !prevState)
    
    if (click) {
      document.body.classList.remove("overflow-y-hidden")
    } else {
      document.body.classList.add("overflow-y-hidden")
    }
  };

  return (
    <>
      {deals.length ==  1 ? (
        <div className="col-auto">
          <a 
            className={`button px-30 h-50 -blue-1 bg-dark-4 text-white`}
            href={`${deals[0].items[0].deepLink}`}
            target="_blank"
            rel="noopener noreferrer"
            title={deals[0].agents[0].name} 
          >
            <span className="js-details-mainTitle">
              {t('flights.select')}
            </span>
            <div className="icon-arrow-top-right text-13 ml-15"></div>
          </a>
        </div>
      ) : (
        <>
        {/* Start Details button */}
        <div className="col-auto">
          <button 
            className={`button px-30 h-50 -blue-1 bg-dark-4 text-white`}
            onClick={handleDetails}
          >
            <span className="js-details-mainTitle">
              {t('flights.offers')}
            </span>
            <div className="icon-arrow-top-right text-13 ml-15"></div>
          </button>
        </div>
        {/* End Details button */}

        <div className={`flightDetails js-flightDetails ${click ? "" : "is-hidden"}`}>
          <div className="flightDetails__bg" onClick={handleDetails}></div>
          <div className="flightDetails__content rounded-22">
            
            {/* <div className="bg-white d-flex items-center justify-between px-30 py-20 sm:px-20 border-bottom-light">
              <div className="text-20 fw-500 lh-15">{t('flights.offers_count', { count: deals.length})}</div>
              <button className="pointer" onClick={handleDetails}>
                <i className="icon-close" />
              </button>
            </div> */}

            <div className="bg-white px-20 py-20 sm:px-10 sm:py-15 rounded-16">
              <ul className="y-gap-5 js-results">
                {deals.map((item) => (
                  <li
                    className="-hover-shadow-new cursor-pointer js-item rounded-16"
                    key={item.id}
                  >
                    <div className="py-10 px-15 sm:px-5 sm:py-5">
                      <a 
                        className="row y-gap-10 items-center"
                        href={`${item.items[0].deepLink}`}
                        target="_blank"
                        // rel="noopener noreferrer"
                        title={item.agents[0].name} 
                      >                        
                        <div className="col px-20">
                          <Image
                            className="rounded-8"
                            width="100"
                            height="50"
                            src={formatSkyscannerImageUrl(item.agents[0].name, item.agents[0].imageUrl)}
                            alt={`${item.agents[0].name}`}
                          />
                        </div>
                        <div className="col px-20">
                          <div className="text-16 fw-700 text-dark-1 px-20 md:px-10">
                            <span className="js-title">{formatPrice({ locale, price: item.priceAmount, currency: currency })}</span>
                          </div>
                        </div>
                        <div className="col px-20">
                          <div className="button -blue-1 h-40 px-20 rounded-16 bg-blue-1-05 text-15 text-dark-1" >
                            {t('flights.select')}
                          </div>
                        </div>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default FlightDeals;
