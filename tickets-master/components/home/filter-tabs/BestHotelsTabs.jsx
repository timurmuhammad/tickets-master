
'use client'

const BestHotelsTabs = ({filterOption,setFilterOption}) => {

  const filterOptions = [
    { label: "Boutique", value: "boutique" },
    { label: "Luxury", value: "luxury" },
    { label: "Business", value: "business" },
    { label: "Budget", value: "budget" },
    { label: "Family", value: "family" },
    { label: "Historic", value: "historic" },
    // add more options as needed

  ];

  return (
    <div className="tabs__controls row x-gap-5 y-gap-10">
      {filterOptions.map((option) => (
        <div className="col-auto" key={option.value}>
          <button
            className={`tabs__button text-13 fw-500 px-5 py-5 rounded-8 w-min-80 js-tabs-button ${
              filterOption === option.value ? "is-tab-el-active" : ""
            }`}
            onClick={() => setFilterOption(option.value)}
          >
            {option.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default BestHotelsTabs;
