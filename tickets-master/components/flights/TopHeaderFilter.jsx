import { useSearchForm } from '@/components/search-form/flights/FlightsSearchProvider'
import { useFlightsResults } from '@/components/flights/FlightsResultsContext'
import { formatMinutes } from "@/helpers/main"
import { formatPrice } from '@/helpers/price'

const TopHeaderFilter = ({ t, locale, currency }) => {
  const { flightsSearchData } = useSearchForm()

  const { flightCountResults, sortType, setSortType, pickedTickets, status } = useFlightsResults()
  
  const handleSortTypeChange = (value) => {
    setSortType(value);
  };

  const sortOptions = [
    // {
    //   title: "cheapest",
    //   value: sortType,
    //   list: [
    //     { label: "best" },
    //     { label: "cheapest" },
    //     { label: "fastest" },
    //     { label: "earliest" },
    //   ],
    //   onChange: handleSortTypeChange,
    // },
    {
      title: "flights_sorting",
      value: sortType,
      list: [
        "cheapest",
        "best",
        "fastest",
      ],
      onChange: handleSortTypeChange,
    },
  ];
  const buttonSort = sortOptions.find(item => item.title == 'cheapest')
  const itemsSort = sortOptions.find(item => item.title == 'flights_sorting')

  return (
    <>
    <div className="row items-center justify-between">
      {(flightsSearchData?.fromPlace?.name && flightsSearchData?.toPlace?.name || status) && (
        <>
        <div className="col-auto mt-5">
          <span className="fw-500 sm:text-13">
          {status == 'completed' ? (
            <>
            {t('flights.results_loaded', { count: flightCountResults })}
            </>
          ) : status == 'loading' ? (
            <>
            {t('flights.results_loading', { count: flightCountResults })}
            </>
          ) : (
            <>
            {flightsSearchData.fromPlace.name} - {flightsSearchData.toPlace.name}: {' '}
            {t('flights.offers_count', { count: flightCountResults })}
            </>
          )}
          </span>
        </div>
        </>
      )}

      <div className="col-auto">
        <div className="row">
          {buttonSort && (
            <div className="col-auto align-items-center d-flex">
              <div className="dropdown js-dropdown">
                <div
                  className="button dropdown__button d-flex items-center rounded-100 -blue-1 border-dashed bg-blue-1-05 fw-500 px-20"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  data-bs-offset="0,0"
                >
                  <i className={`icon-up-down text-13 mr-10`} />
                  <span className={`js-dropdown-title`}>{t(`flights.${buttonSort.value}`)}</span>
                </div>
                
                <div className="toggle-element -dropdown js-click-dropdown dropdown-menu">
                  <div className="text-13 y-gap-15 js-dropdown-list">
                    {buttonSort.list.map((item, index) => (
                      <div key={index}>
                        <div
                          role="button"
                          className={`${item.label === buttonSort.value ? "text-blue-1 " : ""} d-block js-dropdown-link`}
                          onClick={() => buttonSort.onChange(item.label)}
                        >
                          {t(`flights.${item.label}`)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="col-auto d-none xl:d-block mt-5">
            <button
              data-bs-toggle="offcanvas"
              data-bs-target="#listingSidebar"
              className="button -blue-1 h-40 px-20 rounded-100 bg-white shadow-new text-15 text-dark-1"
            >
              <i className="icon-transmission text-13 mr-10" />
              {t('flights.filter')}
            </button>
          </div>
          {/* End .col */}
        </div>
        {/* End .row */}
      </div>
      {itemsSort && pickedTickets.length > 0 && (
        <div className="col-12 mt-20">
          <div className="row m-0 shadow-new rounded-8 overflow-hidden">
            {itemsSort.list.map((itemSort, index) => {
              const pickedTicket = pickedTickets.find(item => item.type == itemSort)
              
              if (pickedTicket) {
                const outboundStops = pickedTicket.ticket.outbound.steps.filter(step => step.transfer)
                const inboundStops = pickedTicket.ticket.inbound?.steps.filter(step => step.transfer)
                const inboundStopsLength = inboundStops ? inboundStops.length : 0
  
                // Check if the index is 0 and the total number of items is 2
                const isFirstItemWithTwoItems = index === 0 && pickedTickets.length === 2;
  
                const { hours, minutes } = formatMinutes(pickedTicket.ticket.durationInMinutes)
  
                return (
                  <div
                    className={`col px-0 ${isFirstItemWithTwoItems ? 'sm:pb-5' : ''}`}
                    key={index}
                  >
                    <button
                      role="button"
                      className={`h-100 ${pickedTicket.type === itemsSort.value ? "bg-rich-200 text-dark-1" : "bg-rich-100"} w-100 text-left text-18 sm:text-13 px-15 sm:px-10 py-10 border-left-light-dashed`}
                      onClick={() => itemsSort.onChange(pickedTicket.type)}
                    >
                      <div className="w-100">
                        <div className="fw-500 lh-15">{t(`flights.${pickedTicket.type}`)}</div>
                        <div className="row mt-5">
                          <div className="col-auto">
                            <p className=' '>{formatPrice({ locale, price: pickedTicket.ticket.deals[0].priceAmount, currency: currency })}</p>
                          </div>
                          <div className="col-auto ms-lg-auto d-flex align-items-center">
                            <p className={`${pickedTicket.type === itemsSort.value ? "text-dark-1" : ""} text-12 sm:text-11 lh-15 text-dark-2 sm:mt-5`}>{t('flights.hours_minutes_short', { h: hours, m: minutes })}, {t('flights.stops_count', { count: outboundStops.length + inboundStopsLength})}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                )
              }
            })}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default TopHeaderFilter;
