import Social from "../common/social/Social"
import { Link } from "@/navigation"
import { Trans } from "react-i18next"

const Copyright = ({ t }) => {
  return (
    <div className="row justify-between items-center y-gap-10">
      <div className="col-auto">
        <div className="row x-gap-30 y-gap-10">
          <div className="col-auto">
            <div className="lh-1">
              <Trans
                i18nKey="footer.copyright"
                values={{ year: new Date().getFullYear() }}
                components={{
                  linkText: (
                    <Link
                      href="https://ttm.org"
                      className="mx-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  )
                }}
              />
            </div>
          </div>

          {/*<div className="col-auto">
            <div className="d-flex">
              <Trans
                i18nKey="footer.made_by"
                components={{
                  linkText: (
                    <Link
                      href="https://bxnda.com"
                      className="mx-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  )
                }}
              />
            </div>
          </div>*/}
        </div>
        <div className="text-10 mt-5 lh-1">
          {t('footer.disclaimer')}
        </div>
        {/* End .row */}
      </div>
      {/* End .col */}

      <div className="col-auto">
        <div className="row y-gap-10 items-center">
          <div className="col-auto">
            <div className="d-flex x-gap-20 items-center">
              <Social />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
