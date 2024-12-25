"use client"

import { useEffect, useState } from 'react'
import { useRouter } from "@/navigation"
import FlightsFilterSearchBox from "@/components/search-form/flights/FlightsFilterSearchBox"
import { makeSearch } from '@/modules/skyscanner/utils/search'
import { useSearchForm } from '@/components/search-form/flights/FlightsSearchProvider'
import { useFlightsResults } from '@/components/flights/FlightsResultsContext'
import { useRecommendedUserLocation } from "@/hooks/useUserLocation"
import FlightsProvidersBig from "@/components/flights/FlightsProvidersBig"
import { countries } from "@/data/skyscannerCountries"
import { defaultTravelCitiesList, topTravelCitiesLists } from "@/data/topTravelCitiesLists"
import { DateObject } from "react-multi-date-picker"
import { MobileDateSearchCalendar } from "@/components/search-form/flights/DateSearch"

const getRandomDates = () => {
  function getRandomDepartureDays() {
    return Math.floor(Math.random() * (60 - 2 + 1)) + 2 // Generates a random number between 2 and 60
  }
  function getRandomArrivalDays() {
    return Math.floor(Math.random() * (30 - 2 + 1)) + 2 // Generates a random number between 2 and 30
  }
  const dateDeparture = new DateObject().add(getRandomDepartureDays(), 'day')
  const randomDates = [ dateDeparture ]

  const shouldGenerateSecondDate = Math.random() > 0.5; // 50% chance to generate a second date

  if (shouldGenerateSecondDate) {
    const dateArrival = new DateObject(dateDeparture).add(getRandomArrivalDays(), 'day')
    randomDates.push(dateArrival)
  }

  return randomDates
}

function getRandomCity(cityGroups) {
  // Calculate the total weight of all groups
  const totalWeight = cityGroups.reduce((sum, group) => sum + parseInt(group.weight || 1), 0);  // Default weight is 1 if not specified

  // Select a group based on weight
  let random = Math.floor(Math.random() * totalWeight);
  let selectedGroup = null;
  for (let group of cityGroups) {
    random -= parseInt(group.weight || 1);  // Default weight is 1 if not specified
    if (random < 0) {
      selectedGroup = group;  // Select the group
      break;
    }
  }

  if (!selectedGroup || !selectedGroup.cities.length) {
    return null; // Fallback if no group is selected or the group has no cities
  }

  // Randomly select a city from the chosen group
  const randomCityIndex = Math.floor(Math.random() * selectedGroup.cities.length);
  return selectedGroup.cities[randomCityIndex]; // Return the selected city object
}

const getRandomPlace = ({ recommendedFlightLocation, placeToExclude = null, returnDefault = false }) => {
  let cityGroups = [];
  const country = countries.find(item => item.entityId === recommendedFlightLocation?.parentId)

  if (country) {
    if (country.entityId === '29475437' /* USA */ || country.entityId === '29475436' /* CANADA */) {
      cityGroups = topTravelCitiesLists.find(item => item.listEntityId === recommendedFlightLocation.parentId)?.cities ?? []
    } else {
      cityGroups = topTravelCitiesLists.find(item => item.listEntityId === country?.parentId)?.cities ?? []
    }
  }

  // Use default city list if cityGroups is empty
  if (cityGroups.length === 0) {
    cityGroups = defaultTravelCitiesList.cities
  }

  const citiesList = cityGroups.reduce((acc, group) => {
    group.cities.forEach(city => acc.push({ ...city, weight: group.weight }));
    return acc;
  }, []);

  if (returnDefault) {
    const defaultCity = citiesList.find(city => city.entityId === recommendedFlightLocation?.entityId);
    if (defaultCity) {
      return defaultCity;
    } else {
      const userLocationCityGroups = cityGroups.map(group => ({
        weight: group.weight,
        cities: group.cities.filter(city => city.parentId === recommendedFlightLocation?.parentId)
      })).filter(group => group.cities.length > 0)
      return getRandomCity(userLocationCityGroups)
    }
  }

  const filteredGroups = cityGroups.map(group => ({
    weight: group.weight,
    cities: group.cities.filter(city => 
      city.entityId !== recommendedFlightLocation?.entityId &&
      city.entityId !== placeToExclude?.entityId)
  })).filter(group => group.cities.length > 0)

  return filteredGroups.length > 0 ? getRandomCity(filteredGroups) : null
}

