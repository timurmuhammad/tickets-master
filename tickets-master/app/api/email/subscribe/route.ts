export async function POST(request: Request) {
  const newsletterApiKey = process.env.NEWSLETTER_API_KEY ? process.env.NEWSLETTER_API_KEY : ''
  const newsletterEndPoint = process.env.NEWSLETTER_ENDPOINT ? process.env.NEWSLETTER_ENDPOINT : ''
  const newsletterTags = process.env.NEWSLETTER_TAGS ? JSON.parse(process.env.NEWSLETTER_TAGS) : []

  const reqData = await request.json()
  const email = reqData.email

  try {
    const body = {
      email: email,
      tags: newsletterTags
    }

    const response = await fetch(newsletterEndPoint, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + newsletterApiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (response.statusText != "OK" && response.statusText != "Created") {
      throw new Error('Failed to subscribe user')
    }

    const responseStatus = response.statusText == 'OK' ? 'Already Subscribed' : 'Successfully Subscribed'

    return Response.json(responseStatus, {
      status: 200,
    })
  } catch (error) {
    console.error('Error subscribing the user:', error)
    return new Response('Failed to subscribe the user', {
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