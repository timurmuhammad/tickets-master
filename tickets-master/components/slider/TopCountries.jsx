
'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { topCountries } from "../../data/countries";
import { Link } from "@/navigation";

const TopCountries = () => {
  return (
    <div className="pt-40 overflow-hidden js-section-slider">
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".js-places-next",
          prevEl: ".js-places-prev",
        }}
        pagination={{
          el: ".js-places-pag",
          clickable: true,
        }}
        breakpoints={{
          540: {
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
            slidesPerView: 5,
          },
        }}
      >
        {topCountries.map((item) => (
          <SwiperSlide key={item.id}>
            <Link
              href="/tour-list-v3"
              className="citiesCard -type-2"
              data-aos="fade"
              data-aos-delay={item.delayAnimation}
            >
              <div className="citiesCard__image rounded-8 ratio ratio-3:4">
                <img
                  className="img-ratio rounded-8 js-lazy"
                  src={item.img}
                  alt="image"
                />
              </div>
              <div className="citiesCard__content mt-10">
                <h4 className="text-18 lh-13 fw-500 text-dark-1">
                  {item.title}
                </h4>
                <div className="text-14 text-light-1">
                  {item.travellers} travellers
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopCountries;
