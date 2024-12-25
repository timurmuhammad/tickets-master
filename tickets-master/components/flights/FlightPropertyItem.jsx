'react-virtualized'

import { formatDateTime, formatMinutes } from "@/helpers/main"
import { getSkyscannerDateTimeDifference, formatSkyscannerImageUrl } from "@/helpers/skyscanner"
import Popup from 'reactjs-popup'
import ImageWithFallback from '@/components/image-with-fallback'
import { useTranslation } from 'react-i18next'

const FlightPropertyItem = ({
  locale,
  parentItemKey,

  departureName,
  departureIata,
  departureDatetime,

  arrivalName,
  arrivalIata,
  arrivalDatetime,

  durationInMinutes,
  segments,
  stops
}) => {
  const { t } = useTranslation(['flights'])

  const { formattedDate: formattedDepartureDate, formattedTime: formattedDepartureTime } = formatDateTime({ datetime: departureDatetime, locale, data: ['month', 'day'], isShort: true})
  const { formattedDate: formattedArrivalDate, formattedTime: formattedArrivalTime } = formatDateTime({ datetime: arrivalDatetime, locale, data: ['month', 'day'], isShort: true})

  const { hours, minutes } = formatMinutes(durationInMinutes)

  const uniqueCarriersIataCodes = new Set();

  // Filter the segments to create an array of unique carriers
  const carriers = segments.reduce((acc, segment) => {
    if (!uniqueCarriersIataCodes.has(segment.carrier.iata)) {
      acc.push(segment.carrier);
      uniqueCarriersIataCodes.add(segment.carrier.iata);
    }
    return acc;
  }, [])

  return (
    <>
      <div className="row mb-10 sm:mb-5 y-gap-10">
        <div className="col-sm-auto">
          {carriers.map((item, index) => {
            return (
              <ImageWithFallback
                key={parentItemKey + index}
                className={index == 0 ? 'rounded-8 w-80' : 'rounded-8 w-80 ml-20'}
                src={formatSkyscannerImageUrl(item.name, item.imageUrl)}
                fallbackSrc='/img/flights/carriers/default.png'
                alt={item.name}
                width="150"
                height="100"
              />
            )
          })}
        </div>
      </div>
      <div className="row y-gap-10 x-gap-20 sm:x-gap-10 mr-0 items-top">
        <div className="col-3 col-md-3 d-flex flex-column justify-between">
          <div className="text-22 text-blue-1 lh-16 fw-700">{formattedDepartureTime}</div>
          {/* <div className="text-16 fw-600 lh-15 text-light-1">{departureIata}</div> */}
          <div className="text-12 lh-16 fw-600 text-light-1">{departureName}</div>
          <div className="text-12 lh-16 text-light-1">{formattedDepartureDate}</div>
        </div>

        <div className="col">
          <div className="text-center text-12 mb-10 text-light-1">{t('flights.hours_minutes', { h: hours, m: minutes })}</div>
          <ul className="flightLineCard text-center border-top-light d-flex border-width-2 align-items-start justify-content-between">
            <li className="flight-stop flight-start">
              {/* <span className="stop-name">{departureIata}</span>
              <div className="stop-decor"></div>
              <img className="flight-icon" src="/img/flights/flight-takeoff.svg" alt={t('flights.flight_takeoff')} /> */}
            </li>
            {/* <li className="flight-stop flight-between">
              {stops.length > 0 ? (
                <>
                <span className="stop-name text-blue-1">
                  {stops.length} Stops
                </span>
                <div className="stop-decor"></div>
                </>
              ) : (
                <span className="stop-name text-blue-1">
                  Nonstop
                </span>
              )}
            </li> */}
            {stops.length > 0 && (
              <>
              {stops.map((item, index) => {
                const stopDuration = getSkyscannerDateTimeDifference(item.arrivalDateTime, item.departureDateTime)
                const { hours: stopHours , minutes: stopMinutes } = formatMinutes(stopDuration)

                return (
                  <Popup
                    key={parentItemKey + item.entityId + index}
                    trigger={
                      <li className="flight-stop flight-between">
                        <span className={`stop-name sm:d-none`}>{item.originPlace.iata}</span>
                        <div className="stop-decor"></div>
                      </li>
                    }
                    position="top center"
                    on={['hover', 'focus']}
                    arrow={false}
                  >
                    <div
                      className="bg-white px-15 py-10 rounded-8 shadow-2 text-center text-13 lh-15"
                      style={{ marginTop: '-75px'}}
                    >
                      {item.transferPlace ? (
                        <>
                          {t('flights.stop')}: {item.originPlace.name} - {item.transferPlace.name}
                          <br />
                          {t('flights.hours_minutes_short', { h: stopHours, m: stopMinutes })}
                          <br />
                          <span className="text-red-1">
                          {t('flights.self_transfer_warning_note')}
                          </span>
                        </>
                      ) : (
                        <>
                          {t('flights.stop')}: {item.originPlace.name}
                          <br />
                          {t('flights.hours_minutes_short', { h: stopHours, m: stopMinutes })}
                        </>
                      )}
                    </div>
                  </Popup>
                )
              })}
              </>
            )}
            <li className="flight-stop flight-finish">
                {/* <span className="stop-name">{arrivalIata}</span> */}
                <div className="stop-decor"></div>
                {/* <img className="flight-icon" src="/img/flights/flight-land.svg" alt={t('flights.flight_land')} /> */}
                <i className={`flight-icon icon-aircraft text-18 text-rich-300`} />
            </li>
          </ul>
          <div className={`mt-10 stop-name text-blue-1 text-center ${stops.length > 0 ? 'd-none sm:d-block' : ''}`}>
            {stops.length > 0 ? (
              <>
              {t('flights.stops_count', { count: stops.length})}
              </>
            ) : (
              <>
              {t(`flights.nonstop`)}
              </>
            )}
          </div>
        </div>

        <div className="col-3 col-md-3 text-right d-flex flex-column justify-between">
          <div className="text-22 text-blue-1 lh-16 fw-700">{formattedArrivalTime}</div>
          {/* <div className="text-16 fw-600 lh-15 text-light-1">{arrivalIata}</div> */}
          <div className="text-12 lh-16 fw-600 text-light-1">{arrivalName}</div>
          <div className="text-12 lh-16 text-light-1">{formattedArrivalDate}</div>
        </div>
      </div>
    </>
  );
};

export default FlightPropertyItem;