const index = ({ session }) => {
  const { flightsSearchData, setFlightsSearchData, handleSetFlightsSearchData, passengerCounts, classType, searchActive, setSearchActive, handleDatesChange } = useSearchForm()
  const { status, selectedFlightsProviders } = useFlightsResults()
  const router = useRouter()
  const { recommendedFlightLocation } = useRecommendedUserLocation()

  function autoSearch() {
    const newFlightsSearchData = { ... flightsSearchData }
    newFlightsSearchData.hotelsSearch = false
    newFlightsSearchData.passengerCounts = passengerCounts
    newFlightsSearchData.classType = classType

    //fromPlace
    let newFromPlace = getRandomPlace({ recommendedFlightLocation, returnDefault: true })
    if (newFromPlace) {
      newFlightsSearchData.fromPlace = newFromPlace
    }
    
    //toPlace
    let newToPlace = getRandomPlace({ recommendedFlightLocation, placeToExclude: newFlightsSearchData.fromPlace })
    if (newToPlace) {
      newFlightsSearchData.toPlace = newToPlace
    }

    //dates
    newFlightsSearchData.dates = getRandomDates()
    newFlightsSearchData.tripType = newFlightsSearchData.dates.length == 2 ? 'round_trip' : 'one_way'
    handleDatesChange(newFlightsSearchData.dates)
    
    setFlightsSearchData(newFlightsSearchData)
    handleSetFlightsSearchData(newFlightsSearchData)

    makeSearch({ router, searchData: { ... newFlightsSearchData }, setFlightsSearchData, searchActive, setSearchActive, samePage: true })
  }
  useEffect(() => {
    const url = window.location.search
    if (!url && !searchActive && recommendedFlightLocation && !status) {
      autoSearch()
    }
  }, [searchActive, status, recommendedFlightLocation])

  const [showFlightsSearchForm, setShowFlightsSearchForm] = useState(false)

  // Toggle function to expand or collapse the content
  const toggleShowFlightsSearchForm = () => {
    setShowFlightsSearchForm(!showFlightsSearchForm)
  }

  return (
    <div className="px-20 py-20" style={{ minHeight: '100vh' }}>
      <div className="row align-items-center">
        <div className="col-5 col-sm-4 row m-0 justify-center">
          {session.user?.role == 'admin' && (
            <>
            <div className="col-12 col-sm-6 p-0 d-flex justify-center">
              <button
                className="button border-dark-1 border-width-2 mt-10 px-20 py-10 rounded-8"
                onClick={() => autoSearch()}
              >
                Reload Search
              </button>
            </div>
          
            <div className="col-12 col-sm-6 p-0 d-flex justify-center">
              <button
                className="button bg-dark text-white mt-10 px-20 py-10 rounded-8"
                onClick={toggleShowFlightsSearchForm}
              >
                Show Form
              </button>
            </div>
            </>
          )}
        </div>
        <div className="col-3 col-sm-4 text-center">
          <span className="text-18 fw-600">
            {status == 'loading' ? (
              <div>
                Loading
              </div>
            ) : status == 'completed' && (
              <div>
                Ready
              </div>
            )}
          </span>
        </div>
        <div className="col-4 text-right row justify-center m-0">
          <span className="col-12 col-sm-6 p-0 text-18 fw-600 text-18 fw-600">Selected Providers: {selectedFlightsProviders.length}</span>
        </div>
      </div>
      {showFlightsSearchForm && (
        <>
        <br />
        <MobileDateSearchCalendar />
        <FlightsFilterSearchBox
          textClass="text-dark"
        />
        </>
      )}
      <section className="mt-30 rounded-16 py-10 bg-new-1">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {status ? (
                <>
                  <FlightsProvidersBig showLoading={session.user?.role == 'admin' || status == 'completed'} />
                </>
              ) : (
                <div>
                  Make search to see results
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default index;
