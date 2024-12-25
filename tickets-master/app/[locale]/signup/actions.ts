import { signIn } from "next-auth/react"
import { ResultCode } from '@/lib/ai/utils'
import { z } from 'zod'
import { getUser } from '../login/actions'
import AuthError from 'next-auth'

export async function createUser(
  email: string,
  password: string,
  role: string,
) {
  const existingUserReq = await getUser(email)
  const existingUser = await existingUserReq.json()
  if (existingUser) {
    return {
      type: 'error',
      resultCode: ResultCode.UserAlreadyExists
    }
  } else {
    const userData = {
      email,
      password,
      role,
    }

    await fetch(`/api/auth/createUser`, {
      method: 'POST',
      body: JSON.stringify(userData)
    })

    return {
      type: 'success',
      resultCode: ResultCode.UserCreated
    }
  }
}

interface SignupResult {
  type: 'success' | 'error'
  resultCode: ResultCode
}

export async function signup(data: { email: string; password: string }): Promise<SignupResult> {
  const { email, password } = data

  const parsedCredentials = z
    .object({
      email: z.string().email(),
      password: z.string().min(6)
    })
    .safeParse({
      email,
      password
    })

  if (!parsedCredentials.success) {
    return { type: 'error', resultCode: ResultCode.InvalidCredentials }
  }

  try {
    // Set role
    const role = 'user'

    // Create user
    const result = await createUser(email, password, role)

    if (result.resultCode === ResultCode.UserCreated) {
      // Sign in the user
      await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      return { type: 'success', resultCode: ResultCode.UserCreated }
    } else {
      return result as SignupResult
    }
  } catch (error) {
    if (error instanceof AuthError && 'type' in error) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { type: 'error', resultCode: ResultCode.InvalidCredentials }
        default:
          return { type: 'error', resultCode: ResultCode.UnknownError }
      }
    } else {
      console.error('Signup error:', error)
      return { type: 'error', resultCode: ResultCode.UnknownError }
    }
  }
}
