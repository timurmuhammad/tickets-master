'use client'

import { useState, useContext } from "react";
import { useSearchForm } from './FlightsSearchProvider';
import getPlaces from "@/modules/skyscanner/utils/getPlaces";
import useDebouncedEffect from "@/hooks/useDebouncedEffect"
import { useTranslation } from 'react-i18next'
import { AppContext } from '@/contexts/AppContext'
import { getDomainConfig } from '@/utils/domainConfig'
import { getLocationUrl } from '@/helpers/main'
import { useRouter } from "@/navigation"

const FlyingToLocation = ({ className = 'px-20 lg:py-15 md:py-10 lg:px-0', openDates = true }) => {
  const router = useRouter()
  const { t } = useTranslation(['search_form'])
  const { domain, locale } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })

  const { toSearchValue, setToSearchValue, toPlace, setToPlace, toPlaceInputRef, fromPlace, emptyIndicativePrices, errors, setErrors, flightsSearchData, setFlightsSearchData } = useSearchForm()

  const [locationSearchContent, setLocationSearchContent] = useState([])
  
  const [isLoading, setIsLoading] = useState(false)
  // const [isDisabled, setIsDisabled] = useState(false)

  const toPlaceError = errors.toPlace ?? null

  const handleSearchValue = (value) => {
    const searchTerm = value

    if (toPlace) {
      emptyIndicativePrices()
      setToPlace(null)
    }

    setToSearchValue(searchTerm)

    if (!showPopup) {
      setShowPopup(true)
    }
    setIsLoading(true)
  }

  useDebouncedEffect(() => {
    async function fetchData() {
      // setIsDisabled(true)
      const locations = await getPlaces({ searchTerm: toSearchValue, locale, skyscannerMarket })
      setLocationSearchContent([... locations])

      // setIsDisabled(false)
      setIsLoading(false)
    }

    if (toSearchValue) {
      fetchData()
    } else {
      setLocationSearchContent([])
    }
  }, 150, [toSearchValue])

  const [showPopup, setShowPopup] = useState(false)
  const handleDivClick = () => {
    if (toPlaceInputRef.current) {
      toPlaceInputRef.current.focus()
    }
  }

  const handleOptionClick = (item) => {
    setToSearchValue(item.name)
    emptyIndicativePrices(openDates)
    setToPlace(item)
    
    //errors
    delete errors.toPlace
    setErrors({... errors})

    //close search popup
    setShowPopup(false)
  }

  const handleCloseDropdown = () => {
    setToSearchValue('')
    setShowPopup(false)
  }
  
  return (
    <>
      <div className={`searchMenu-loc js-form-dd js-liverSearch ${className}`}>
        <div
          onClick={handleDivClick}
        >
          <div className="field-name text-dark-3 lh-16 pl-2">
            {t('search_form.arrival')}
            {toPlaceError && (
              <span className="text-red-1 text-12 ml-10">{t(`search_form.${toPlaceError}`)}</span>
            )}
          </div>
          <div className="input-container text-16 lh-16 position-relative">
            <input
              autoComplete="off"
              type="search"
              placeholder={t('search_form.to_location_input')}
              className="js-search js-dd-focus"
              value={toSearchValue != "" ? toSearchValue : toPlace ? toPlace.name : ''}
              onChange={(e) => handleSearchValue(e.target.value)}
              onClick={() => {
                if (!toSearchValue) {
                  setShowPopup(!showPopup)
                }
              }}
              ref={toPlaceInputRef}
              // readOnly={isDisabled}
            />
            <small className="input-search__iata_code pl-8 position-absolute">
              {toPlace?.iataCode ? (
                toPlace.iataCode
              ) : toSearchValue && (
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

        <div className={`shadow-2 dropdown-menu dropdown-menu__location-search min-width-400 rounded-16 scroll-bar-search mt-10 ${showPopup ? 'd-block' : ''}`}>
          {/* {toSearchValue && (locationSearchContent.length > 0 || !isLoading) && ( */}
            <div className="bg-white px-10 py-15 sm:py-10 rounded-16">
              <ul className="y-gap-5 js-results">
                {locationSearchContent.length > 0 ? (
                <>
                  {locationSearchContent.map((item, index) => (
                    <li
                      className={`-link d-block col-12 text-left rounded-16 px-10 py-10 js-search-option mb-1 ${
                        toPlace && toPlace.entityId === item.entityId ? "active" : ""
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
                            {item.name.split(new RegExp(`(${toSearchValue})`, 'gi')).map((part, index) => 
                              part.toLowerCase() === toSearchValue.toLowerCase() ? <span key={index} className="fw-700">{part}</span> : part
                            )}
                          </div>
                          <div className="text-14 lh-12 fw-600 text-light-1 mt-5">
                            {item.iataCode}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  <div className="w-100 border-bottom-light py-0 px-10 my-2" />
                </>
                ) : toSearchValue && !isLoading ? (
                  <>
                  <li className={`d-block col-12 text-left rounded-16 px-10 py-10 js-search-option mb-1`}>
                    {t('search_form.no_results')}
                  </li>
                  <div className="w-100 border-bottom-light py-0 px-10 my-2" />
                  </>
                ) : (
                  null
                )}
                <li
                  className={`-link d-block col-12 text-left rounded-16 px-10 py-10 js-search-option mb-1`}
                  role="button"
                  onClick={() => {
                    //save fromPlace in local storage
                    setFlightsSearchData({... flightsSearchData, fromPlace})

                    //set Anywhere place
                    handleOptionClick({
                      name: 'Anywhere',
                      slug: 'anywhere',
                      type: 'PLACE_TYPE_ANYWHERE'
                    })

                    //redirect user to prices page
                    const locationUrl = getLocationUrl({ locationType: 'anywhere' })
                    router.push(`${locationUrl}#prices`)
                  }}
                >
                  <div className="d-flex align-items-center py-5">
                    <div className="icon-location-2 text-light-1 text-20"/>
                    <div className="ml-10">
                      <div className="text-15 lh-12 fw-400 js-search-option-target">
                        Anywhere
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          {/* )} */}
        </div>
      </div>
    </>
  );
};

export default FlyingToLocation;
