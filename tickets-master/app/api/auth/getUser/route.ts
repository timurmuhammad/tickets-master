import { getUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const reqData = await request.json()
    const email = reqData.email

    const user = await getUser(email)
    return Response.json(user, {
      status: 200,
    })
  } catch (error) {
    console.error('Error getting user:', error)
    return new Response('Failed to get user', {
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