'use client'

import { useState } from 'react'
import { signup } from '@/app/[locale]/signup/actions'
import { Link } from "@/navigation"
import { toast } from 'sonner'
import { getMessageFromCode } from '@/lib/ai/utils'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signup({ email, password })
      console.log('result', result)
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode))
      } else {
        toast.success(getMessageFromCode(result.resultCode))
        router.refresh()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGmailLogin = async () => {
    try {
      await signIn('google')
    } catch (error) {
      toast.error('Failed to sign up with Google')
    }
  }

  return (
    <form
      onSubmit={handleSignup}
      className="row w-100 flex-column items-center"
    >
      <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4 col-xxl-3 col-12 rounded-12 border-light bg-white px-20 pb-20 pt-24 shadow-4">
        <h1 className="text-25 fw-600 mb-10">Sign up for an account</h1>
        <div className="w-100">
          <div>
            <label
              className="mb-5 mt-10 block text-12 fw-500 text-light-1"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="d-block w-100 rounded-10 border-light bg-light px-10 py-8 text-15"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          <div className="mt-15">
            <label
              className="mb-5 block text-12 fw-500 text-light-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="d-block w-full rounded-10 border-light bg-light px-10 py-8 text-15"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>
        <SignupButton isLoading={isLoading} />
        <div className="position-relative text-center mt-15 mb-5">
          <span className="bg-white position-relative px-10 text-13 text-light-1" style={{ zIndex: 1 }}>
            Or continue with
          </span>
          <div className="position-absolute w-100 border-light" style={{ top: '50%', transform: 'translateY(-50%)' }}></div>
        </div>
        <button
          type="button"
          onClick={handleGmailLogin}
          className="button mt-10 d-flex w-100 py-12 flex-row align-items-center justify-center rounded-10 text-15 fw-600 -dark-1 border-light-2 text-dark"
        >
          Google
        </button>
      </div>

      <div className="col-12 row m-0 py-20">
        <Link
          href="/login"
          className="p-0 col d-flex flex-row x-gap-15 text-13 text-light-1 fw-500 justify-center"
        >
          Already have an account? <div className="fw-700 underline">Log in</div>
        </Link>
      </div>
    </form>
  )
}

const iconSpinner = <div className="loading-spinner" style={{ display: 'inline-block', verticalAlign: 'middle', height: '18px', width: '18px' }} />

function SignupButton({ isLoading }) {
  return (
    <button
      type="submit"
      className="button mt-30 d-flex w-100 py-12 flex-row align-items-center justify-center rounded-10 text-15 fw-600 bg-blue-1 -blue-4 text-light"
      disabled={isLoading}
    >
      {isLoading ? iconSpinner : 'Create account'}
    </button>
  )
}
