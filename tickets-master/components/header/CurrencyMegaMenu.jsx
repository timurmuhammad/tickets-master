'use client'

import { useContext, useState } from "react";
import { AppContext } from '@/contexts/AppContext'; // Import AppContext
import { currencies } from '@/data/currencies'; // Import the currencies data
import { useTranslation } from 'react-i18next';

const CurrencyMegaMenu = ({ textClass }) => {
  const { t } = useTranslation(['header']);
  const { currency, currencySymbol, setCurrencyItem } = useContext(AppContext)

  const [click, setClick] = useState(false);
  const handleCurrency = () => setClick((prevState) => !prevState);

  const handleItemClick = (item) => {
    setCurrencyItem(item)
    setClick(false)
    window.location.reload();
  };

  return (
    <>
      <div className="col-auto">
        <button
          className={`d-flex items-center text-14 ${textClass}`}
          onClick={handleCurrency}
        >
          <span className="js-currencyMenu-mainTitle">
            {currency} <small>{currencySymbol}</small>
          </span>
        </button>
      </div>

      {click && (
        <div className={`modalMenu js-currencyMenu`}>
          <div className="modalMenu__bg" onClick={handleCurrency}></div>
          <div className="modalMenu__content">
            <div className="bg-white rounded-16">
              <div className="d-flex items-center justify-between px-30 py-20 sm:px-25 border-bottom-light">
                <div className="text-20 fw-500 lh-15">{t('header.select_currency')}</div>
                <button className="pointer" onClick={handleCurrency}>
                  <i className="icon-close" />
                </button>
              </div>
              <div className="row px-30 py-30 y-gap-20 sm:px-15 sm:py-15" style={{ flexWrap: 'wrap' }}>
                {currencies.map((item, index) => (
                  <div
                    className={`col-6 col-md-3 col-sm-3`}
                    key={index}
                    onClick={item.status === "disabled" ? null : () => handleItemClick(item)}
                  >
                    <div className={`modalMenu__item py-15 px-20 sm:px-15 sm:py-10 ${currency === item.currency ? "active" : ""
                      } ${item.status === "disabled" ? "disabled" : ""}`}>
                      <div className="text-15 sm:text-14 lh-15 fw-500 text-dark-1">
                        {item.name}
                      </div>
                      <div className="text-14 sm:text-13 lh-15 mt-5">
                        <span className="js-title">{item.currency}</span> / {" "}
                        {item.symbol}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CurrencyMegaMenu;
