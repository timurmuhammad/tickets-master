'use client'

import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { useTranslation } from 'react-i18next'
import { Link } from "@/navigation"

const CounterHome = () => {
  const { appName } = useContext(AppContext)
  const { t } = useTranslation(['home'])

  const blockContent = [
    {
      id: 1,
      number: t('home.number_1'),
      meta: t('home.counter_1'),
      hasUnit: "",
      delayAnim: "100",
    },
    {
      id: 2,
      number: t('home.number_2'),
      meta: t('home.counter_2'),
      hasUnit: "",
      delayAnim: "200",
    },
    {
      id: 3,
      number: t('home.number_3'),
      meta: t('home.counter_3'),
      hasUnit: "",
      delayAnim: "300",
    },
    {
      id: 4,
      number: t('home.number_4'),
      meta: t('home.counter_4'),
      hasUnit: "",
      delayAnim: "400",
    },
  ];
  return (
    <section className="layout-pt-md layout-pb-lg">
      <div className="container">
        <div className="row y-gap-30 justify-between items-center">
          <div className="col-xl-5 col-lg-6">
            <h2 className="text-30 fw-600">{t('home.counter_title', { name: appName })}</h2>
            <p className="mt-40 lg:mt-20">
              {t('home.counter_subtitle', { name: appName })}
            </p>

            <div className="d-inline-block mt-40 lg:mt-20">
              <Link
                href="/about"
                target="_blank"
                // rel="noopener noreferrer"
                className="button -md -blue-1 bg-dark-4 text-white"
              >
                {t('home.counter_button')} <div className="icon-arrow-top-right ml-15"></div>
              </Link>
            </div>
          </div>

          <div className="col-xl-5 col-lg-6">
            <div className="shadow-2 rounded-4">
              <div className="row border-center">
                {blockContent.map((item) => (
                  <div
                    className="col-sm-6"
                    key={item.id}
                    data-aos="fade"
                    data-aos-delay={item.delayAnim}
                  >
                    <div className="py-60 sm:py-30 text-center">
                      <div className="text-40 lg:text-30 lh-13 text-dark-1 fw-600">
                        {item.number}
                        {item.hasUnit}
                      </div>
                      <div className="text-14 lh-14 text-light-1 mt-10">{item.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounterHome;
