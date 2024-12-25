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
  
  const type = reqData.type
  const fromPlace = reqData.fromPlace
  const toPlace = reqData.toPlace
  const dates = reqData.dates

  const url = 'https://partners.api.skyscanner.net/apiservices/v3/flights/indicative/search'
  const body = {
    query: {
      market,
      locale: reqLocale,
      currency,
      queryLegs: [],
      dateTimeGroupingType: 'DATE_TIME_GROUPING_TYPE_UNSPECIFIED',
    }
  } as any

  //outbound
  body.query.queryLegs.push({
    originPlace: {},
    destinationPlace: {},
  })

  //from place
  if (fromPlace == 'anywhere') {
    body.query.queryLegs[0].originPlace.anywhere = true
  } else {
    if (fromPlace.entityId) {
      body.query.queryLegs[0].originPlace.queryPlace = { entityId: fromPlace.entityId }
    } else {
      body.query.queryLegs[0].originPlace.queryPlace = { iata: fromPlace.iataCode }
    }
  }

  //to place
  if (toPlace == 'anywhere') {
    body.query.queryLegs[0].destinationPlace.anywhere = true
  } else {
    if (toPlace.entityId) {
      body.query.queryLegs[0].destinationPlace.queryPlace = { entityId: toPlace.entityId }
    } else {
      body.query.queryLegs[0].destinationPlace.queryPlace = { iata: toPlace.iataCode }
    }
  }

  const toDate = new DateObject(dates[0].date)
  const toDateType = dates[0].dateType
  if (toDateType == 'anytime') {
    body.query.queryLegs[0].anytime = true
  } else if (toDateType == 'day') {
    body.query.queryLegs[0].fixedDate = {
      year: toDate.year,
      month: toDate.month.number,
      day: toDate.day
    }
  } else {
    let toDateStart = toDate
    let toDateEnd = toDate
    if (Array.isArray(dates[0].date)) {
      toDateStart = new DateObject(dates[0].date[0])
      toDateEnd = new DateObject(dates[0].date[1])
      body.query.dateTimeGroupingType = 'DATE_TIME_GROUPING_TYPE_BY_MONTH'
    } else if (type != 'places') {
      body.query.dateTimeGroupingType = 'DATE_TIME_GROUPING_TYPE_BY_DATE'
    }
    body.query.queryLegs[0].dateRange = {
      startDate: {
        year: toDateStart.year,
        month: toDateStart.month.number,
      },
      endDate: {
        year: toDateEnd.year,
        month: toDateEnd.month.number,
      },
    }
  }

  //inbound
  if (dates[1]) {
    body.query.queryLegs.push({
      originPlace: {},
      destinationPlace: {},
    })
    
    //toPlace
    if (toPlace == 'anywhere') {
      body.query.queryLegs[1].originPlace.anywhere = true
    } else {
      if (toPlace.entityId) {
        body.query.queryLegs[1].originPlace.queryPlace = { entityId: toPlace.entityId }
      } else {
        body.query.queryLegs[1].originPlace.queryPlace = { iata: toPlace.iataCode }
      }
    }

    //fromPlace
    if (toPlace == 'anywhere') {
      body.query.queryLegs[1].destinationPlace.anywhere = true
    } else {
      if (fromPlace.entityId) {
        body.query.queryLegs[1].destinationPlace.queryPlace = { entityId: fromPlace.entityId }
      } else {
        body.query.queryLegs[1].destinationPlace.queryPlace = { iata: fromPlace.iataCode }
      }
    }

    const backDate = new DateObject(dates[1].date)
    const backDateType = dates[1].dateType
    if (backDateType == 'anytime') {
      body.query.queryLegs[1].anytime = true
    } else if (backDateType == 'day') {
      body.query.queryLegs[1].fixedDate = {
        year: backDate.year,
        month: backDate.month.number,
        day: backDate.day
      }
    } else {
      let backDateStart = backDate
      let backDateEnd = backDate
      if (Array.isArray(dates[1].date)) {
        backDateStart = new DateObject(dates[1].date[0])
        backDateEnd = new DateObject(dates[1].date[1])
        body.query.dateTimeGroupingType = 'DATE_TIME_GROUPING_TYPE_BY_MONTH'
      } else if (type != 'places') {
        body.query.dateTimeGroupingType = 'DATE_TIME_GROUPING_TYPE_BY_DATE'
      }
      body.query.queryLegs[1].dateRange = {
        startDate: {
          year: backDateStart.year,
          month: backDateStart.month.number,
        },
        endDate: {
          year: backDateEnd.year,
          month: backDateEnd.month.number,
        },
      }
    }
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
    //   throw new Error(`Error Getting Indicative Prices: ${response.statusText}`)
    // }

    const data = await response.json()
    console.log('data', data)
    console.log('body.query.queryLegs', body.query.queryLegs[0])
    return Response.json(data, {
      status: 200,
    })
  } catch (error) {
    console.error('Failed to Get Indicative Prices: ', error)
    return new Response('Failed to Get Indicative Prices', {
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