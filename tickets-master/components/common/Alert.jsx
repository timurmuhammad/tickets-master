import Image from "next/image"

const Alert = ({ t }) => {

  return (
    <div className="col-12">
      <div className="px-24 py-15 rounded-22 flightsCard mt-0">
        <div className="row x-gap-20 y-gap-20 items-center">
          <div className="col-auto">
            <div className="flex-center">
              <Image
                width={80}
                height={80}
                src="/img/badges/best-price.png"
                alt={t('alert.best_price_guarantee')}
              />
            </div>
          </div>
          <div className="col-auto">
            <h4 className="text-18 lh-15 fw-500">
              {t('alert.best_price_guarantee_title')}
            </h4>
            <div className="text-15 lh-15">
              {t('alert.best_price_guarantee_sub')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;