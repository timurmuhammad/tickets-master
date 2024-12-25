import { formatDateTime, formatMinutes } from "@/helpers/main"
import { formatSkyscannerImageUrl } from "@/helpers/skyscanner"
import ImageWithFallback from '@/components/image-with-fallback'
import { useTranslation } from 'react-i18next'

const FlightPropertyDetails = ({
  locale,
  item,
  isStop,
  stopDuration,
  isTransferRequired,
}) => {
  const { t } = useTranslation(['flights'])

  const { formattedDate: formattedDepartureDate, formattedTime: formattedDepartureTime } = formatDateTime({ datetime: item.departureDateTime, locale })
  const { formattedDate: formattedArrivalDate, formattedTime: formattedArrivalTime } = formatDateTime({ datetime: item.arrivalDateTime, locale })
  
  const { hours, minutes } = formatMinutes(item.durationInMinutes)

  const { hours: stopHours, minutes: stopMinutes } = formatMinutes(stopDuration)

  return (
    <>
    {item && (
    <>
      <div className="py-20 px-20 border-top-dashed">
        <div className="row y-gap-10 justify-between">
          <div className="col-auto">
            <div className="d-flex items-center mb-15">
              <div className="w-80 d-flex justify-center mr-15">
                <ImageWithFallback
                  src={formatSkyscannerImageUrl(item.carrier.name, item.carrier.imageUrl)}
                  width="150"
                  height="100"
                  fallbackSrc='/img/flights/carriers/default.png'
                  alt={item.carrier.name}
                  className="rounded-8"
                />
              </div>
              <div className="text-14 text-light-1">
                {item.carrier.name}
              </div>
            </div>
            <div className="relative z-0">
              <div className="border-line-2" />
              <div className="d-flex items-center">
                <div className="w-28 d-flex justify-center mr-15">
                  <div className="size-10 border-light rounded-full bg-white" />
                </div>
                <div className="row">
                  <div className="col-md-auto col-sm-12">
                    <div className="lh-14 fw-500">{formattedDepartureTime} <br /> <span className="text-12 text-light-1">{formattedDepartureDate}</span></div>
                  </div>
                  <div className="col-md-auto col-sm-12">
                    <div className="lh-14 fw-500">
                      {item.originPlace.name} ({item.originPlace.iata})
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex items-center mt-15">
                <div className="w-28 d-flex justify-center mr-15">
                  <i className="icon-aircraft text-18 text-rich-300"></i>
                </div>
                <div className="text-14 italic">{t('flights.hours_minutes_short', { h: hours, m: minutes })}</div>
              </div>
              <div className="d-flex items-center mt-15">
                <div className="w-28 d-flex justify-center mr-15">
                  <div className="size-10 border-light rounded-full bg-border" />
                </div>
                <div className="row">
                  <div className="col-md-auto col-sm-12">
                    <div className="lh-14 fw-500">{formattedArrivalTime} <br /> <span className="text-12 text-light-1">{formattedArrivalDate}</span></div>
                  </div>
                  <div className="col-md-auto col-sm-12">
                    <div className="lh-14 fw-500">
                      {item.destinationPlace.name} ({item.destinationPlace.iata})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>        
      </div>
        {isStop && (
          <div className="text-center mb-5">
            {t('flights.stop')} {t('flights.hours_minutes', { h: stopHours, m: stopMinutes })}
            {isTransferRequired && (
              <p className="text-12 text-red-1"><i className="icon-clock"></i> {t('flights.self_transfer_warning')}</p>
            )}
          </div>
        )}
    </>
    )}
    </>
  )
};

export default FlightPropertyDetails;
