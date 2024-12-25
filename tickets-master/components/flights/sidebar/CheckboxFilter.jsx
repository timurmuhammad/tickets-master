
'use client'

import { useState, useEffect } from "react"
import { useFlightsResults } from '@/components/flights/FlightsResultsContext'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { useContext } from "react"
import { AppContext } from "@/contexts/AppContext"  
import { formatPrice } from '@/helpers/price'

const CheckboxFilter = ({ title, checkboxes }) => {
  const { t } = useTranslation(['flights'])
  const { locale, currency } = useContext(AppContext)

  const { filterValues, setFilterValues } = useFlightsResults()
  const itemsToShow = 5
  const [maxItems, setMaxItems] = useState(itemsToShow)
  
  const handlemaxItemsChange = () => {
    const newMaxItems = maxItems == itemsToShow ? checkboxes.length : itemsToShow
    setMaxItems(newMaxItems)
  }

  const handleCheckboxChange = debounce((value) => {
    setFilterValues(prevValues => {
      const index = prevValues[title]?.indexOf(value) ?? -1;
      const newValues = index > -1
        ? prevValues[title].filter((_, i) => i !== index)
        : [...(prevValues[title] || []), value];
      return { ...prevValues, [title]: newValues };
    });
  }, 100);
  
  useEffect(() => {
    return () => handleCheckboxChange.cancel();
  }, [])

  return (
    <>
    <div className="row mb-10">
      <div className="col-auto d-flex align-items-center">
        <h3 className="text-16 fw-500">{t(`flights.${title}`)}</h3>
      </div>
      {checkboxes.length > itemsToShow && (
        <div className="col-auto ms-auto d-flex align-items-center">
          <button
            className="button text-12 underline text-blue"
            type="button"
            onClick={handlemaxItemsChange}
          >
            {t(`flights.show_${maxItems == checkboxes.length ? 'less' : 'more'}`)}
          </button>
        </div>
      )}
    </div>
    {checkboxes.length > 0 ? (
      <div className="sidebar__checkbox">
        {checkboxes.map((filterItem, filterItemIndex) => {
          return (
            <>
            {(filterItemIndex < maxItems) && (
              <div className="row items-center justify-between" key={title + '_' + filterItemIndex}>
                <div className="col-10 pr-5">
                  <div className="form-checkbox d-flex items-center">
                    <input
                      type="checkbox"
                      checked={filterValues[title]?.includes(filterItem.title)}
                      onChange={() => handleCheckboxChange(filterItem.title)}
                    />
                    <div className="form-checkbox__mark col-auto p-0">
                      <div className="form-checkbox__icon icon-check"></div>
                    </div>
                    <div className="ml-10">
                      {filterItem.translate ? (
                      <>
                        {t(`flights.${filterItem.title}`)}
                      </>
                      ) : (
                      <>
                        {filterItem.title}
                      </>
                      )}
                      {filterItem.minPrice && (
                      <>
                        <div className={`text-12 lh-11 mb-5 ${filterItem.isCheapest ? ' fw-600 text-green-4' : `${filterItem.isBelowAverage ? 'fw-600 text-blue-1' : 'text-light-1'}`}`}>{t('flights.from')}: {formatPrice({ locale, price: filterItem.minPrice, currency: currency })}</div>
                      </>
                      )}
                    </div>
                  </div>
                </div>
                {typeof filterItem.count != 'undefined' ? (
                  <div className="col-2 pl-5 text-right">
                    <div className="text-light-1">{filterItem.count}</div>
                  </div>
                ) : null}
              </div>
            )}
            </>
          )
        })}
      </div>
    ) : (
      <div className="row">
        <div className="col-auto">
          {t('flights.no_filtering_options')}
        </div>
      </div>
    )}
    </>
  );
};

export default CheckboxFilter;
