
'use client'

import { useEffect, useState } from "react"
// import FlightsNavigationBar from "@/components/search-form/flights/FlightsNavigationBar"
import { useFlightsResults } from '@/components/flights/FlightsResultsContext'
import FlightsBanner from '@/components/flights/FlightsBanner'

const FlightsFormSticky = () => {
  const [header, setHeader] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 200) {
      setHeader(true);
    } else {
      setHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  const { status, pickedTickets } = useFlightsResults()

  return (
    <>
    {status && (
      <div className={`singleMenu js-singleMenu ${header ? "-is-active" : ""}`}>
        <div className="col-12">        

          <div className="singleMenu__content">
            <div className="container">
              
              <FlightsBanner />

              {/* {pickedTickets.length > 0 && (
                <div className="mt-33">
                  <FlightsNavigationBar />
                </div>
              )} */}

            </div>
            {/* End .container */}
          </div>
          {/* End .singleMenu__content */}
          
        </div>
      </div>
    )}
    </>
  )
}

export default FlightsFormSticky;
