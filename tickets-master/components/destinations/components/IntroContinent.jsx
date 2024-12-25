'use client'

import { useState } from 'react';
import { useTranslation } from 'react-i18next'

const IntroContinent = ({ continentName }) => {
  const { t } = useTranslation(['destinations_continent', 'continent'])

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  const introText = t('continent.intro_content', { continent: continentName })

  const visibleText = introText.split('<!--DIVIDER-->')[0]
  const hiddenText = introText.split('<!--DIVIDER-->')[1]

  return (
    <>
      <div className="col-xl-12">
        <h2>{t('continent.intro_title', { continent: continentName })}</h2>
      </div>
      <div className={`col-xl-12`}>
        <div className="y-gap-20 text-15 text-light-1" dangerouslySetInnerHTML={{ __html: visibleText }}></div>
        <button
          className="d-block fw-500 underline uppercase mt-40"
          onClick={toggleCollapse}
        >
          {isExpanded ? t('destinations_continent.show_less') : t('destinations_continent.show_more')}
        </button>
        <div className={`${isExpanded ? 'show' : 'd-none'}`}>
          <div className="collapsed-divider"></div>
          <div className="y-gap-20 text-15 text-light-1" dangerouslySetInnerHTML={{ __html: hiddenText }}></div>
        </div>
      </div>
      {/* End .col */}
    </>
  );
};

export default IntroContinent;
