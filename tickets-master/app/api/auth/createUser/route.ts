import { createUser } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'
import CryptoJS from 'crypto-js'

export async function POST(request: Request) {
  try {
    const reqData = await request.json()
    const email = reqData.email
    const password = reqData.password
    const role = reqData.role

    // Generate salt and hash password
    const salt = uuidv4()
    const saltedPassword = password + salt
    const hashedPassword = CryptoJS.SHA256(saltedPassword).toString()

    const user = {
      id: uuidv4(),
      username: email.split('@')[0],
      email,
      password: hashedPassword,
      salt,
      role,
    }

    await createUser(user)

    return Response.json({
      status: 200,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return new Response('Failed to create user', {status: 500,
    })
  }
}

export async function GET() {
  return new Response('Method GET Not Allowed', {
    status: 405,
    headers: { 'Allow': `${['POST']}` },
  })
}