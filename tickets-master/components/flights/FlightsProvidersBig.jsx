
'use client'

import React, { useState, useEffect } from 'react';
import { useFlightsResults } from '@/components/flights/FlightsResultsContext'

const FlightsProviders = ({ showLoading = true }) => {

  const { flightsProviders, selectedFlightsProviders, setSelectedFlightsProviders, status } = useFlightsResults()
  const filteredAgents = process.env.NEXT_PUBLIC_FILTERED_AGENTS ? JSON.parse(process.env.NEXT_PUBLIC_FILTERED_AGENTS) : []
  const filteredAgentsProbability = process.env.NEXT_PUBLIC_FILTERED_AGENTS_PROBABILITY ? JSON.parse(process.env.NEXT_PUBLIC_FILTERED_AGENTS_PROBABILITY) : []
  const [agentsToShow, setAgentsToShow] = useState([])

  const [isClickable, setIsClickable] = useState(true)
  const [countdown, setCountdown] = useState(0);
  
  const handleSelectProvider = (provider) => {
    if (!isClickable) return;
    
    const randomTimeout = Math.floor(Math.random() * (45 - 15 + 1) + 10);
    setCountdown(randomTimeout);
    setIsClickable(false);

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval);
          setIsClickable(true);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    if (selectedFlightsProviders.includes(provider.name)) {
      setSelectedFlightsProviders(selectedFlightsProviders.filter(item => item !== provider.name));
    } else {
      setSelectedFlightsProviders([...selectedFlightsProviders, provider.name]);
    }

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (status == 'completed') {
      const newaAgentsToShow = []
      flightsProviders.forEach(item => {
        if (showAgent(item.agent)) {
          newaAgentsToShow.push(item.agent.name)
        }
      })
      setAgentsToShow(newaAgentsToShow)
    }
  }, [flightsProviders, status])

  const showAgent = (agent) => {
    if (agent) {
      if (filteredAgents.includes(agent.name)) {
        let prob = 100
    
        const newProb = filteredAgentsProbability.find(item => item.name === agent.name) ?? filteredAgentsProbability.find(item => item.name === 'all')
        if (newProb) {
          prob = parseInt(newProb.num)
        }

        const res = Math.floor(Math.random() * 100) + 1
        return res <= prob
      }
    }
    return false
  }

  return (
    <div className="position-relative">
      {(!isClickable || status == 'loading') && (
        <div className="overlay rounded-16" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className='bg-dark px-15 py-10 rounded-16'>
            <h1 className='text-white'>
              {countdown > 0 ? (
              <>
                Waiting {countdown} seconds...
              </>
              ) : status == 'loading' && (
                <>
                  Providers are Loading...
                </>
              )}
            </h1>
          </div>
        </div>
      )}
      <div className="row m-0" style={{ minHeight: '250px' }}>
        {flightsProviders.map((item, index) => {
          const isSelected = selectedFlightsProviders.includes(item.agent.name)

          return (
            (agentsToShow.includes(item.agent.name) || filteredAgents.includes(item.agent.name) && showLoading && status == 'loading') && (
              <div
                className="col-6 col-md-4 px-5 mb-5 mt-5"
                key={index}
                onClick={() => {
                  if (!isSelected) {
                    handleSelectProvider(item.agent)
                  }
                }}
              >
                <div
                  className={`${isSelected ? 'border-dark-1 border-width-2' : 'border-light'} rounded-16`}
                >
                  {isSelected ? (
                    <div>
                      <div
                        className="text-center w-100 text-18"
                      >
                        <span className='fw-600'>{item.agent.name}</span>
                      </div>
                      <div className="text-12 text-center" style={{whiteSpace: 'nowrap'}}>
                        <span>${item.price}</span>
                      </div>
                    </div>
                  ) : (
                    <a
                      href={`${item.deepLink}`}
                      target="_blank"
                      // rel="noopener noreferrer"
                    >
                      <div
                        className="text-center w-100 text-18"
                      >
                        <span className='fw-600'>{item.agent.name}</span>
                      </div>
                      <div className="text-12 text-center" style={{whiteSpace: 'nowrap'}}>
                        <span>${item.price}</span>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )
          )
        })}
      </div>
    </div>
  )
}

export default FlightsProviders
