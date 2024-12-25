'use client'

import Image from "next/image";
import MainFilterSearchBox from "@/components/search-form/flights/MainFilterSearchBox"
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { useTranslation } from 'react-i18next'

const Index = () => {
  const { t } = useTranslation(['home'])

  const { appName } = useContext(AppContext)

  return (
    <section className="masthead -type-10">
      <div className="container-1500">
        <div className="row">
          <div className="col-lg-auto">
            <div className="masthead__content">
              <div
                className="text-80 lg:text-60 sm:text-40 pl-35 lg:pl-10 pb-20 lh-12 text-red"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {t('home.hero', {name: appName})}
              </div>
              <h1 className="text-15 w-400 text-light-1 pl-35 lg:pl-10" data-aos="fade-up" data-aos-delay="200">
                {t('home.h1', {name: appName})}
              </h1>
              <MainFilterSearchBox />
            </div>
          </div>
        </div>

        <div
          className="masthead__image"
          data-aos="fade-left"
          data-aos-delay="500"
        >
          <div className="row y-gap-30 flex-nowrap">
            <div className="col-auto">
              <Image
                width={290}
                height={560}
                src="/img/misc/hero-tickets.jpg"
                alt="Flight TICKETS"
                className="rounded-16"
                loading="eager"
                priority
              />
            </div>
            {/* End col-auto */}
          </div>
          {/* End .row */}
        </div>
        {/* End .masthead__image */}
      </div>
      {/* End .container */}
    </section>
  );
};

export default Index;
