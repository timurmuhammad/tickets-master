
'use client'

import Image from "next/image";
import { Link } from "@/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { lastMinuteDeals } from "../../data/lastMinuteData";
import isTextMatched from "../../utils/isTextMatched";
import WishlistButton from "@/components/wishlist/WishlistButton"

const Hotels = () => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".js-hotels-next",
          prevEl: ".js-hotels-prev",
        }}
        pagination={{
          el: ".js-hotels-pag",
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
            slidesPerView: 4,
          },
        }}
      >
        {lastMinuteDeals.slice(0, 8).map((item) => (
          <SwiperSlide key={item?.id}>
            <Link
              href={item.link}
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
              className="hotelsCard -type-1 hover-inside-slider"
              data-aos="fade"
              data-aos-delay={item.delayAnimation}
            >
              <div className="hotelsCard__image">
                <div className="cardImage ratio ratio-1:1">
                  <div className="cardImage__content">
                    <div className="cardImage-slider rounded-4 overflow-hidden custom_inside-slider">
                      <Swiper
                        className="mySwiper"
                        modules={[Pagination, Navigation]}
                        pagination={{
                          clickable: true,
                        }}
                        navigation={true}
                      >
                        <Image
                          width={300}
                          height={300}
                          className="rounded-8 col-12 js-lazy"
                          src={item.img}
                          alt={item.title}
                        />
                      </Swiper>
                    </div>
                  </div>
                </div>
                {/* End .cardImage */}

                <WishlistButton
                  wishlistKey='BestDealsHotels_Wishlist'
                  id={item.id}
                  className="cardImage__wishlist"
                />
                  
                {item?.percent && (
                  <div className="cardImage__leftBadge">
                    <div
                      className={`py-5 px-15 rounded-right-4 text-16 lh-16 fw-600 uppercase bg-green-2 text-white`}
                    >
                      - {item?.percent} %
                    </div>
                  </div>
                )}
              </div>

              <div className="hotelsCard__content mt-5">
                <h4 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500 text-truncate">
                  <span>{item?.title}</span>
                </h4>
                <p className="text-light-1 lh-14">
                  {item?.location}
                </p>

                <div className="d-flex items-center mt-10">
                  <div className="flex-center bg-dark-4 rounded-8 size-30 text-12 fw-600 text-white">
                    {item?.ratings}
                  </div>
                  <div className="d-flex flex-column ml-10 lh-15">
                    <div className="text-dark-1 fw-500">
                      {item?.rate}
                    </div>
                    <div className="text-10 text-light-1">
                      {item?.numberOfReviews} reviews
                    </div>
                  </div>
                </div>

                <div className="text-light-1 mt-5">
                  Starting from{" "}
                  <span className={`text-dark-1 fw-500 ${item?.discount ? "line-through" : ""}`}>
                    ${item?.price}
                  </span>
                  {item?.discount && (
                    <>
                      &nbsp; {/* Space between prices */}
                      <span className="text-green-2 fw-500">
                        ${item?.discount}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="d-flex x-gap-15 items-center justify-center sm:justify-start pt-40 sm:pt-20">
        <div className="col-auto">
          <button className="d-flex items-center text-24 arrow-left-hover js-hotels-prev">
            <i className="icon icon-arrow-left text-dark-1" />
          </button>
        </div>
        {/* End .prev */}

        <div className="col-auto">
          <div className="pagination -dots text-border js-hotels-pag" />
        </div>
        {/* End .pagination */}

        <div className="col-auto">
          <button className="d-flex items-center text-24 arrow-right-hover js-hotels-next">
            <i className="icon icon-arrow-right text-dark-1" />
          </button>
        </div>
        {/* End .next */}
      </div>
      {/* End navigation and pagination */}
    </>
  );
};

export default Hotels;
