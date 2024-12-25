import RangeFilter from "./RangeFilter"
import CheckboxFilter from "./CheckboxFilter"
import ButtonFilter from "./ButtonFilter"
import { useFlightsResults } from '@/components/flights/FlightsResultsContext'
// import Tags from "./Tags"

const Sidebar = () => {
  const { filtersData } = useFlightsResults()

  return (
    <>
    {filtersData && filtersData.map((item, index) => {
      return (
        <div className={`sidebar__item ${index == 0 ? '-no-border' : ''}`} key={index}>
          {item.type == 'checkboxes' ? (
            <CheckboxFilter title={item.title} checkboxes={item.items} />
          ) : item.type == 'range' ? (
            <RangeFilter title={item.title} minValue={item.minValue} maxValue={item.maxValue} description={item.description} translate={item.translate} isPrice={item.isPrice} />
          ) : (
            <ButtonFilter title={item.title} buttons={item.items} />
          )}
        </div>
      )
    })}

    </>
  );
};

export default Sidebar;
