import { DateObject } from "react-multi-date-picker"
import { locales } from "@/data/locales"
import { Locale } from "@/types/locale"
import { defaultLocale } from "@/navigation"

export async function POST(request: Request) {
  const reqData = await request.json()

  const locale = reqData.locale ?? defaultLocale
  const localeObject: Locale = locales.find((lang) => lang.shortName === locale) 
    ?? locales.find((lang) => lang.shortName === defaultLocale) 
    ?? { shortName: '', longName: '' };
  const reqLocale = localeObject.skyscannerLocale ?? localeObject.longName
  const market = reqData.skyscannerMarket ?? process.env.NEXT_PUBLIC_APP_MARKET
  const currency = reqData.currency
  
  const fromPlace = reqData.fromPlace
  const toPlace = reqData.toPlace
  const dates = reqData.dates
  const tripType = reqData.tripType
  const adults = reqData.passengerCounts.Adults
  const children = reqData.passengerCounts.Children
  const infants = reqData.passengerCounts.Infants

  let classType = 'CABIN_CLASS_ECONOMY'
  if (reqData.classType == "premium_economy") {
    classType = "CABIN_CLASS_PREMIUM_ECONOMY"
  } else if (reqData.classType == "business_class") {
    classType = "CABIN_CLASS_BUSINESS"
  } else if (reqData.classType == "first_class") {
    classType = "CABIN_CLASS_FIRST"
  }

  const url = 'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create'
  const body = {
    query: {
        market,
        locale: reqLocale,
        currency,
        queryLegs: [],
        adults,
        childrenAges: [],
        cabinClass: classType,
    }
  } as any;

  if (children > 0) {
      for (let i = 0; i < children; i++) {
          body.query.childrenAges.push(12);
      }
  }

  if (infants > 0) {
      for (let i = 0; i < children; i++) {
          body.query.childrenAges.push(1);
      }
  }

  const toTime = new DateObject(dates[0]);
  body.query.queryLegs.push({
    originPlaceId: {iata: fromPlace.iataCode},
    destinationPlaceId: {iata: toPlace.iataCode},
    date: {
      year: toTime.year,
      month: toTime.month.number,
      day: toTime.day,
    },
  })

  if (tripType == "round_trip" && dates[1]) {
    const backTime = new DateObject(dates[1]);
    body.query.queryLegs.push({
      originPlaceId: {iata: toPlace.iataCode},
      destinationPlaceId: {iata: fromPlace.iataCode},
      date: {
        year: backTime.year,
        month: backTime.month.number,
        day: backTime.day,
      },
    });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SKYSCANNER_API_KEY ? process.env.SKYSCANNER_API_KEY : ''
      },
      body: JSON.stringify(body),
    })

    // if (!response.ok) {
    //   throw new Error(`Error Creating Search : ${response.statusText}`)
    // }

    const data = await response.json()
    console.log(data)
    return Response.json(data, {
      status: 200,
    })
  } catch (error) {
    console.error('Failed to Create Search:', error)
    return new Response('Failed to Create Search', {
      status: 500,
    })
  }
}

export async function GET() {
  return new Response('Method GET Not Allowed', {
    status: 405,
    headers: { 'Allow': `${['POST']}` },
  })
}