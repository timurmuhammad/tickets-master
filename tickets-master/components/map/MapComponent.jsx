"use client"

import { useEffect, useState, useContext } from "react"
import { useRecommendedUserLocation } from "@/hooks/useUserLocation"
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MapMarkers from "@/components/map/MapMarkers"
import geoJsonData from "@/data/geoJson"
import { getIndicativePrices } from "@/modules/skyscanner/utils/search"
import { AppContext } from '@/contexts/AppContext'
import { countries } from "@/data/skyscannerCountries"
import { cities } from "@/data/skyscannerCities"
import { getDomainConfig } from '@/utils/domainConfig'

const MapComponent = () => {
  const { domain, locale, currency, currencySymbol } = useContext(AppContext)
  const { skyscannerMarket } = getDomainConfig({ host: domain })

  const { recommendedFlightLocation } = useRecommendedUserLocation(); // Fetch location
  const [indicativePricesInit, setIndicativePricesInit] = useState([])
  const [indicativePrices, setIndicativePrices] = useState([])
  const [geoPricesJson, setGeoPricesJson] = useState([]);

  useEffect(() => {
    const getPrices = async () => {
      const fetchedDataInit = await getIndicativePrices({
        searchData: {
          fromPlace: recommendedFlightLocation,
          toPlace: 'anywhere',
          dates: [{ date: null, dateType: 'anytime' }]
        },
        locale,
        currency,
        skyscannerMarket,
        type: 'places',
        groupBy: 'route'
      })
      setIndicativePrices(fetchedDataInit)
      setIndicativePricesInit(fetchedDataInit)
    };
    getPrices();
  }, [recommendedFlightLocation, locale])

  useEffect(() => {
    if (indicativePrices?.length > 0) {
      const newGeoJsonData = geoJsonData.features.map(feature => {
        const country = countries.find(countryItem => countryItem.isoCode == feature.properties.ISO_A2.toLowerCase())
        const price = indicativePrices?.find(price => price.destinationPlace.entityId == country?.entityId)
        return {
          ...feature,
          properties: {
            ...feature.properties,
            price: price || null
          }
        };
      });
      setGeoPricesJson(newGeoJsonData);
    }
  }, [indicativePrices]);
  
  // {
  //   color: '#222',
  //   weight: 3,
  //   fillColor: fillColor,
  //   fillOpacity: fillOpacity
  // }

  const onEachFeature = (feature, layer) => {
    const style = {
      fillColor: 'transparent',
      color: '#f5f5f5',
      fillOpacity: 0.7,
      weight: 1,
    }
    if (feature.properties.price?.isCheapest) {
      style.color = 'green'
      style.weight = 2
    } else if (feature.properties.price?.isBelowAverage) {
      style.color = '#0A3161'
      style.weight = 1
    }
    layer.setStyle(style)
  };

  return (
    <div  className="position-relative">
      <div className="position-absolute" style={{ zIndex: 1000 }}>
        {/* <h1 className="text-2xl font-bold">Indicative Prices Worldwide</h1> */}
      </div>
      <MapContainer zoom={2} center={[20, 100]} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoPricesJson.length > 0 && (
          <GeoJSON
            data={geoPricesJson}
            onEachFeature={onEachFeature}
          />
        )}
        <MapMarkers
          locale={locale}
          currency={currency}
          currencySymbol={currencySymbol}
          skyscannerMarket={skyscannerMarket}
          countries={countries}
          cities={cities}
          recommendedFlightLocation={recommendedFlightLocation}
          indicativePrices={indicativePrices}
          indicativePricesInit={indicativePricesInit}
          setIndicativePrices={setIndicativePrices}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;