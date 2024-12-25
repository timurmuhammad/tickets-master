import React from "react";

const Switch = ({ checked, onChange, labels = ["Latest", "Popular"] }) => {
  return (
    <div className="switch-wrapper">
      <label className="switch" aria-label="Toggle Filter">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </label>
    </div>
  );
};

export default Switch;
