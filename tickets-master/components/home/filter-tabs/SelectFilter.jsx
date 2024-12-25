const SelectFilter = () => {
  return (
    <select className="form-select rounded-100 -dark-4 bg-blue-1-05 justify-between fw-500 px-20 h-50 w-140 sm:w-full text-15">
      <option defaultValue>Hotels</option>
      <option value="apartments">Apartments</option>
      <option value="hostels">Hostels</option>
      <option value="motels">Motels</option>
      <option value="villa">Villa</option>
    </select>
  );
};

export default SelectFilter;
