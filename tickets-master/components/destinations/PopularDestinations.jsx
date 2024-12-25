
'use client'

import { useRouter } from "@/navigation"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Scrollbar } from "swiper";
import { useSearchForm } from '@/components/search-form/flights/FlightsSearchProvider'
import { makeSearch } from "@/modules/skyscanner/utils/search"
import { useRecommendedUserLocation } from "@/hooks/useUserLocation"

const PopularDestinations = ({ cities }) => {
  const router = useRouter()
  const { flightsSearchData, setFlightsSearchData, setSearchActive, passengerCounts, hotelsSearch } = useSearchForm()
  const { recommendedFlightLocation } = useRecommendedUserLocation()

  return (
    <>
      <Swiper
        spaceBetween={30}
        className="overflow-visible"
        scrollbar={{
          el: ".js-popular-destination-scrollbar",
          draggable: true,
        }}
        modules={[Scrollbar, Navigation]}
        navigation={{
          nextEl: ".js-destination-next",
          prevEl: ".js-destination-prev",
        }}
        breakpoints={{
          500: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 22,
          },
          1024: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
      >
        {cities && cities.map((item, index) => {
          const newFlightsSearchData = {... flightsSearchData}
          newFlightsSearchData.fromPlace = recommendedFlightLocation
          newFlightsSearchData.toPlace = item.city
          newFlightsSearchData.dates = []
          newFlightsSearchData.passengerCounts = passengerCounts
          newFlightsSearchData.hotelsSearch = hotelsSearch

          return (
            <SwiperSlide key={index}>
              <div
                className="citiesCard -type-1 d-block cursor-pointer rounded-16"
                onClick={() => {
                  makeSearch({ router, searchData: { ... newFlightsSearchData }, setFlightsSearchData, setSearchActive, openInNewTab: true })
                }}
              >
                <div className="citiesCard__image ratio ratio-3:4">
                  <Image
                    width={300}
                    height={400}
                    // src={`/img/destinations/cities/${item.imageUrl}.png`}
                    src={`/img/destinations/cities/new-york.png`}
                    alt="image"
                    className="js-lazy"
                  />
                </div>
                <div className="citiesCard__content d-flex flex-column justify-between text-center pt-30 pb-20 px-20">
                  <div className="citiesCard__bg" />
                  <div className="citiesCard__top">
                    <div className="text-14 text-white">{item.country.name}</div>
                  </div>
                  <div className="citiesCard__bottom">
                    <h5 className="text-20 md:text-20 lh-13 text-white mb-20">
                      {item.city.name}
                    </h5>
                    <button className="button col-12 h-40 -dark-1 bg-white text-dark-1">
                      Discover
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      <div className="slider-scrollbar bg-light-2 mt-40 js-popular-destination-scrollbar" />
    </>
  );
};

export default PopularDestinations;
