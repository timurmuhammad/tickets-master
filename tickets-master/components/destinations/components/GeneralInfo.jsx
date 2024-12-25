import { info } from "@/data/continents"

const GeneralInfo = ({ t }) => {

  return (
    <>
      <div className="col-12">
        <h2 className="text-22 fw-500">{t('destinations_continent.general_information')}</h2>
      </div>
      <div className="col-xl-3 col-6">
        <div className="">{t('destinations_continent.time_zone')}</div>
        <div className="fw-500">{t(`continent.${info.timezone.range}`)}</div>
        <div className="text-13 text-light-1">{t(`continent.${info.timezone.note}`)}</div>
      </div>
      {/* End .col */}

      <div className="col-xl-3 col-6">
        <div className="">{t('destinations_continent.demographics')}</div>
        <div className="row y-gap-20">
          <div className="col-auto">
            <div className="fw-500">{t('destinations_continent.countries')}</div>
            <div className="text-13 text-light-1">
              {t(`continent.${info.demographics.countries}`)}
            </div>
          </div>
          {/* End .col */}

          <div className="col-auto">
            <div className="fw-500">{t('destinations_continent.population')}</div>
            <div className="text-13 text-light-1">
              {t(`continent.${info.demographics.population}`)}
            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
      {/* End .col */}

      <div className="col-xl-3 col-6">
        <div className="">{t('destinations_continent.tourist_arrivals')}</div>
        <div className="fw-500">{t(`continent.${info.tourists.range}`)}</div>
        <div className="text-13 text-light-1">{t(`continent.${info.tourists.note}`)}</div>
      </div>
      {/* End .col */}

      <div className="col-xl-3 col-6">
        <div className="">{t('destinations_continent.heritage_attractions')}</div>
        <div className="fw-500">{t(`continent.${info.heritage.range}`)}</div>
        <div className="text-13 text-light-1">{t(`continent.${info.heritage.note}`)}</div>
      </div>
      {/* End .col */}
    </>
  );
};

export default GeneralInfo;
