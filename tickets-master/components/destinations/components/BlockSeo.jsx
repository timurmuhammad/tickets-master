const BlockSeo = ({ t }) => {
  return (
    <>
      <div className="col">
        <h2 className="text-30 fw-600">{t('destinations.seo_title')}</h2>
        <h3 className="text-15 mt-10">{t('destinations.seo_sub')}</h3>
        <p className="text-15 text-dark-1 mt-20 md:mt-5">
          {t('destinations.seo_text_1')}
          <br />
          <br />
          {t('destinations.seo_text_2')}
          <br />
          <br />
          {t('destinations.seo_text_3')}
          <br />
          <br />
          {t('destinations.seo_text_4')}
        </p>
      </div>
      {/* End .col */}
    </>
  );
};

export default BlockSeo;
