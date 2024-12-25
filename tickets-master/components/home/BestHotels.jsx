"use client";

import React, { useState } from "react";
import BestHotelsTabs from "./filter-tabs/BestHotelsTabs";
import BestHotelsSlider from "./BestHotelsSlider";

export default function BestHotels() {
  const [filterOption, setFilterOption] = useState("boutique");
  return (
    <section className="layout-pt-md layout-pb-lg">
      <div className="container">
        <div className="row y-gap-10 justify-between items-center">
          <div className="col-auto">
            <div className="sectionTitle -md">
              <h2 className="sectionTitle__title">Best Hotels Around the World</h2>
              <p className=" sectionTitle__text mt-5 sm:mt-0">
                Providing unique experiences and memorable stays
              </p>
            </div>
          </div>
          {/* End .col-auto */}

          <div className="col-auto tabs -pills-2 ">
            <BestHotelsTabs
              filterOption={filterOption}
              setFilterOption={setFilterOption}
            />
          </div>
          {/* End .col-auto */}
        </div>
        {/* End .row */}

        <div className="relative overflow-hidden pt-40 sm:pt-20">
          <div className="row y-gap-30">
            <BestHotelsSlider filterOption={filterOption} />
          </div>
        </div>
        {/* End relative */}
      </div>
    </section>
  );
}
