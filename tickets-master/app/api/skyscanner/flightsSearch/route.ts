export async function POST(request: Request) {
    const reqData = await request.json()
    const sessionToken = reqData.sessionToken
  
    const url = `https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/${sessionToken}`
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.SKYSCANNER_API_KEY ? process.env.SKYSCANNER_API_KEY : ''
        },
      })
  
      if (!response.ok) {
        throw new Error(`Error fetching search flights: ${response.statusText}`)
      }
  
      const data = await response.json()
      return Response.json(data, {
        status: 200,
      })
    } catch (error) {
      console.error('Failed to fetch search results:', error)
      return new Response('Failed to fetch search results', {
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