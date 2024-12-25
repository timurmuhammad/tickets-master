'use client'

import { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { Link } from "@/navigation"

const BigText = ({ tKey, tData = {} }) => {
  const newTKey = `seo.${tKey}`
  const { t, i18n } = useTranslation([newTKey])

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  const translatedData = t(`${newTKey}.article`, { returnObjects: true, ...tData })
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

  function renderArticleSection(content) {
    return (
      <div className="row">
        {content.map((item, index) => {
          if ((!item.h3_title && !item.h4_title) || !item.content) return null

          return (
            <div key={index} className="col-12 col-sm-6 mb-20">
              {item.h3_title && <h3 className="text-18 fw-500 mb-10">{item.h3_title}</h3>}
              {item.h4_title && <h4 className="text-16 fw-500 mb-10">{item.h4_title}</h4>}

              {item.content && <RenderContent content={item.content} />}
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
            {i18n.exists(`${newTKey}.article_title`) && (
              <div className="col-12 text-center">
                <h2>{t(`${newTKey}.article_title`)}</h2>
              </div>
            )}
            <div className={`col-12 text-14 text-light-1 position-relative`}>
              {renderArticleSection(visibleContent)}

              {hiddenContent.length > 0 && (
                <>
                <div className={`${!isExpanded ? 'article-preview' : ''}`}>
                  <div className="collapsed-divider"></div>
                  {renderArticleSection(hiddenContent)}
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
      </section>
    )}
    </>
  );
};

export default BigText;
