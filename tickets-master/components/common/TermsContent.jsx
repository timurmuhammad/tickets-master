
'use client'

import React, { useState, useEffect } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { useTranslation } from 'react-i18next'
import { Trans } from "react-i18next"
import { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'
import { Link } from "@/navigation"

const TermsConent = () => {
  const { t } = useTranslation(['terms'])

  const { domain, appName } = useContext(AppContext)

  const tabs = ['terms_of_use', 'privacy_policy','best_price_guarantee']
  
  const [tabIndex, setTabIndex] = useState(0);

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    let index = 0; // default to the first tab
    if (hash) {
      switch (hash) {
        case 'terms_of_use':
          index = 0;
          break;
        case 'privacy_policy':
          index = 1;
          break;
        case 'best_price_guarantee':
          index = 2;
          break;
        default:
          break;
      }
      setTabIndex(index);
    }
  }, []);

  useEffect(() => {
    // Scroll when the tabIndex is updated and the component re-renders
    const currentTabId = tabs[tabIndex];
    if (currentTabId) {
      scrollToElement(currentTabId);
    }
  }, [tabIndex]);

  return (
    <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
      <div className="row y-gap-30">
        <div className="col-lg-3">
          <div className="px-30 py-30">
            <TabList className="tabs__controls row text-16 y-gap-10 js-tabs-controls">
              {tabs.map((tabItem) => {
                return (
                  <Tab className="col-12 tabs__button js-tabs-button" id={tabItem}>
                    {t(`terms.${tabItem}`)}
                  </Tab>
                )
              })}
            </TabList>
          </div>
        </div>
        {/* End .col-lg-3 */}

        <div className="col-lg-9">
          {tabs.map((tabItem) => {
            return (
              <TabPanel>
                <div className="tabs__content js-tabs-content" data-aos="fade">
                  <Trans
                    i18nKey={`terms.${tabItem}_content`}
                    values={{ appName: appName, domain }}
                    components={{
                      headline: (
                        <h1/>
                      ),
                      titleText: (
                        <h2 className="text-22 mt-20"/>
                      ),
                      itemText: (
                        <p className="text-16 mt-5"/>
                      ),
                      linkPrivacy: (
                        <Link
                          href="/terms#privacy_policy"
                          className="underline"
                        />
                      ),
                      linkContact: (
                        <Link
                          href="/contact"
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      linkMailInfo: (
                        <Link
                          href="mailto:info@ttm.org"
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      linkMailUnsubscribe: (
                        <Link
                          href="mailto:unsubscribe@ttm.org"
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      linkMailPrivacy: (
                        <Link
                          href="mailto:privacy@ttm.org"
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      linkMailSupport: (
                        <Link
                          href="mailto:support@ttm.org"
                          className="underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      linkCloudflarePrivacy: (
                        <Link
                          href="https://www.cloudflare.com/privacypolicy/"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      linkGooglePrivacy: (
                        <Link
                          href="https://policies.google.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      strongText: (
                        <strong />
                      ),
                      ulElem: (
                        <ul className="list-disc text-15 ml-10" />
                      ),
                      liText: (
                        <li />
                      ),
                    }}
                  />
                </div>
              </TabPanel>
            )
          })}
        </div>
        {/* End col-lg-9 */}
      </div>
    </Tabs>
  );
};

export default TermsConent;
