"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import flightsData from "../../data/flights";

const Flights = ({ filterOption }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  useEffect(() => {
    setFilteredItems(
      filterOption === "" ? flightsData : flightsData.filter((elm) => elm.category === filterOption)
    )
  }, [filterOption])
  return (
    <>
      {filteredItems.slice(0, 5).map((item) => (
        <Link
          href="/flights" 
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            className="col-12"
            key={item?.id}
            data-aos="fade"
            data-aos-delay={item?.delayAnimation}
          >
            <div className="px-20 py-10 shadow-new rounded-100 xl:rounded-16">
              <div className="row y-gap-30 justify-between xl:justify-end sm:justify-center">
                {item?.flightList?.map((flight) => (
                  <div className="col-xl-4 col-lg-6" key={flight.id}>
                    <div className="row y-gap-10 items-center">
                      <div className="col-sm-auto">
                        <Image
                          width={40}
                          height={40}
                          className="size-40"
                          src={flight?.avatar}
                          alt={flight?.arrivalAirport}
                        />
                      </div>
                      <div className="col">
                        <div className="row x-gap-20 items-end">
                          <div className="col-auto">
                            <div className="text-18 lh-16 fw-700">{flight.departureTime}</div>
                            <div className="text-13 lh-15 text-light-1">{flight.departureAirport}</div>
                            <div className="text-12 lh-16 text-light-1">{flight.departureDate}</div>
                          </div>
                          <div className="col text-center">
                            <div className="flightLine">
                              <div />
                              <div />
                            </div>
                            <div className="lh-15 text-light-1 mt-10">
                              {flight.duration}
                            </div>
                          </div>
                          <div className="col-auto text-end">
                            <div className="text-18 lh-16 fw-700">{flight.arrivalTime}</div>
                            <div className="text-13 lh-15 text-light-1">{flight.arrivalAirport}</div>
                            <div className="text-12 lh-16 text-light-1">{flight.arrivalDate}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-auto">
                  <div className="d-flex items-center h-full">
                    <div className="text-right mr-24">
                      <div className="lh-15 fw-500">US${item?.price}</div>
                      <div className="text-15 lh-15 text-light-1">
                        {item?.deals} deals
                      </div>
                    </div>
                    <div className="button px-30 h-50 -outline-dark-1 -dark-1 bg-blue-1-05">
                      View Deal <div className="icon-arrow-top-right ml-15" />
                    </div>
                  </div>
                </div>
                {/* End .col */}
              </div>
              {/* End .row */}
            </div>
            {/* End px-20 */}
          </div>
        </Link>
      ))}
    </>
  );
};

export default Flights;
