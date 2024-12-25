'use client'

import { Link } from "@/navigation";
import Image from "next/image";
import { continents } from "../../data/destinationsContent";
import { useTranslation } from 'react-i18next'

const Continents = () => {
  const { t } = useTranslation(['continents'])
  
  return (
    <>
      {continents.map((item) => (
        <div
          className={item.colClass}
          key={item.id}
          data-aos="fade"
          data-aos-delay={item.delayAnimation}
        >
          <Link
            href={item.href}
            className="citiesCard -type-3 d-block h-full rounded-8 "
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
              <h4 className="text-26 fw-600 text-white">
                {t(`continents.${item.slug}`)}
              </h4>
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

export default Continents;
