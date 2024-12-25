'use client'

import { SessionProvider as AuthSessionProvider } from "next-auth/react"

export const SessionProvider = ({ children }) => {
  return (
    <AuthSessionProvider>
      {children}
    </AuthSessionProvider>
  )
}