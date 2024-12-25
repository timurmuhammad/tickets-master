
'use client'

import { useTranslation } from 'react-i18next'

const RecommendedFlightsTabs = ({ tabs, selectedTab, setSelectedTab, isLoading, nearestFlightLocation }) => {
  const { t } = useTranslation(['home'])
  
  return (
    <div className="tabs__controls row x-gap-15 justify-center js-tabs-controls pt-30">
      {tabs.map((tab, index) => (
        <div className="col-auto" key={index}>
          <button
            disabled={isLoading}
            className={`tabs__button position-relative text-13 text-dark-1 fw-500 px-16 py-5 rounded-100 w-min-120 js-tabs-button mb-10 ${isLoading ? 'disabled' : ''} ${
              selectedTab?.entityId === tab?.entityId ? "is-tab-el-active" : ""
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {nearestFlightLocation?.country?.entityId && (
              <>
                {nearestFlightLocation.country?.entityId == tab?.entityId && (
                  <div className="badges w-100 position-absolute d-flex justify-center" style={{ zIndex: '2', left: '0', top: '-14px'}}>
                    <div className={`fw-600 text-10 rounded-8 text-uppercase px-8 bg-dark-4 text-white mr-5`}>
                      <span>{t('home.domestic')}</span>
                    </div>
                  </div>
                )}
              </>
            )}
            {tab?.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecommendedFlightsTabs;
