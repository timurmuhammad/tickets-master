
'use client'

import { useState, useEffect, useRef, useContext } from "react";
import { useSearchForm } from './FlightsSearchProvider';
import getPlaces from "@/modules/skyscanner/utils/getPlaces";
import useDebouncedEffect from "@/hooks/useDebouncedEffect"
import { useRecommendedUserLocation } from "@/hooks/useUserLocation"
import { useTranslation } from 'react-i18next'
import { AppContext } from '@/contexts/AppContext'
import LocationSwitcher from "./LocationSwitcher"
import { getDomainConfig } from '@/utils/domainConfig'

const FlyingFromLocation = ({ className = 'pl-24 pr-20 lg:py-15 md:py-10 lg:px-0' }) => {
  const { t } = useTranslation(['search_form'])
  const { domain, locale } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })

  const inputRef = useRef(null)
  const { fromSearchValue, setFromSearchValue, fromPlace, setFromPlace, toPlaceInputRef, emptyIndicativePrices, errors, setErrors } = useSearchForm()
  const { recommendedFlightLocation } = useRecommendedUserLocation()

  useEffect(() => {
    if (!fromPlace && recommendedFlightLocation) {
      setFromPlace(recommendedFlightLocation)
      
      //errors
      delete errors.fromPlace
      setErrors({... errors})
    }
  }, [ recommendedFlightLocation ])

  const [locationSearchContent, setLocationSearchContent] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  // const [isDisabled, setIsDisabled] = useState(false)

  const fromPlaceError = errors.fromPlace ?? null

  const handleSearchValue = (value) => {
    const searchTerm = value

    if (fromPlace) {
      emptyIndicativePrices()
      setFromPlace(null)
    }
    
    setFromSearchValue(searchTerm)

    if (!showPopup) {
      setShowPopup(true)
    }
    
    setIsLoading(true)
  }

  useDebouncedEffect(() => {
    async function fetchData() {
      // setIsDisabled(true)
      const locations = await getPlaces({ searchTerm: fromSearchValue, locale, skyscannerMarket })
      setLocationSearchContent([... locations])

      // setIsDisabled(false)
      setIsLoading(false)
    }

    if (fromSearchValue) {
      fetchData()
    } else {
      setLocationSearchContent([])
    }
  }, 150, [fromSearchValue])

  const [showPopup, setShowPopup] = useState(false)
  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleOptionClick = (item) => {
    setFromSearchValue(item.name)
    emptyIndicativePrices()
    setFromPlace(item)
    
    //errors
    delete errors.fromPlace
    setErrors({... errors})
    
    //close search popup
    setShowPopup(false)

    //focus on to place input
    toPlaceInputRef.current?.focus()
  }

  const handleCloseDropdown = () => {
    setFromSearchValue('')
  }

  return (
    <>
      <div className={`searchMenu-loc js-form-dd js-liverSearch ${className}`}>
        <div
          onClick={handleDivClick}
        >
          <div className="field-name text-dark-3 lh-16 pl-2">
            {t('search_form.departure')}
            {fromPlaceError && (
              <span className="text-red-1 text-12 ml-10">{t(`search_form.${fromPlaceError}`)}</span>
            )}
          </div>
          <div className="input-container text-16 lh-16 position-relative">
            <input
              autoComplete="off"
              type="search"
              placeholder={t('search_form.from_location_input')}
              className="js-search js-dd-focus"
              value={fromSearchValue != "" ? fromSearchValue : fromPlace ? fromPlace.name : ''}
              onChange={(e) => handleSearchValue(e.target.value)}
              ref={inputRef}
              // readOnly={isDisabled}
            />
            <small className="input-search__iata_code pl-8 position-absolute">
              {fromPlace?.iataCode ? (
                fromPlace.iataCode
              ) : fromSearchValue && (
                <button
                  className="pointer"
                  role="button"
                  onClick={handleCloseDropdown}
                >
                  <i className="icon-close" />
                </button>
              )}
            </small>
          </div>
          
        </div>
        
        <LocationSwitcher/>

        <div className={`shadow-2 dropdown-menu dropdown-menu__location-search min-width-400 rounded-16 scroll-bar-search mt-10 ${showPopup ? 'd-block' : ''}`}>
          {fromSearchValue && (locationSearchContent.length > 0 || !isLoading) && (
            <div className="bg-white px-10 py-15 sm:py-10 rounded-16">
              <ul className="y-gap-5 js-results">
                {locationSearchContent.length > 0 ? (
                <>
                  {locationSearchContent.map((item, index) => (
                    <li
                      className={`-link d-block col-12 text-left rounded-16 px-15 py-10 js-search-option mb-1 ${
                        fromPlace && fromPlace.entityId === item.entityId ? "active" : ""
                      }`}
                      key={item.entityId}
                      role="button"
                      onClick={() => handleOptionClick(item)}
                    >
                      <div className={locationSearchContent[index - 1]?.parentId == item.parentId ? "d-flex ml-20" : "d-flex"}>
                        {item.type == "PLACE_TYPE_AIRPORT" ? (
                          <div className="icon-airplane text-light-1 text-20 pt-4"/>
                        ) : (
                          <div className="icon-location-2 text-light-1 text-20 pt-4"/>
                        )}
                        <div className="ml-10">
                          <div className="text-15 lh-12 fw-400 js-search-option-target">
                            {item.name.split(new RegExp(`(${fromSearchValue})`, 'gi')).map((part, index) => 
                              part.toLowerCase() === fromSearchValue.toLowerCase() ? <span key={index} className="fw-700">{part}</span> : part
                            )}
                          </div>
                          <div className="text-14 lh-12 fw-600 text-light-1 mt-5">
                            {item.iataCode}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </>
                ) : !isLoading ? (
                  <li className={`d-block col-12 text-left rounded-16 px-10 py-10 js-search-option mb-1`}>
                    {t('search_form.no_results')}
                  </li>
                ) : (
                  null
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FlyingFromLocation;
