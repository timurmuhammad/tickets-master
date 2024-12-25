const BonusContent = ({ t }) => {

  return (
    <div className="offcanvas-body d-flex flex-column justify-content-center">
      <div className="container">
        <div className="row justify-center">
          <div className="col-xl-12">
            <div className="text-center">
              <div
                className="text-60 fw-400 lg:text-40 md:text-30 text-dark-1"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {t('header.bonus_title')}
              </div>
              <p
                className="text-dark-1 mt-5"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {t('header.bonus_sub')}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* End  container */}
    </div>
  );
};

export default BonusContent
