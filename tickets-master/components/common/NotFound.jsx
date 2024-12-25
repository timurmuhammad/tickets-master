'use client'

import { Link } from "@/navigation";
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation(['404'])

  const data = {
    imageSrc: "/img/misc/404.jpg",
    title: t('404.title'),
    description: t('404.subtitle'),
    buttonLabel: t('404.buttonText'),
    buttonUrl: "/",
  };

  return (
    <section className="layout-pt-lg layout-pb-lg">
      <div className="container">
        <div className="row y-gap-30 justify-between items-center">
          <div className="col-lg-6">
            <img src={data.imageSrc} alt="404" />
          </div>
          <div className="col-lg-5">
            <div className="no-page">
              <div className="no-page__title">
                4<span className="text-red">0</span>4
              </div>
              <h2 className="text-30 fw-600">{data.title}</h2>
              <div className="pr-30 mt-5">{data.description}</div>
              <div className="d-inline-block mt-40 md:mt-20">
                <Link
                  href={data.buttonUrl}
                  className="button -md -dark-4 bg-blue-1-05 text-black"
                >
                  {data.buttonLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
