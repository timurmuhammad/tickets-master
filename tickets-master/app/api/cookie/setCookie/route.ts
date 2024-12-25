import { cookies } from 'next/headers'

export async function POST(request: Request)  {
  const reqData = await request.json()
  const { name, value, hours, expires } = reqData

  const options = {
    expires,
    maxAge: hours * 60 * 60 * 1000
  }

  try {
    cookies().set(name, value, options)
  
    return Response.json({ success: true, message: 'Cookie set successfully.' }, {
      status: 200,
    })
  } catch (error) {
    console.error('Error setting the cookie:', error)
    return new Response('Failed to set the cookie', {
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