const HeaderBanner = ({ t }) => {
  return (
    <section className="header-banner py-5 bg-dark-4 md:d-none">
      <div className="container">
        <div className="row items-center justify-center">
          <div className="col-auto">
              <p
                className="text-12 text-white"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                {t("header.header_banner_text")}
              </p>
          </div>
          {/* End .col */}
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}
    </section>
  );
};

export default HeaderBanner;
