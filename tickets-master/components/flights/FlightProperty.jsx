import React, { useState, useEffect, useRef, useMemo, useContext } from 'react'
import FlightDeals from "@/components/flights/FlightDeals"
import FlightPropertyItem from "@/components/flights/FlightPropertyItem"
import FlightPropertyDetails from "@/components/flights/FlightPropertyDetails"
import { formatDateTime, formatMinutes } from "@/helpers/main"
import { getSkyscannerDateTimeDifference } from "@/helpers/skyscanner"
import { useTranslation } from 'react-i18next'
import { AppContext } from '@/contexts/AppContext'
import Popup from 'reactjs-popup'
import { formatPrice } from '@/helpers/price'

const FlightProperty = ({
  locale,
  currency,
  index,
  flightItem,
  pickedTickets,
  searchStatus,
  isShared = false,
  highlightFirst = false
}) => {
  const { t } = useTranslation(['flights'])
  const { domain } = useContext(AppContext)
  const [showFlightInformation, setShowFlightInformation] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const contentRef = useRef(null)

  const outboundStops = useMemo(() => flightItem.outbound.steps.filter(step => step.transfer), [flightItem.outbound?.steps])
  const inboundStops = useMemo(() => flightItem.inbound?.steps.filter(step => step.transfer), [flightItem.inbound?.steps])

  const { formattedDate: outboundDate } = formatDateTime({ datetime: flightItem.outbound.departureDateTime, locale })
  const { formattedDate: inboundDate } = formatDateTime({ datetime: flightItem.inbound?.departureDateTime, locale })

  const { hours: outboundHours, minutes: outboundMinutes } = formatMinutes(flightItem.outbound.durationInMinutes)
  const { hours: inboundHours, minutes: inboundMinutes } = formatMinutes(flightItem.inbound?.durationInMinutes)

  const toggleFlightInformation = () => {
    setShowFlightInformation(!showFlightInformation)
  }

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = showFlightInformation ? `${contentRef.current.scrollHeight + 30}px` : '0px'
    }
  }, [showFlightInformation])

  const ticketType = pickedTickets && pickedTickets.length > 0
    ? pickedTickets.find((item) => flightItem.itineraryId === item.ticket.itineraryId)?.type
    : null

  const shareUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      searchParams.set('itineraryId', flightItem.itineraryId);
      return `https://${domain}${url.pathname}?${searchParams.toString()}${window.location.hash}`;
    }
    return '';
  }, [flightItem.itineraryId, domain]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      console.log('copied')
      setPopupOpen(true)
      setTimeout(() => {
        setPopupOpen(false)
      }, 1500);
    });
  };

  return (
    <div className={`js-accordion position-relative`}>
      {isShared && (
        <div className="position-absolute" style={{ zIndex: 1, right: '15px', top: '6px' }}>
          <div className={`text-13 fw-500 flex-center text-center bg-blue-1 text-white rounded-8 px-10 py-2`}>
            <span>{t('flights.flight_shared')}</span>
          </div>
        </div>
      )}
      <div className={`flightsCard ${isShared ? 'shared' : ''}`}>
        <div className="row d-sm-flex">
          {ticketType && <div className="watermark">{ticketType}</div>}
          <div className="col pr-0 md:pr-15 relative">
            <FlightPropertyItem
              locale={locale}
              parentItemKey={`Inbound`}
              departureName={flightItem.outbound.originPlace.name}
              departureIata={flightItem.outbound.originPlace.iata}
              departureDatetime={flightItem.outbound.departureDateTime}
              arrivalName={flightItem.outbound.destinationPlace.name}
              arrivalIata={flightItem.outbound.destinationPlace.iata}
              arrivalDatetime={flightItem.outbound.arrivalDateTime}
              durationInMinutes={flightItem.outbound.durationInMinutes}
              segments={flightItem.outbound.segments}
              stops={outboundStops}
            />
            {flightItem.inbound && (
              <>
                <br />
                <FlightPropertyItem
                  locale={locale}
                  parentItemKey={`Outbound`}
                  departureName={flightItem.inbound.originPlace.name}
                  departureIata={flightItem.inbound.originPlace.iata}
                  departureDatetime={flightItem.inbound.departureDateTime}
                  arrivalName={flightItem.inbound.destinationPlace.name}
                  arrivalIata={flightItem.inbound.destinationPlace.iata}
                  arrivalDatetime={flightItem.inbound.arrivalDateTime}
                  durationInMinutes={flightItem.inbound.durationInMinutes}
                  segments={flightItem.inbound.segments}
                  stops={inboundStops}
                />
              </>
            )}
          </div>

          <div className="col-md-auto relative">
            <div className="mt-20 border-top-light-dashed d-md-none" />
            <div className="d-flex items-center h-full">
              <div className="pl-30 border-left-light-dashed h-full md:d-none" />
              <div className="w-100">
                <div className="row flex-column md:flex-row md:justify-between">
                  <div className="col-auto text-right md:text-left mb-10">
                    <div className="text-18 lh-16 fw-600">{formatPrice({ locale, price: flightItem.minPrice, currency: currency })}</div>
                    <div className="lh-16 text-light-1">
                      {searchStatus === 'loading' ? (
                        <>
                          <div className="loading-spinner" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                          <span className='ml-5'>{t('flights.offers')}</span>
                        </>
                      ) : (
                        t('flights.offers_count', { count: flightItem.deals.length })
                      )}
                    </div>
                  </div>

                  <FlightDeals deals={flightItem.deals} currency={currency} />
                </div>

                <div className="row flex-column md:flex-row items-center">
                  <div className="col-md-12 col-6 accordion__button text-right md:text-left pt-5">
                    <button
                      className="text-12 underline text-blue"
                      onClick={toggleFlightInformation}
                    >
                      {t('flights.flight_information')}
                    </button>
                  </div>

                  <div className="col-md-12 col-6 mt-10 text-right position-relative share-item">
                    <Popup
                      open={popupOpen}
                      trigger={
                        <button className="bg-light-2 px-8 py-8 md:px-10 md:py-10 rounded-10 text-blue-1">
                          <div className="icon-share-container d-flex items-center justify-center">
                            <i className="icon-share text-22 md:text-20"></i>
                          </div>
                        </button>
                      }
                      onOpen={copyToClipboard}
                      onClose={() => setPopupOpen(false)}
                      position="bottom left"
                      on={['click']}
                      arrow={false}
                    >
                      {popupOpen && (
                        <div className="bg-white px-15 py-10 rounded-8 shadow-2 mt-5 link-copied-tooltip">
                          <p>{t('flights.link_copied')}</p>
                        </div>
                      )}
                    </Popup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={contentRef} className={`md:mt-15 collapse-custom ${showFlightInformation ? 'show relative' : ''}`}>
          {showFlightInformation && (
            <>
              <div className="border-dashed rounded-16 mt-30">
                <div className="py-20 px-30">
                  <div className="row justify-between items-center">
                    <div className="col-auto">
                      <div className="fw-500 text-dark-1">
                        {t('flights.outbound')} • {outboundDate}
                      </div>
                    </div>
                    <div className="col-auto">
                      <div className="text-light-1">{t('flights.total_duration')}: {t('flights.hours_minutes_short', { h: outboundHours, m: outboundMinutes })}</div>
                    </div>
                  </div>
                </div>
                {flightItem.outbound.segments.map((segment, index) => {
                  const nextSegment = flightItem.outbound.segments[index + 1]
                  const stopDuration = nextSegment ? getSkyscannerDateTimeDifference(segment.arrivalDateTime, nextSegment.departureDateTime) : ''
                  return (
                    <FlightPropertyDetails
                      locale={locale}
                      key={`Outbound${index}`}
                      item={segment}
                      isStop={!!nextSegment}
                      stopDuration={stopDuration}
                      isTransferRequired={nextSegment ? segment.destinationPlaceId !== nextSegment.originPlaceId : false}
                    />
                  )
                })}
              </div>
              
              {flightItem.inbound && (
                <div className="border-dashed rounded-16 mt-30">
                  <div className="py-20 px-30">
                    <div className="row justify-between items-center">
                      <div className="col-auto">
                        <div className="fw-500 text-dark-1">
                          {t('flights.inbound')} • {inboundDate}
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="text-light-1">{t('flights.total_duration')}: {t('flights.hours_minutes_short', { h: inboundHours, m: inboundMinutes })}</div>
                      </div>
                    </div>
                  </div>
                  {flightItem.inbound.segments.map((segment, index) => {
                    const nextSegment = flightItem.inbound.segments[index + 1]
                    const stopDuration = nextSegment ? getSkyscannerDateTimeDifference(segment.arrivalDateTime, nextSegment.departureDateTime) : ''
                    return (
                      <FlightPropertyDetails
                        locale={locale}
                        key={`Inbound${index}`}
                        item={segment}
                        isStop={!!nextSegment}
                        stopDuration={stopDuration}
                        isTransferRequired={nextSegment ? segment.destinationPlaceId !== nextSegment.originPlaceId : false}
                      />
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {highlightFirst && (
        <hr className="mt-30"/>
      )}
    </div>
  )
}

export default FlightProperty
