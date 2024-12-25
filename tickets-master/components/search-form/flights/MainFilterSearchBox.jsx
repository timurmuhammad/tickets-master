
'use client'

import { DesktopDateSearchCalendar } from "./DateSearch"
import PassengersSearch from "./PassengersSearch";
import FlyingFromLocation from "./FlyingFromLocation";
import FlyingToLocation from "./FlyingToLocation";
import { useSearchForm } from './FlightsSearchProvider';
import { useTranslation } from 'react-i18next'
import FilterSelect from "@/components/search-form/flights/FilterSelect"

const MainFilterSearchBox = ({ samePage = false }) => {
  const { t } = useTranslation(['search_form'])

  const { handleFlightsSearchFormSubmit } = useSearchForm()

  return (
    <>
    <div data-aos="fade-up" data-aos-delay="300">
      <div className="row y-gap-20 sm:y-gap-0 pl-35 lg:pl-10 items-center pt-40">
        <FilterSelect filterItemsArr={['economy', 'show_hotels']} />
      </div>

      <div 
        className="mainSearch -col-4 -w-1070 bg-white shadow-1 rounded-100 xl:rounded-16 px-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 mt-10 is-in-view"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="button-grid items-center">
          <FlyingFromLocation />

          <FlyingToLocation />

          <DesktopDateSearchCalendar />

          <PassengersSearch />

          <div className="button-item">
            <button
              className="mainSearch__submit button -blue-1 py-15 px-35 h-60 col-12 bg-dark-4 text-white"
              onClick={() => handleFlightsSearchFormSubmit({ samePage, scrollToResults: true })}
            >
              <i className="icon-search text-20 mr-10" />
              {t('search_form.search')}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default MainFilterSearchBox;
