'use client'

import { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { Link } from "@/navigation"

const Faq = ({ tKey, tData = {} }) => {
  const newTKey = `seo.${tKey}`
  const { t, i18n } = useTranslation([newTKey])

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  const translatedData = t(`${newTKey}.faq`, { returnObjects: true, ...tData })
  const articleData = translatedData && Array.isArray(translatedData) ? translatedData : []

  // Find divider index
  const dividerIndex = articleData.findIndex(item => item.type === 'divider');
  
  // Split content into visible and hidden
  const visibleContent = dividerIndex !== -1 
    ? articleData.slice(0, dividerIndex)
    : articleData;
    
  const hiddenContent = dividerIndex !== -1 
    ? articleData.slice(dividerIndex + 1)
    : [];

  const RenderContent = ({ content }) => {
    return (
      <p className="text-14 text-light-1 lh-14">
        {Array.isArray(content)
          ? content.map((item, index) =>
              typeof item === "string" ? (
                item
              ) : item.type === "link" ? (
                <Link key={index} href={item.url} target={item.target} className="text-blue-4 fw-500 underline">
                  {item.text}
                </Link>
              ) : null
            )
          : content}
      </p>
    );
  };

  function renderArticleSection(content, type) {
    return (
      <div className="row">
        {content.map((item, index) => {
          if ((!item.h3_title && !item.h4_title) || !item.content) return null

          const newIndex = `FAQ${index}${type}`
          return (
            <div key={index} className="col-12 mb-20">
              <div className="accordion__item px-20">
                <div
                  className="accordion__button d-flex items-center"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${newIndex}`}
                >
                  <div className="accordion__icon size-30 flex-center bg-blue-1-05 rounded-full mr-20">
                    <i className="icon-plus" />
                    <i className="icon-minus" />
                  </div>
                  <div className="button text-dark-1 text-start">
                    {item.h3_title && <h3 className="text-18 fw-500 mb-10">{item.h3_title}</h3>}
                    {item.h4_title && <h4 className="text-16 fw-500 mb-10">{item.h4_title}</h4>}
                  </div>
                </div>
                {/* End accordion button */}

                <div
                  className="accordion-collapse collapse"
                  id={newIndex}
                  data-bs-parent={`#faq${type}`}
                >
                  <div className="pt-5 pl-50 lh-15">
                    {item.content && <RenderContent content={item.content} />}
                  </div>
                </div>
                {/* End accordion content */}
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  return (
    <>
    {articleData.length > 0 && (
      <section className="layout-pt-md">
        <div className="container">
          <div className="row y-gap-20 pt-40">
            {i18n.exists(`${newTKey}.faq_title`) && (
              <div className="col-lg-4">
                <h2 className="text-30 fw-500">{t(`${newTKey}.faq_title`)}</h2>
              </div>
            )}

            <div className="col-lg-8">
              <div className="accordion -simple row y-gap-20 js-accordion">
                <div className={`col-12 text-14 text-light-1 position-relative`}>
                  {renderArticleSection(visibleContent, 'visible')}

                  {hiddenContent.length > 0 && (
                    <>
                    <div className={`${!isExpanded ? 'article-preview' : ''}`}>
                      <div className="collapsed-divider"></div>
                      {renderArticleSection(hiddenContent, 'hidden')}
                    </div>
                    <div className={`d-flex justify-content-center mb-20`}>
                      <button
                        className="underline uppercase"
                        onClick={toggleCollapse}
                      >
                        {isExpanded ? t(`seo.show_less`) : t(`seo.show_more`)}
                      </button>
                    </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )}
    </>
  );
};

export default Faq;
