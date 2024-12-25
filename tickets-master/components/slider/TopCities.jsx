
'use client'

import { useRef, useState } from 'react';
import { Link } from "@/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import { getContent } from '@/utils/appContent';
import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { cities } from "@/data/skyscannerCities";
import { getLocationUrl } from "@/helpers/main";
import { useRecommendedUserLocation } from "@/hooks/useUserLocation"
import { getIndicativePrices } from "@/modules/skyscanner/utils/search"
import { getDomainConfig } from '@/utils/domainConfig'
import { formatPrice } from "@/helpers/price"
import { DateObject } from 'react-multi-date-picker'

const TopCities = () => {
  const { t } = useTranslation(['home']);
  const { domain, locale, currency } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })
  const topCities = getContent(domain, 'topCities', locale)
  const { recommendedFlightLocation } = useRecommendedUserLocation()

  const months = []
  for (let i = 0; i < 12; i++) {
    months.push(new DateObject().add(i, 'month'))
  }

  // Ref for the Swiper instance
  const swiperRef = useRef(null);

  return (
    <div
      className="pt-40 js-section-slider"
      onMouseEnter={() => swiperRef.current?.swiper.autoplay.stop()}
      onMouseLeave={() => swiperRef.current?.swiper.autoplay.start()}
    >
      <Swiper
        ref={swiperRef} // Assign ref to Swiper
        className="overflow-visible"
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        spaceBetween={30}
        modules={[Autoplay, Pagination, Navigation]}
        navigation={{
          nextEl: ".js-places-next",
          prevEl: ".js-places-prev",
        }}
        pagination={{
          el: ".js-places-pag",
          clickable: true,
        }}
        breakpoints={{
          250: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 22,
          },
          1024: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 5,
          },
        }}
      >
        {topCities?.map((item, index) => {
          const [clicked, setClicked] = useState(false); // State to track the first click
          const [indicativePrice, setIndicativePrice] = useState(null)

          const city = cities.find(cityItem => item.city.entityId == cityItem.entityId || item.city.iataCode == cityItem.iataCode);
          const cityUrl = getLocationUrl({ locationType: 'city', location: city });

          const handleLinkClick = async (e) => {
            if (!clicked) {
              e.preventDefault(); // Prevent following the link on the first click

              setClicked(true); // Set clicked to true after showing the price

              const monthsIndicativePricesData = await getIndicativePrices({
                searchData: {
                  fromPlace: recommendedFlightLocation,
                  toPlace: city,
                  dates: [{ date: [ months[0], months[months.length - 1] ], dateType: 'month' }]
                },
                locale, currency, skyscannerMarket, type: 'dates', groupBy: 'dates'
              })
              const fetchedDataMonthsArr = Object.values(monthsIndicativePricesData)
              const cheapestFetchedDate = fetchedDataMonthsArr.length > 0 ? fetchedDataMonthsArr.sort((a, b) => a.price - b.price)[0] : null
              console.log('cheapestFetchedDate', cheapestFetchedDate)
              setIndicativePrice(cheapestFetchedDate)
            }
          };

          return (
            <SwiperSlide key={index}>
              <div className={`citiesCard -type-2`} data-aos="fade" data-aos-delay={item.delayAnimation}>
                <Link
                  href={clicked ? `${cityUrl}` : "#"}
                  target='_blank'
                  onClick={handleLinkClick} // Handle click to calculate price
                  className={`${clicked ? 'is-clicked' : ''}`}
                >
                  <div className="citiesCard__image rounded-8 ratio ratio-3:4">
                    <img
                      className="img-ratio rounded-8 js-lazy"
                      src={item.img}
                      alt={t('home.flights_to', { destination: item.city.name })}
                    />
                  </div>
                  <div className="citiesCard__content">
                    <div className="citiesCard__after">
                      {t('home.flights_to', { destination: item.city.name })}
                      <br />
                      <span>{item.country.name}</span>
                    </div>

                    <div className="citiesCard__before">
                      {clicked && indicativePrice ? (
                        <>
                        {formatPrice({ locale, price: indicativePrice.price, currency: currency })}
                        </>
                      ) : "✈️" + '\u00A0'}
                    </div>

                    {!clicked && (
                      <div className="citiesCard__hoverText">
                        {t('home.city_card_hover', { destinationFrom: recommendedFlightLocation?.name, destinationTo: item.city.name })}                        
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TopCities;
