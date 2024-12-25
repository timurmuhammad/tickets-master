"use client";

import Image from "next/image";
import { Link } from "@/navigation";
import Slider from "react-slick";
import { bestHotelsData } from "../../data/hotels";
import { useEffect, useState } from "react";
import WishlistButton from "@/components/wishlist/WishlistButton"

const BestHotelsSlider = ({ filterOption }) => {
  const [filteredItems, setFilteredItems] = useState([]);

  var itemSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  useEffect(() => {
    setFilteredItems(bestHotelsData.filter((elm) => elm.category == filterOption));
  }, [filterOption]);

  // custom navigation
  function ArrowSlick(props) {
    let className =
      props.type === "next"
        ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-next"
        : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-prev";
    className += " arrow";
    const char =
      props.type === "next" ? (
        <>
          <i className="icon icon-chevron-right text-12"></i>
        </>
      ) : (
        <>
          <span className="icon icon-chevron-left text-12"></span>
        </>
      );
    return (
      <button className={className} onClick={props.onClick}>
        {char}
      </button>
    );
  }

  return (
    <>
      {filteredItems.slice(0, 8).map((item) => {
        return (
          <div
            className="col-xl-3 col-lg-3 col-sm-6"
            key={item?.id}
            data-aos="fade"
            data-aos-delay={item.delayAnimation}
          >
            <Link
              href={item.link}
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
              className="hotelsCard -type-1 hover-inside-slider"
            >
              <div className="hotelsCard__image">
                <div className="cardImage inside-slider">
                  <Slider
                    {...itemSettings}
                    arrows={true}
                    nextArrow={<ArrowSlick type="next" />}
                    prevArrow={<ArrowSlick type="prev" />}
                  >
                    {item?.slideImg?.map((slide, i) => (
                      <div className="cardImage ratio ratio-1:1 rounded-8" key={i}>
                        <div className="cardImage__content ">
                          <Image
                            width={300}
                            height={300}
                            className="rounded-8 col-12 js-lazy"
                            src={slide}
                            alt={item?.title}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                  
                  <WishlistButton
                    wishlistKey='BestHotels_Wishlist'
                    id={item.id}
                    className="cardImage__wishlist"
                  />
                  {/* <div className="cardImage__wishlist">
                    <button className="button -blue-1 bg-white size-30 rounded-full shadow-2" type="button">
                      <i className="icon-heart text-12" />
                    </button>
                  </div> */}
                  
                  {item?.badge?.title && (
                    <div className="cardImage__leftBadge">
                      <div
                        className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${item?.badge?.classname}`}
                        style={{ backgroundColor: `${item?.badge?.color}` }}
                      >
                        {item?.badge?.title}
                      </div>
                    </div>
                  )}
                </div>
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
          </div>
        )
      })}
    </>
  );
};

export default BestHotelsSlider;
