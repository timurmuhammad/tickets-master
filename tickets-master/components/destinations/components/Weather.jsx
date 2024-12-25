import { weather } from "@/data/continents"

const Weather = ({ t }) => {

  return (
    <>
      <div className="col-xl-12">
        <h2 className="text-22 fw-500">{t('destinations_continent.average_temperature_by_season')}</h2>
      </div>

      {Object.keys(weather).map((season) => (
        <div className="col-xl-3 col-6" key={season}>
          <div className="lh-1">{t(`destinations_continent.${season}`)}</div>
          <div className="text-15 fw-500 mt-10">
          <p>{t(`continent.${weather[season].celsius}`)}</p>
          <p>{t(`continent.${weather[season].fahrenheit}`)}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Weather;
