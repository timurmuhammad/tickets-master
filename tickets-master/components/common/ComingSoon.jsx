'use client'

import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { useTranslation } from 'react-i18next'
import CallToActions from "@/components/common/CallToActions";
import Header from "@/components/header";

const ComingSoon = () => {
  const { appName } = useContext(AppContext)
  const { t } = useTranslation(['home'])

  const data = {
    imageSrc: "/img/misc/coming.png",
    title: t('home.counter_title', { name: appName }),
    description: t('home.counter_subtitle', { name: appName }),
  };

  return (
    <>
      <Header minimalistic={true} />
      <div className="d-flex flex-column justify-between" style={{ minHeight: '100vh' }}>
        <section className="layout-pt-lg layout-pb-lg flex-grow">
          <div className="container">
            <div className="row y-gap-30 justify-between items-center">
              <div className="col-lg-6">
                <img src={data.imageSrc} alt="Coming Soon" />
              </div>
              <div className="col-lg-5">
                <div className="no-page">
                  <h1 className="text-30 fw-600">{data.title}</h1>
                  <div className="pr-30 mt-5">{data.description}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div>
          <CallToActions />
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
