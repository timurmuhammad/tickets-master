'use client'

import { useRouter } from "@/navigation"
import { useEffect, useState, useContext } from "react";
import { AppContext } from '@/contexts/AppContext'
import { destinations1 } from "../../data/destinationsContent";
import { useSearchForm } from '@/components/search-form/flights/FlightsSearchProvider'
import { makeSearch } from "@/modules/skyscanner/utils/search"
import { useRecommendedUserLocation } from "@/hooks/useUserLocation"
import { useTranslation } from 'react-i18next'

const Destinations = () => {
  const router = useRouter()
  const { localePrefix } = useContext(AppContext)
  const { flightsSearchData, setFlightsSearchData, setSearchActive, passengerCounts, hotelsSearch } = useSearchForm()
  const { recommendedFlightLocation } = useRecommendedUserLocation()

  const [filterOption, setFilterOption] = useState("north-america") // Set default value to "north_america"
  const [filteredItems, setFilteredItems] = useState([])

  const filterOptions = [
    { value: "north-america" },
    { value: "south-america" },
    { value: "europe" },
    { value: "middle-east" },
    { value: "africa" },
    { value: "asia" },
    { value: "australia-and-oceania" },
  ]

  useEffect(() => {
    setFilteredItems(destinations1.filter((elm) => elm.region === filterOption))
  }, [filterOption])

  const { t } = useTranslation(['home', 'continents'])
  return (
    <>
      <div className="tabs__controls d-flex js-tabs-controls pb-10">
        {filterOptions.map((option) => (
          <div key={option.value}>
            <button
              className={`tabs__button mr-5 fw-500 text-13 px-15 py-5 rounded-8 js-tabs-button ${
                filterOption === option.value ? "is-tab-el-active" : ""
              }`}
              onClick={() => setFilterOption(option.value)}
            >
              {t(`continents.${option.value}`)}
            </button>
          </div>
        ))}
      </div>

      <div className="tabs__content pt-5 js-tabs-content">
        <div className="tabs__pane -tab-item-1 is-tab-el-active">
          <div className="row y-gap-10">
            {filteredItems.map((item) => {
              const newFlightsSearchData = {... flightsSearchData}
              newFlightsSearchData.fromPlace = recommendedFlightLocation
              newFlightsSearchData.toPlace = item.city
              newFlightsSearchData.dates = []
              newFlightsSearchData.passengerCounts = passengerCounts
              newFlightsSearchData.hotelsSearch = hotelsSearch

              return (
                <div className="w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2" key={item.id}>
                  <div className="cursor-pointer"
                    onClick={() => {
                      makeSearch({ router, searchData: { ... newFlightsSearchData }, setFlightsSearchData, setSearchActive, openInNewTab: true, localePrefix })
                    }}
                  >
                    <div className="text-13 fw-500">{t('home.flights_to', {destination: item.city.name})}</div>
                    <div className="text-12 text-light-1">{t('home.hotels_count', {count: item.hotels})}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* End .tabs__content */}
    </>
  );
};

export default Destinations;
