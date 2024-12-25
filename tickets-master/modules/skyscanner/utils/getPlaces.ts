type PlaceData = {
  countryId: string;
  countryName: string;
  entityId: string;
  iataCode: string;
  name: string;
  parentId: string;
  type: string;
  airportInformation: any;
};

export default async function getPlaces({ searchTerm, locale, skyscannerMarket }) {
  try {
    const response = await fetch('/api/skyscanner/places', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm, locale, skyscannerMarket }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json()
    const places: PlaceData[] = data.places.map((place: PlaceData) => {
      if (place.airportInformation) {
        return {
          ...place.airportInformation,
          type: 'PLACE_TYPE_AIRPORT',
        };
      } else {
        return place
      }
    })
    const filteredPlaces: PlaceData[] = places.filter((place: PlaceData) => place.iataCode && (place.type == 'PLACE_TYPE_AIRPORT' || place.type == 'PLACE_TYPE_CITY'))

    const addedEntityIds = new Set<string>();
    const newPlaces: PlaceData[] = [];

    filteredPlaces.forEach((place) => {
      if (!addedEntityIds.has(place.entityId)) {
        newPlaces.push(place);
        addedEntityIds.add(place.entityId);
      }
    })

    return newPlaces
  } catch (error) {
    const places: PlaceData[] = []
    return places
  }
}

export async function getNearestPlaces({ locationData, locale }) {
  try {
    if (!locationData || !locationData.lat || !locationData.lon) {
      throw new Error('Location data is missing latitude and longitude.')
    }

    const flightResponse = await fetch('/api/skyscanner/nearestPlaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale, lat: locationData.lat, lon: locationData.lon }),
    })

    if (!flightResponse.ok) throw new Error('Failed to fetch nearest flight location')
    
    const flightData = await flightResponse.json()

    return Object.values(flightData?.places || {})
  } catch (error) {
    return []
  }
}