
'use client'

import React, { useState, useEffect } from "react";
import { useSearchForm } from './FlightsSearchProvider';
import { useTranslation } from 'react-i18next'

const maxPassengerCounts = 8;
const counters = [
  { name: "Adults", defaultValue: 1, minValue: 1, maxValue: 8 },
  { name: "Children", defaultValue: 0, minValue: 0, maxValue: 7 },
  { name: "Infants", defaultValue: 0, minValue: 0, maxValue: 7 },
];

const Counter = ({ name, defaultValue, maxValue, minValue, onCounterChange, passengerCounts, totalPassengerCounts }) => {
  const { t } = useTranslation(['search_form'])

  const [count, setCount] = useState(defaultValue);

  useEffect(() => {
    if(passengerCounts[name] !== count) {
      setCount(passengerCounts[name]);
    }
  }, [passengerCounts, name, count]);

  const incrementCount = () => {
    if (totalPassengerCounts < maxPassengerCounts && count < maxValue) {
      if (name !== "Infants" || count < passengerCounts.Adults) {
        setCount(count + 1);
        onCounterChange(name, count + 1);
      }
    }
  };
  
  const decrementCount = () => {
    if (count > 0 && count > minValue) {
      setCount(count - 1);
      onCounterChange(name, count - 1);
    }
  };

  return (
    <>
      <div className="row y-gap-10 justify-between items-center">
        <div className="col-auto">
          <div className="text-15 lh-12 fw-500">{t(`search_form.${name}`)}</div>
          {name === "Children" ? (
            <div className="text-14 lh-12 text-light-1 mt-5">{t('search_form.age')} 2 - 15</div>
          ) : name === "Infants" && (
            <div className="text-14 lh-12 text-light-1 mt-5">{t('search_form.age')} 0 - 2</div>
          )}
        </div>
        {/* End .col-auto */}
        <div className="col-auto">
          <div className="d-flex items-center js-counter">
            <button
              className="button -outline-dark-1 text-dark-1 size-38 rounded-4 js-down"
              onClick={decrementCount}
            >
              <i className="icon-minus text-12" />
            </button>
            {/* decrement button */}
            <div className="flex-center size-20 ml-15 mr-15">
              <div className="text-15 js-count">{count}</div>
            </div>
            {/* counter text  */}
            <button
              className="button -outline-dark-1 text-dark-1 size-38 rounded-4 js-up"
              onClick={incrementCount}
            >
              <i className="icon-plus text-12" />
            </button>
            {/* increment button */}
          </div>
        </div>
        {/* End .col-auto */}
      </div>
      {/* End .row */}
      <div className="border-top-light mt-24 mb-24" />
    </>
  );
};

const PassengersSearch = () => {
  const { t } = useTranslation(['search_form'])

  const { passengerCounts, setPassengerCounts } = useSearchForm();
  const totalPassengerCounts = Object.values(passengerCounts).reduce((acc, curr) => acc + curr, 0);
  const handleCounterChange = (name, value) => {
    setPassengerCounts((prevState) => ({ ...prevState, [name]: value }))
  }
  
  useEffect(() => {
    if (passengerCounts.Adults < passengerCounts.Infants) {
      setPassengerCounts(prevState => ({
        ...prevState,
        Infants: prevState.Adults,
      }));
    }
  }, [passengerCounts]);

  return (
    <div className="searchMenu-guests px-24 lg:py-20 md:py-10 lg:px-0 js-form-dd js-form-counters">
      <div
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
        data-bs-offset="0,22"
        aria-controls="passengersDropdownMenu"

      >
        <div className="text-dark-3 fw-400 ls-2 lh-16">{t('search_form.passengers')}</div>
        <div className="text-15 text-dark-1 ls-2 lh-18" style={{minWidth: '146px'}}>
          <span className="js-count-adult">{t('search_form.Adults_count', { count: passengerCounts.Adults })}</span> {" "}
            {passengerCounts.Children ? (
              <>
              - {" "} <span className="js-count-children">{t('search_form.Children_count', { count: passengerCounts.Children })}</span> {" "}
              </>
            ) : ''}
            {passengerCounts.Infants ? (
              <>
                - {" "} <span className="js-count-infants">{t('search_form.Infants_count', { count: passengerCounts.Infants })}</span>
              </>
            ) : ''}
        </div>
      </div>
      {/* End passengers */}

      <div className="shadow-2 dropdown-menu min-width-400 rounded-16" id="passengersDropdownMenu">
        <div className="bg-white px-30 py-30 rounded-16 counter-box">
          {counters.map((counter, index) => (
            <Counter
              key={index}
              name={counter.name}
              defaultValue={counter.defaultValue}
              maxValue={counter.maxValue}
              minValue={counter.minValue}
              onCounterChange={handleCounterChange}
              passengerCounts={passengerCounts}
              totalPassengerCounts={totalPassengerCounts}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default PassengersSearch;
