'use client'

import React, { useEffect, useState } from "react";
import * as faqData from "@/data/faq";
import { useTranslation } from 'react-i18next'

// Function to remove spaces and convert to lowercase
const cleanAndLowerCase = (input) => {
  // return input.replace(/\s+/g, "").toLowerCase();
  return input
    .replace(/\s+/g, "")
    .replace(/-/g, "_")
};

const Faq = ({ dataName, dataTitle = null, dataValue = null, tKey = 'faq' }) => {
  const { t, i18n } = useTranslation([`${tKey}`])

  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    const cleanDataName = cleanAndLowerCase(dataName)
    const fetchData = async () => {
      try {
        // Dynamically import the entire JSON file
        const allData = faqData;

        // Check if the requested dataset exists in the JSON file
        if (allData && allData[cleanDataName]) {
          setJsonData(allData[cleanDataName]);
        } else {
          console.error(`Data set "${dataName}" not found in the JSON file.`);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [dataName]);

  return (
    <>
      {jsonData &&
        jsonData.map((item) => {
          if (i18n.exists(`${tKey}.${item.question}`) && i18n.exists(`${tKey}.${item.answer}`)) {
            return (
              <div className="col-12" key={item.id}>
                <div className="accordion__item px-20">
                  <div
                    className="accordion__button d-flex items-center"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${item.collapseTarget}`}
                  >
                    <div className="accordion__icon size-30 flex-center bg-blue-1-05 rounded-full mr-20">
                      <i className="icon-plus" />
                      <i className="icon-minus" />
                    </div>
                    <div className="button text-dark-1 text-start">
                      {dataTitle ? t(`${tKey}.${item.question}`, { title: dataTitle}) : t(`${tKey}.${item.question}`)}
                    </div>
                  </div>
                  {/* End accordion button */}

                  <div
                    className="accordion-collapse collapse"
                    id={item.collapseTarget}
                    data-bs-parent="#Faq1"
                  >
                    <div className="pt-5 pl-50 lh-15">
                      <p className="text-15">
                        {dataValue ? t(`${tKey}.${item.answer}`, { value: dataValue}) : t(`${tKey}.${item.answer}`)}
                      </p>
                    </div>
                  </div>
                  {/* End accordion content */}
                </div>
              </div>
            )
          }
        })}
    </>
  );
};

export default Faq;
