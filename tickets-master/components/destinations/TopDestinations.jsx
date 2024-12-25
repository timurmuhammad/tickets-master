'use client'

import { Link } from '@/navigation';
import Image from "next/image";
import { continentsHome } from "../../data/destinationsContent";
import { useTranslation } from 'react-i18next'

const TopDestinations = () => {
  const { t } = useTranslation(['home', 'continents'])

  return (
    <>
      {continentsHome.map((item) => (
        <div
          className={item.colClass}
          key={item.id}
          data-aos="fade"
          data-aos-delay={item.delayAnimation}
        >
          <Link
            href={item.href}
            target="_blank"
            className="citiesCard -type-3 d-block h-full rounded-8"
          >
            <div className="citiesCard__image ratio ratio-1:1">
              <Image
                className="col-12 js-lazy" 
                src={item.img} 
                alt={t(`continents.${item.slug}`)}
                width={633}
                height={633}
              />
            </div>
            <div className="citiesCard__content px-30 py-30">
              <h3 className="text-24 fw-500 text-white">
                {t('home.flights_to', { destination: t(`continents.${item.slug}`) })}
              </h3>
              <div className="text-15 text-white">
                {t('continents.countries_count', { count: item.numberOfCountries })}
              </div>
            </div>
          </Link> 
        </div>
      ))}
    </>
  );
};

export default TopDestinations;
