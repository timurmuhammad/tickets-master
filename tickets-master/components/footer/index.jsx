'use client';

// import AppButton from "./AppButton";
import ContactInfo from "./ContactInfo";
import Copyright from "./Copyright";
import FooterContent from "./FooterContent";
import Images from "./Images";
import { useTranslation } from 'react-i18next'

const index = () => {
  const { t } = useTranslation(['footer'])

  return (
    <footer className="footer -type-1 text-12">
      <div className="container">
        <div className="pt-60 pb-60">
          <div className="row y-gap-40 justify-between xl:justify-start">
            <div className="col-xl-2 col-lg-4 col-sm-6">
              <div className="text-16 fw-500 mb-30">{t('footer.contact_us_by')}</div>
              <ContactInfo />
            </div>

            <FooterContent />

            <Images />
            
          </div>
        </div>
        {/* End footer top */}

        <div className="py-20 border-top-light">
          <Copyright t={t} />
        </div>
        {/* End footer-copyright */}
      </div>
      {/* End container */}
    </footer>
  );
};

export default index;
