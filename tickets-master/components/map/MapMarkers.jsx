"use client"

// import { Icon } from 'leaflet'
import { useState, useEffect } from "react"
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster'
import { getIndicativePrices } from "@/modules/skyscanner/utils/search"
import "/node_modules/flag-icons/css/flag-icons.min.css"
import { defaultTravelCitiesList, topTravelCitiesLists } from "@/data/topTravelCitiesLists"

const MapMarkers = ({ locale, currency, currencySymbol, skyscannerMarket, indicativePrices, setIndicativePrices, indicativePricesInit, recommendedFlightLocation, countries, cities }) => {

  const [countryIndicativePrices, setCountryIndicativePrices] = useState({
    country: null,
    prices: {
      recommended: [],
      other: []
    }
  })
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    // Get user location
    if (recommendedFlightLocation) {
      const city = cities.find(cityItem => cityItem.entityId == recommendedFlightLocation.entityId)
      if (city) {
        setUserLocation(city)
      }
    }
  }, [recommendedFlightLocation]);

  function fetchCountryIndicativePrices(price) {
    const getPrices = async () => {
      const fetchedDataInit = await getIndicativePrices({
        searchData: {
          fromPlace: recommendedFlightLocation,
          toPlace: price.destinationPlace,
          dates: [{ date: null, dateType: 'anytime' }]
        },
        locale,
        currency,
        skyscannerMarket,
        type: 'places',
        groupBy: 'route'
      });
  
      // Group airports by city and find the cheapest price per city
      const groupedPrices = fetchedDataInit.reduce((acc, place) => {
        if (place.destinationPlace.type === "PLACE_TYPE_AIRPORT") {
          const { destinationPlace, price } = place;
          if (!acc[destinationPlace.parentId] || price < acc[destinationPlace.parentId].price) {
            const city = cities.find(cityItem => cityItem.entityId == destinationPlace.parentId)
            acc[destinationPlace.parentId] = {
              ...city,
              price,
              isCheapest: place.isCheapest,
              isBelowAverage: place.isBelowAverage
            };
          }
        } else if (place.destinationPlace.type === "PLACE_TYPE_CITY") {
          const { destinationPlace, price } = place;
          if (!acc[destinationPlace.entityId] || price < acc[destinationPlace.entityId].price) {
            const city = cities.find(cityItem => cityItem.entityId == destinationPlace.entityId)
            acc[destinationPlace.entityId] = {
              ...city,
              price,
              isCheapest: place.isCheapest,
              isBelowAverage: place.isBelowAverage
            };
          }
        }
        return acc;
      }, {});

      // cities list
      let cityGroups = [];
      // if (price.destinationPlace && price.destinationPlace.entityId === '29475437' /* USA */) {
      //   cityGroups = topTravelCitiesLists.find(item => item.listEntityId === '29475437')?.cities || [];
      // } else {
        cityGroups = topTravelCitiesLists.find(item => item.listEntityId === price.destinationPlace.entityId)?.cities || [];
      // }
    
      // Use default city list if cityGroups is empty
      if (!cityGroups.length) {
        cityGroups = defaultTravelCitiesList.cities || [];
      }
    
      const citiesList = cityGroups.reduce((acc, group) => {
        group.cities.forEach(city => acc.push({ ...city, weight: group.weight }));
        return acc;
      }, []);

      // Update the recommended and other prices based on citiesList
      const recommendedPrices = [];
      const otherPrices = [];

      Object.values(groupedPrices).forEach(item => {
        if (citiesList.some(city => city.entityId === item.entityId) || item.isCheapest) {
          item.type = 'primary'
          recommendedPrices.push(item);
        } else {
          item.type = 'secondary'
          otherPrices.push(item);
        }
      });

      setCountryIndicativePrices({ 
        country: countries.find(countryItem => price.destinationPlace.entityId == countryItem.entityId), 
        prices: {
          recommended: recommendedPrices,
          other: otherPrices
        } 
      });

      setIndicativePrices(indicativePricesInit.filter(priceItem => priceItem.destinationPlace.entityId !== price.destinationPlace.entityId))
    };
    getPrices();
  }

  const createCustomIcon = ({ type = null, name, isoCode = null, price, currencySymbol, isCheapest, isBelowAverage } ) => {
    return L.divIcon({
      html: type =='secondary' ?
      `<div class="marker ${isCheapest ? 'cheapest bg-green-3 px-8 py-5 rounded-8' : isBelowAverage ? 'bg-blue-1 text-white px-8 py-5 rounded-8' : 'bg-dark-2 text-white px-5 py-3 rounded-5 '} text-center shadow-new" style="height: 30px; white-space: nowrap; width: fit-content; opacity: 0.9; ${type == 'secondary' ? 'transform: scale(0.9)' : ''}">
        <div class="d-flex items-center ${isCheapest ? 'text-13' : isBelowAverage ? 'text-12' : 'text-11'}">
          ${isoCode ? `<span class="d-block fi fi-${isoCode} mr-5" style="opacity: .7; width:20px; height: 20px; "></span>` : ''}
          ${name}
          <span class="fw-600 ml-5 ${isCheapest ? 'text-14' : isBelowAverage ? 'text-13' : 'text-12'}">${currencySymbol}${price}</span>
        </div>
      </div>`
      :
      `<div class="marker ${isCheapest ? 'cheapest bg-green-3' : isBelowAverage ? 'bg-blue-1 text-white' : 'bg-dark-2 text-white'} text-center shadow-new px-8 py-5 rounded-8" style="white-space: nowrap; width: fit-content; opacity: 0.9; ${type == 'primary' ? 'transform: scale(1)' : type == 'secondary' ? 'opacity: 0.8; transform: scale(0.9)' : ''}">
        <div class="fw-700 ${isCheapest ? 'text-14' : isBelowAverage ? 'text-13' : 'text-12'}">${currencySymbol}${price}</div>
        <div class="d-flex items-center ${isCheapest ? 'text-12' : isBelowAverage ? 'text-11' : 'text-10'}">
          ${isoCode ? `<span class="d-block fi fi-${isoCode} mr-5" style="opacity: .7; width:20px; height: 20px; "></span>` : ''}
          ${name}
        </div>
      </div>`,
      iconSize: [100, 50], // Adjust based on content
      iconAnchor: [75, 25], // Adjust to position the icon correctly
      className: '' // Remove default class to avoid extra styling
    });
  };

  const cityPrice = ({ price, currencySymbol, index, type }) => {
    const position = [price?.coordinates?.latitude, price?.coordinates?.longitude]
    const customIcon = createCustomIcon({ type: type, name: price?.name, price: price.price, currencySymbol, isoCode: countryIndicativePrices.country?.isoCode, isCheapest: price.isCheapest, isBelowAverage: price.isBelowAverage })
    
    if (price?.coordinates?.latitude && price?.coordinates?.longitude) {
      return (
        <Marker
          key={index}
          position={position}
          icon={customIcon}
          eventHandlers={{
            mouseover: (e) => {
              e.target.getElement().classList.add('city-hover')
              e.target.getElement().style.zIndex = 1000; // Add z-index on hover
              console.log('on', e.target.getElement())
            },
            mouseout: (e) => {
              e.target.getElement().classList.remove('city-hover')
              e.target.getElement().style.zIndex = ''; // Reset z-index on mouse out
              console.log('out', e.target.getElement())
            }
          }}
        />
      )
    }
  }
  return (
    <>
    <MarkerClusterGroup
      showCoverageOnHover={true}
      spiderfyOnMaxZoom={true}
      removeOutsideVisibleBounds={true}
      animate={true}
      chunkedLoading
      // iconCreateFunction={(cluster) => {
      //   const childCount = cluster.getChildCount()
      //   let c = ' marker-cluster-'
      //   if (childCount < 10) {
      //     c += 'small'
      //   } else if (childCount < 100) {
      //     c += 'medium'
      //   } else {
      //     c += 'large'
      //   }
      //   return new Icon({
      //     iconUrl: `/img/about/icons/s.jpg?height=41&width=41`,
      //     iconSize: [40, 40],
      //     iconAnchor: [20, 20],
      //     className: `marker-cluster${c}`
      //   })
      // }}
    >
      {indicativePrices?.map((price, index) => {
        const country = countries.find(countryItem => price.destinationPlace.entityId == countryItem.entityId);
        const position = [country?.coordinates.latitude, country?.coordinates.longitude]
        const customIcon = createCustomIcon({ type: 'country', name: country?.name, price: price.price, currencySymbol, isCheapest: price.isCheapest, isBelowAverage: price.isBelowAverage })
        
        if (country) {
          return (
            <Marker
              key={`country`+index}
              position={position}
              icon={customIcon}
              eventHandlers={{
                click: (e) => {
                  fetchCountryIndicativePrices(price)
                },
              }}
            />
          )
        }
      })}
      
      {countryIndicativePrices.prices?.other?.map((price, index) => cityPrice({ price, currencySymbol, index: `other`+index, type: price.type }))}
    </MarkerClusterGroup>
    {countryIndicativePrices.prices?.recommended?.map((price, index) => cityPrice({ price, currencySymbol, index: `recommended`+index, type: price.type }))}

    {userLocation && (
      <Marker
        position={[userLocation.coordinates.latitude, userLocation.coordinates.longitude]}
        icon={L.divIcon({
          html: `<div class="bg-blue-3 text-dark text-center p-2 shadow-new px-8 py-5 rounded-8" style="white-space: nowrap; width: fit-content; opacity: 0.8; transform: scale(0.8);">
            <div class="fw-700 text-12">${userLocation.name}</div>
            <div class="text-11">You are here</div>
          </div>`,
          iconSize: [100, 50], // Adjust based on content
          iconAnchor: [75, 25], // Adjust to position the icon correctly
          className: '' // Remove default class to avoid extra styling
        })}
      />
    )}

    </>
  );
};

export default MapMarkers;