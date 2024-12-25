
import React from 'react';

const Badge = ({ item }) => {
  return (
    <div className="cardImage__leftBadge">
      <div
        className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${item?.badge?.classname}`}
        style={{ backgroundColor: `${item?.badge?.color}` }}
      >
        {item?.badge?.title}
      </div>
    </div>
  );
};

export default Badge;
