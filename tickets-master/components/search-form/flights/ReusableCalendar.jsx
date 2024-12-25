import React from 'react';
import { Calendar } from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker"
import { useTranslation } from 'react-i18next'

const ReusableCalendar = ({
  months,
  weekDays,
  datePickerRef,
  newDates,
  selectDates,
  monthsToShow,
  mapDaysWithPrices,
  handleDatePickerMonthChange,
  tripType,
  currency,
  currencySymbol
}) => {
  const { t } = useTranslation(['search_form'])
  return (
    <>
    <Calendar
      months={months}
      weekDays={weekDays}
      ref={datePickerRef}
      containerClassName="custom_container-picker"
      value={newDates}
      onChange={selectDates}
      numberOfMonths={monthsToShow}
      offsetY={10}
      range={tripType === 'round_trip'}
      rangeHover={tripType === 'round_trip'}
      minDate={new DateObject()}
      mapDays={mapDaysWithPrices}
      onMonthChange={handleDatePickerMonthChange}
      onYearChange={handleDatePickerMonthChange}
    />
    {currency && currencySymbol && (
      <span className="text-13 text-blue-1 mt-10 ml-20">{t('search_form.prices_in_currency', { currencySymbol: currencySymbol, currency: currency })}</span>
    )}
    </>
  );
};

export default ReusableCalendar;