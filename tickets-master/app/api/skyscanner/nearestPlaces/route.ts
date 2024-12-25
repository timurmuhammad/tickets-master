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

  const latitude = reqData.lat
  const longitude = reqData.lon

  const url = 'https://partners.api.skyscanner.net/apiservices/v3/geo/hierarchy/flights/nearest'
  const body = {
    locator: {
      coordinates: {
        latitude,
        longitude
      }
    },
    locale: reqLocale,
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

    if (!response.ok) {
      throw new Error(`Error fetching nearest places: ${response.statusText}`)
    }

    const data = await response.json()
    
    return Response.json(data, {
      status: 200,
    })
  } catch (error) {
    console.error('Failed to fetch nearest places:', error)
    return new Response('Failed to fetch places', {
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