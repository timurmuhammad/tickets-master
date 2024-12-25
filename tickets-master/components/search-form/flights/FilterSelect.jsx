'use client'

import { useSearchForm } from './FlightsSearchProvider';
import { useTranslation } from 'react-i18next';
import Switch from './Switch';  // Import the Switch component

const FilterSelect = ({ filterItemsArr = [], textClass = '' }) => {
  const { t } = useTranslation(['search_form']);
  const { tripType, handleTripTypeTypeChange } = useSearchForm();
  const { classType, setClassType } = useSearchForm();
  const { hotelsSearch, setHotelsSearch } = useSearchForm();

  const handleClassTypeChange = (value) => {
    setClassType(value);
  };

  const handleHotelsSearchChange = () => {
    setHotelsSearch(hotelsSearch === 'true' ? 'false' : 'true');
  };

  const handleSwitchChange = () => {
    handleTripTypeTypeChange(tripType === "round_trip" ? "one_way" : "round_trip");
  };

  const dropdownOptions = [
    {
      title: "round_trip",
      value: tripType,
      type: 'switch',  // Specify switch type
      onChange: handleSwitchChange,
      labels: ["One Way", "Round Trip"]  // Add custom labels for switch
    },
    {
      title: "economy",
      value: classType,
      list: [
        { label: "economy" },
        { label: "premium_economy" },
        { label: "business_class" },
        { label: "first_class" }
      ],
      onChange: handleClassTypeChange,
    },
    {
      title: "show_hotels",
      value: hotelsSearch,
      type: 'checkbox',
      onChange: handleHotelsSearchChange,
    },
  ];

  return (
    <>
      {dropdownOptions.map((option, index) => {
        if (filterItemsArr.length === 0 || filterItemsArr.includes(option.title)) {
          return (
            <>
              {option.type === 'checkbox' ? (
                <div className="col-auto" key={index}>
                  <div className="form-checkbox d-flex items-center">
                    <input
                      type="checkbox"
                      checked={option.value === 'true'}
                      onChange={option.onChange}
                    />
                    <div className="form-checkbox__mark checkbox-white col-auto p-0">
                      <div className="form-checkbox__icon icon-check"></div>
                    </div>
                    <div className={`ml-10 ${textClass}`}>{t(`search_form.${option.title}`)}</div>
                  </div>
                </div>
              ) : option.type === 'switch' ? (  // Use the Switch component
                <div className="d-flex items-center" key={index}>
                  <Switch
                    checked={option.value === 'round_trip'}  // Binding checked state
                    onChange={option.onChange}  // Handling change
                    labels={option.labels}  // Custom labels for the switch
                  />
                </div>
              ) : (
                <div className="col-auto" key={index}>
                  <div className="dropdown js-dropdown">
                    <div
                      className="dropdown__button d-flex items-center"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="true"
                      data-bs-offset="0,0"
                    >
                      <span className={`js-dropdown-title ${textClass}`}>{t(`search_form.${option.value}`)}</span>
                      <i className={`icon icon-chevron-sm-down text-7 ml-10 ${textClass}`} />
                    </div>
                    <div className="toggle-element -dropdown js-click-dropdown dropdown-menu">
                      <div className="text-13 y-gap-15 js-dropdown-list">
                        {option.list.map((item, index) => (
                          <div key={index}>
                            <div
                              role="button"
                              className={`${
                                item.label === option.value ? "text-blue-1 " : ""
                              }d-block js-dropdown-link`}
                              onClick={() => option.onChange(item.label)}
                            >
                              {t(`search_form.${item.label}`)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        }
      })}
    </>
  );
};

export default FilterSelect;
