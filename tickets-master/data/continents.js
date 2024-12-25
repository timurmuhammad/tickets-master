export const weather = {
  winter: {
    celsius: 'winter_celsius',
    fahrenheit: 'winter_fahrenheit',
  },
  spring: {
    celsius: 'spring_celsius', 
    fahrenheit: 'spring_fahrenheit',
  },
  summer: {
    celsius: 'summer_celsius',
    fahrenheit: 'summer_fahrenheit',
  },
  autumn: {
    celsius: 'autumn_celsius',
    fahrenheit: 'autumn_fahrenheit',
  },
}
export const info = {
  timezone: {
    range: 'timezone_range',
    note: 'timezone_note',
  },
  tourists: {
    range: 'tourists_range',
    note: 'tourists_note',
  },
  demographics: {
    countries: 'demographics_countries',
    population: 'demographics_population',
  },
  heritage: {
    range: 'heritage_range',
    note: 'heritage_note',
  },
}

export const continentData = [

  //      North America
  {
    slug: 'north-america',
    cities: {
      iconic: {
        title: 'Iconic Metropolises',
        desc: 'Explore major cities with famous landmarks and rich cultural experiences',
        list: [
          {
            city: {
              name: 'New York',
              parentId: "29475437",
              iataCode: 'NYC',
            },
            country: {
              name: 'United States',
              entityId: "29475437",
              parentId: "205351567",
            }
          },
          {
            city: {
              name: 'Los Angeles',
              parentId: "29475437",
              iataCode: 'LAX',
            },
            country: {
              name: 'United States',
              entityId: "29475437",
              parentId: "205351567",
            }
          },
          // "Los Angeles, USA",
          // "Chicago, USA",
          // "Toronto, Canada",
          // "San Francisco, USA",
          // "Mexico City, Mexico",
          // "Montreal, Canada",
          // "Vancouver, Canada",
          // "Miami, USA",
          // "Washington, D.C., USA"
        ],
      },
      coastal: {
        title: 'Coastal Gems and Beach Retreats',
        desc: 'Plan a beach escape to cities with sunny vibes, entertainment, and charming coastal retreats',
        list: [
          {
            "city": {
              "name": "Miami",
              "parentId": "4140963",
              "iataCode": "MIA"
            },
            "country": {
              "name": "United States",
              "entityId": "4140964",
              "parentId": "6252001"
            }
          },
          {
            "city": {
              "name": "San Diego",
              "parentId": "5391811",
              "iataCode": "SAN"
            },
            "country": {
              "name": "United States",
              "entityId": "5391811",
              "parentId": "6252001"
            }
          },
          {
            "city": {
              "name": "Honolulu",
              "parentId": "5856195",
              "iataCode": "HNL"
            },
            "country": {
              "name": "United States",
              "entityId": "5856197",
              "parentId": "6252001"
            }
          },
          {
            "city": {
              "name": "Cancun",
              "parentId": "3531673",
              "iataCode": "CUN"
            },
            "country": {
              "name": "Mexico",
              "entityId": "3531674",
              "parentId": "23424900"
            }
          },
          {
            "city": {
              "name": "Charleston",
              "parentId": "4574324",
              "iataCode": "CHS"
            },
            "country": {
              "name": "United States",
              "entityId": "4574324",
              "parentId": "6252001"
            }
          },
          {
            "city": {
              "name": "Santa Monica",
              "parentId": "5393212",
              "iataCode": "SMO"
            },
            "country": {
              "name": "United States",
              "entityId": "5393212",
              "parentId": "6252001"
            }
          },
          {
            "city": {
              "name": "Tulum",
              "parentId": "3515040",
              "iataCode": "TUY"
            },
            "country": {
              "name": "Mexico",
              "entityId": "3515041",
              "parentId": "23424900"
            }
          },
          {
            "city": {
              "name": "Newport",
              "parentId": "5224151",
              "iataCode": "JFK"
            },
            "country": {
              "name": "United States",
              "entityId": "5224151",
              "parentId": "6252001"
            }
          },
          {
            "city": {
              "name": "Acapulco",
              "parentId": "3533462",
              "iataCode": "ACA"
            },
            "country": {
              "name": "Mexico",
              "entityId": "3533463",
              "parentId": "23424900"
            }
          },
          {
            "city": {
              "name": "Myrtle Beach",
              "parentId": "4588718",
              "iataCode": "MYR"
            },
            "country": {
              "name": "United States",
              "entityId": "4588718",
              "parentId": "6252001"
            }
          }
        ],

      },
      cultural: {
        title: 'Cultural Hubs and Heritage Cities',
        desc: 'Immerse yourself in history and culture in cities known for their traditions and artistic scenes',
        // list: ["New Orleans, USA", "Quebec City, Canada", "San Antonio, USA", "Philadelphia, USA", "Boston, USA", "Oaxaca, Mexico", "Savannah, USA", "Guadalajara, Mexico", "Puebla, Mexico", "Quebec City, Canada"],
      },
      nature: {
        title: 'Nature and Adventure Destinations',
        desc: 'Enjoy outdoor adventures in cities surrounded by stunning landscapes and natural wonders',
        // list: ["Vancouver, Canada", "Banff, Canada", "Denver, USA", "Anchorage, USA", "Asheville, USA", "Portland, USA", "Lake Tahoe, USA", "Calgary, Canada", "Boulder, USA", "Jackson Hole, USA"],
      },
      foodie: {
        title: 'Foodie Favorites and Culinary Delights',
        desc: 'Indulge in diverse flavors and gourmet experiences in cities known for their culinary delights',
        // list: ["Montreal, Canada", "New York City, USA", "Mexico City, Mexico", "Austin, USA", "Portland, USA", "Charleston, USA", "San Francisco, USA", "New Orleans, USA", "Vancouver, Canada", "Chicago, USA"],
      },
    },

    slideImg: ["/img/destinations/continents/2.png", "/img/destinations/continents/1.png", "/img/destinations/continents/3.png"],
    img: "/img/destinations/continents/north-america.jpg",
  },

  //      South America
  {
    slug: 'south-america',
    cities: {
      iconic: {
        title: 'Iconic Metropolises',
        desc: 'Explore vibrant cities with iconic landmarks for an unforgettable urban adventure',
        list: ["Rio de Janeiro, Brazil", "Buenos Aires, Argentina", "São Paulo, Brazil", "Lima, Peru", "Bogotá, Colombia", "Santiago, Chile", "Quito, Ecuador", "Caracas, Venezuela", "Montevideo, Uruguay", "Asunción, Paraguay"],
      },
      coastal: {
        title: 'Coastal Gems and Beach Retreats',
        desc: 'Plan your perfect beach escape in cities with sun-soaked vibes and charming coastal retreats',
        list: ["Rio de Janeiro, Brazil", "Cartagena, Colombia", "Salvador, Brazil", "Máncora, Peru", "Punta del Este, Uruguay", "Angra dos Reis, Brazil", "Santa Marta, Colombia", "Guayaquil, Ecuador", "Florianópolis, Brazil", "Vina del Mar, Chile"],
      },
      cultural: {
        title: 'Cultural Hubs and Heritage Cities',
        desc: 'Immerse in history and culture in cities rich in heritage and artistic expression',
        list: ["Cusco, Peru", "Salta, Argentina", "Córdoba, Argentina", "Ouro Preto, Brazil", "Sucre, Bolivia", "Medellín, Colombia", "Valparaíso, Chile", "Arequipa, Peru", "Porto Alegre, Brazil", "Cuenca, Ecuador"],
      },
      nature: {
        title: 'Nature and Adventure Destinations',
        desc: 'Embark on outdoor adventures in cities surrounded by breathtaking landscapes',
        list: ["Machu Picchu, Peru", "Torres del Paine, Chile", "Iguazu Falls, Argentina", "Amazon Rainforest (Various Countries)", "Galápagos Islands, Ecuador", "Patagonia (Various Countries)", "Uyuni Salt Flats, Bolivia", "Cotopaxi, Ecuador", "Bariloche, Argentina", "Chapada Diamantina, Brazil"],
      },
      foodie: {
        title: 'Foodie Favorites and Culinary Delights',
        desc: 'Indulge in diverse flavors as you explore cities known for culinary delights',
        list: ["Lima, Peru", "Buenos Aires, Argentina", "São Paulo, Brazil", "Medellín, Colombia", "Quito, Ecuador", "Santiago, Chile", "La Paz, Bolivia", "Córdoba, Argentina", "Bogotá, Colombia", "Asunción, Paraguay"],
      },
    },

    slideImg: ["/img/destinations/continents/2.png", "/img/destinations/continents/1.png", "/img/destinations/continents/3.png"],
    img: "/img/destinations/continents/south-america.jpg",
  },

  //      EUROPE
  {
    slug: 'europe',
    cities: {
      iconic: {
        title: 'Iconic Metropolises',
        desc: 'Explore vibrant cities with iconic landmarks for an unforgettable urban adventure.',
        list: ["Paris, France", "London, United Kingdom", "Rome, Italy", "Berlin, Germany", "Barcelona, Spain", "Amsterdam, Netherlands", "Prague, Czech Republic", "Vienna, Austria", "Athens, Greece", "Dublin, Ireland"],
      },
      coastal: {
        title: 'Coastal Gems and Beach Retreats',
        desc: 'Plan your perfect beach escape in cities with sun-soaked vibes and charming coastal retreats',
        list: ["Barcelona, Spain", "Amalfi Coast, Italy", "Nice, France", "Dubrovnik, Croatia", "Algarve, Portugal", "Cinque Terre, Italy", "Santorini, Greece", "Mykonos, Greece", "St. Tropez, France", "Brighton, United Kingdom"],
      },
      cultural: {
        title: 'Cultural Hubs and Heritage Cities',
        desc: 'Immerse in history and culture in cities rich in heritage and artistic expression',
        list: ["Florence, Italy", "Vienna, Austria", "Prague, Czech Republic", "Edinburgh, United Kingdom", "Budapest, Hungary", "Krakow, Poland", "Seville, Spain", "Salzburg, Austria", "Granada, Spain", "Valletta, Malta"],
      },
      nature: {
        title: 'Nature and Adventure Destinations',
        desc: 'Embark on outdoor adventures in cities surrounded by breathtaking landscapes',
        list: ["Interlaken, Switzerland", "Innsbruck, Austria", "Bergen, Norway", "Zakopane, Poland", "Lake Bled, Slovenia", "Scottish Highlands, United Kingdom", "Plitvice Lakes National Park, Croatia", "The Dolomites, Italy", "Lake District, United Kingdom", "Swiss Alps, Switzerland"]
      },
      foodie: {
        title: 'Foodie Favorites and Culinary Delights',
        desc: 'Indulge in diverse flavors as you explore cities known for culinary delights',
        list: ["Paris, France", "Bologna, Italy", "Lyon, France", "Barcelona, Spain", "Brussels, Belgium", "Athens, Greece", "Lisbon, Portugal", "Copenhagen, Denmark", "Turin, Italy", "Madrid, Spain"],
      },
    },

    slideImg: ["/img/destinations/continents/3.png"],
    img: "/img/destinations/continents/europe.jpg",
  },

  //      Middle East
  {
    slug: 'middle-east',
    cities: {
      iconic: {
        title: 'Iconic Metropolises',
        desc: 'Explore vibrant cities with iconic landmarks for an unforgettable urban adventure',
        list: ["Dubai, UAE", "Istanbul, Turkey", "Tel Aviv, Israel", "Doha, Qatar", "Abu Dhabi, UAE", "Riyadh, Saudi Arabia", "Jerusalem, Israel", "Amman, Jordan", "Muscat, Oman", "Beirut, Lebanon"],
      },
      coastal: {
        title: 'Coastal Gems and Beach Retreats',
        desc: 'Plan your perfect coastal escape in cities with sun-soaked vibes and charming retreats',
        list: ["Dubai, UAE", "Tel Aviv, Israel", "Muscat, Oman", "Beirut, Lebanon", "Jeddah, Saudi Arabia", "Aqaba, Jordan", "Manama, Bahrain", "Larnaca, Cyprus", "Salalah, Oman", "Limassol, Cyprus"],
      },
      cultural: {
        title: 'Cultural Hubs and Heritage Cities',
        desc: 'Immerse in history and culture in cities rich in heritage and artistic expression',
        list: ["Istanbul, Turkey", "Tel Aviv, Israel", "Jerusalem, Israel", "Amman, Jordan", "Muscat, Oman", "Beirut, Lebanon", "Cairo, Egypt", "Shiraz, Iran", "Isfahan, Iran", "Petra, Jordan"],
      },
      nature: {
        title: 'Nature and Adventure Destinations',
        desc: 'Embark on outdoor adventures in cities surrounded by breathtaking landscapes',
        list: ["Muscat, Oman", "Petra, Jordan", "Shiraz, Iran", "Isfahan, Iran", "Tabriz, Iran", "Esfahan, Iran", "Salalah, Oman", "Mount Ararat, Turkey", "Wadi Rum, Jordan", "Dead Sea, Israel/Jordan"],
      },
      foodie: {
        title: 'Foodie Favorites and Culinary Delights',
        desc: 'Indulge in diverse flavors as you explore cities known for culinary delights',
        list: ["Tel Aviv, Israel", "Jerusalem, Israel", "Beirut, Lebanon", "Istanbul, Turkey", "Amman, Jordan", "Muscat, Oman", "Doha, Qatar", "Jeddah, Saudi Arabia", "Manama, Bahrain", "Riyadh, Saudi Arabia"],
      },
    },

    slideImg: ["/img/destinations/continents/4.png"],
    img: "/img/destinations/continents/middle-east.jpg",
  },

  //      AFRICA
  {
    slug: 'africa',
    cities: {
      iconic: {
        title: 'Iconic Metropolises',
        desc: 'Explore vibrant cities with iconic landmarks for an unforgettable urban adventure',
        list: ["Cairo, Egypt", "Cape Town, South Africa", "Marrakech, Morocco", "Nairobi, Kenya", "Accra, Ghana", "Johannesburg, South Africa", "Lagos, Nigeria", "Addis Ababa, Ethiopia", "Casablanca, Morocco", "Dakar, Senegal"],
      },
      coastal: {
        title: 'Coastal Gems and Beach Retreats',
        desc: 'Plan your perfect beach escape in cities with sun-soaked vibes and charming coastal retreats',
        list: ["Cape Town, South Africa", "Mombasa, Kenya", "Casablanca, Morocco", "Dakar, Senegal", "Durban, South Africa", "Alexandria, Egypt", "Maputo, Mozambique", "Essaouira, Morocco", "Mauritius", "Seychelles"],
      },
      cultural: {
        title: 'Cultural Hubs and Heritage Cities',
        desc: 'Immerse in history and culture in cities rich in heritage and artistic expression',
        list: ["Marrakech, Morocco", "Cairo, Egypt", "Timbuktu, Mali", "Lalibela, Ethiopia", "Zanzibar City, Tanzania", "Fez, Morocco", "Stone Town, Tanzania", "Saint-Louis, Senegal", "Goree Island, Senegal", "Cape Town, South Africa"],
      },
      nature: {
        title: 'Nature and Adventure Destinations',
        desc: 'Embark on outdoor adventures in cities surrounded by breathtaking landscapes',
        list: ["Cape Town, South Africa", "Nairobi, Kenya", "Victoria Falls, Zimbabwe/Zambia", "Maun, Botswana", "Kilimanjaro, Tanzania", "Serengeti National Park, Tanzania", "Drakensberg Mountains, South Africa", "Akagera National Park, Rwanda", "Simien Mountains, Ethiopia", "Table Mountain, South Africa"],
      },
      foodie: {
        title: 'Foodie Favorites and Culinary Delights',
        desc: 'Indulge in diverse flavors as you explore cities known for culinary delights',
        list: ["Marrakech, Morocco", "Cairo, Egypt", "Addis Ababa, Ethiopia", "Cape Town, South Africa", "Accra, Ghana", "Lagos, Nigeria", "Nairobi, Kenya", "Dar es Salaam, Tanzania", "Cairo, Egypt", "Dakar, Senegal"],
      },
    },

    slideImg: ["/img/destinations/continents/continents/africa1.jpg"],
    img: "/img/destinations/continents/africa.jpg",
  },

  //      ASIA
  {
    slug: 'asia',
    cities: {
      iconic: {
        title: 'Iconic Metropolises',
        desc: 'Explore vibrant cities with iconic landmarks for an unforgettable urban adventure',
        list: ["Tokyo, Japan", "Beijing, China", "Seoul, South Korea", "Shanghai, China", "Bangkok, Thailand", "Mumbai, India", "Singapore", "Hong Kong", "Dubai, UAE", "Osaka, Japan"],
      },
      coastal: {
        title: 'Coastal Gems and Beach Retreats',
        desc: 'Plan your perfect beach escape in cities with sun-soaked vibes and charming coastal retreats',
        list: ["Phuket, Thailand", "Bali, Indonesia", "Goa, India", "Busan, South Korea", "Maldives", "Sanya, China", "Colombo, Sri Lanka", "Langkawi, Malaysia", "Hua Hin, Thailand", "Okinawa, Japan"],
      },
      cultural: {
        title: 'Cultural Hubs and Heritage Cities',
        desc: 'Immerse in history and culture in cities rich in heritage and artistic expression',
        list: ["Kyoto, Japan", "Varanasi, India", "Jerusalem, Israel", "Xi'an, China", "Siem Reap, Cambodia", "Kathmandu, Nepal", "Istanbul, Turkey", "Luang Prabang, Laos", "Jaipur, India", "Samarkand, Uzbekistan"],
      },
      nature: {
        title: 'Nature and Adventure Destinations',
        desc: 'Embark on outdoor adventures in cities surrounded by breathtaking landscapes',
        list: ["Hokkaido, Japan", "Nepal Himalayas", "Borneo, Malaysia", "Yunnan, China", "Chiang Mai, Thailand", "Sapa, Vietnam", "Jeju Island, South Korea", "Rishikesh, India", "Almaty, Kazakhstan", "Naltar Valley, Pakistan"],
      },
      foodie: {
        title: 'Foodie Favorites and Culinary Delights',
        desc: 'Indulge in diverse flavors as you explore cities known for culinary delights',
        list: ["Osaka, Japan", "Bangkok, Thailand", "Seoul, South Korea", "Taipei, Taiwan", "Ho Chi Minh City, Vietnam", "Singapore", "Shanghai, China", "Mumbai, India", "Istanbul, Turkey", "Penang, Malaysia"],
      },
    },

    slideImg: ["/img/destinations/continents/6.png"],
    img: "/img/destinations/continents/asia.jpg",
  },

  //      Australia and Oceania
  {
    slug: 'australia-and-oceania',
    cities: {
      iconic: {
        title: 'Iconic Metropolises',
        desc: 'Discover vibrant cities with iconic landmarks for an unforgettable urban adventure',
        list: ["Sydney, Australia", "Auckland, New Zealand", "Melbourne, Australia", "Brisbane, Australia", "Wellington, New Zealand", "Honolulu, USA", "Fiji, Fiji", "Queenstown, New Zealand", "Rarotonga, Cook Islands", "Suva, Fiji"],
      },
      coastal: {
        title: 'Coastal Gems and Beach Retreats',
        desc: 'Plan your perfect beach escape in cities with sun-soaked vibes and charming coastal retreats',
        list: ["Sydney, Australia", "Gold Coast, Australia", "Auckland, New Zealand", "Brisbane, Australia", "Honolulu, USA", "Fiji, Fiji", "Queenstown, New Zealand", "Port Vila, Vanuatu", "Nouméa, New Caledonia", "Apia, Samoa"],
      },
      cultural: {
        title: 'Cultural Hubs and Heritage Cities',
        desc: 'Immerse in history and culture in cities rich in heritage and artistic expression',
        list: ["Auckland, New Zealand", "Wellington, New Zealand", "Apia, Samoa", "Suva, Fiji", "Papeete, French Polynesia", "Nuku'alofa, Tonga", "Honiara, Solomon Islands", "Port Moresby, Papua New Guinea", "Hobart, Australia", "Rotorua, New Zealand"],
      },
      nature: {
        title: 'Nature and Adventure Destinations',
        desc: 'Embark on outdoor adventures in cities surrounded by breathtaking landscapes',
        list: ["Queenstown, New Zealand", "Cairns, Australia", "Rotorua, New Zealand", "Nadi, Fiji", "Bora Bora, French Polynesia", "Tahiti, French Polynesia", "Adelaide, Australia", "Dunedin, New Zealand", "Christchurch, New Zealand", "Papeete, French Polynesia"],
      },
      foodie: {
        title: 'Foodie Favorites and Culinary Delights',
        desc: 'Indulge in diverse flavors as you explore cities known for culinary delights',
        list: ["Melbourne, Australia", "Auckland, New Zealand", "Sydney, Australia", "Wellington, New Zealand", "Brisbane, Australia", "Queenstown, New Zealand", "Suva, Fiji", "Napier, New Zealand", "Hobart, Australia", "Adelaide, Australia"],
      },
    },

    slideImg: ["/img/destinations/continents/sydney.jpg"],
    img: "/img/destinations/continents/australia-and-oceania.jpg",
  }
];
