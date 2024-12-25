
'use client'

import { useSearchForm } from './FlightsSearchProvider';

const LocationSwitcher = () => {
  const { setFromSearchValue, setToSearchValue, fromPlace, setFromPlace, toPlace, setToPlace, emptyIndicativePrices } = useSearchForm()

  const handleSwitchLocations = () => {
    if (toPlace?.slug != 'anywhere') {
      setFromSearchValue('')
      setToSearchValue('')
      setFromPlace(toPlace)
      setToPlace(fromPlace)
  
      emptyIndicativePrices()
    }
  }
  
  return (
    <>
      {toPlace?.slug != 'anywhere' && (
        <div
          className={`position-absolute location-switcher cursor-pointer rounded-4 bg-white d-flex justify-center align-items-center`}
          onClick={handleSwitchLocations}
        >
          <div className="icon-transfer-arrows text-dark-5 text-16" />
        </div>
      )}
    </>
  );
};

export default LocationSwitcher;
