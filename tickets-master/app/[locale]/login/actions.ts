import { signIn } from "next-auth/react"
import { z } from 'zod'
import { ResultCode } from '@/lib/ai/utils'

export async function getUser(email: string) {
  const user = await fetch(`/api/auth/getUser`, {
    method: 'POST',
    body: JSON.stringify({ email })
  })
  return user
}

interface AuthResult {
  type: 'success' | 'error'
  resultCode: ResultCode
}

export async function authenticate(
  credentials: { email: string; password: string }
): Promise<AuthResult> {
  try {
    const { email, password } = credentials

    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6)
      })
      .safeParse({ email, password })

    if (!parsedCredentials.success) {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials
      }
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })
    if (result?.error) {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials
      }
    }

    return {
      type: 'success',
      resultCode: ResultCode.UserLoggedIn
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      type: 'error',
      resultCode: ResultCode.UnknownError
    }
  }
}
