'use client'

import Slider from "react-slick"
import { useTranslation } from 'react-i18next'

const Categories = () => {
  const { t } = useTranslation(['destinations_continent'])

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  const catContent = [
    { id: 7, icon: "icon-tickets", catName: "flights", url: '/flights' },
    { id: 1, icon: "icon-bed", catName: "hotels", url: '' },
    { id: 5, icon: "icon-car", catName: "cars", url: '' },
    { id: 6, icon: "icon-yatch", catName: "cruises", url: '' },
    { id: 2, icon: "icon-destination", catName: "tours", url: '' },
    { id: 4, icon: "icon-ski", catName: "activities", url: '' },
    { id: 5, icon: "icon-home", catName: "holiday_rentals", url: '' },
  ];
  return (
    <Slider {...settings}>
      {catContent.map((item) => (
        <div className="col" key={item.id}>
          <div
            className="d-flex flex-column justify-center px-20 py-15 rounded-4 border-light lh-14 col-12"
          >
            <i className={`${item.icon} text-25 mb-10`} />
            {t(`destinations_continent.${item.catName}`)}
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Categories;
