export async function POST(request: Request) {
  // Vercel-specific header for client IP
  const vercelIp = request.headers.get('x-vercel-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const forwarded = request.headers.get('x-forwarded-for')
  
  let ip = vercelIp || realIp || (forwarded ? forwarded.split(',')[0].trim() : '')

  if (!ip) {
    return Response.json({ error: 'Could not detect IP address' }, {
      status: 400,
    })
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }

    const data = await response.json()

    if (data.status !== 'success') {
      throw new Error(data.message || 'Unknown error occurred while fetching IP location data')
    }

    return Response.json(data, {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching location data:', error)
    return Response.json({ error: 'Failed to fetch location data' }, {
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
  