import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google" // {{ edit_1 }}
import type { AuthOptions } from "next-auth"
import type { CustomUser } from "@/types/next-auth"
import NextAuth from "next-auth"
import { z } from 'zod'
import { kv } from '@vercel/kv'
import { v4 as uuidv4 } from 'uuid'; // Importing uuid for UUID generation
import CryptoJS from 'crypto-js'; // Importing crypto-js for hashing

export async function getUser(email: string) {
  const user = await kv.hgetall<CustomUser>(`user:${email}`)
  return user
}

export async function createUser(user: CustomUser) {
  return await kv.hmset(`user:${user.email}`, user)
}

async function validateUser(login: string) {
  // Example validation against environment variables
  if (login === process.env.AUTH_LOGIN_ADMIN) {
    return { id: '1', role: 'admin', username: 'admin', email: 'admin@ttm.org', password: '', salt: '' }
  } else if (login === process.env.AUTH_LOGIN_STAFF) {
    return { id: '2', role: 'staff', username: 'staff', email: 'staff@ttm.org', password: '', salt: '' }
  }
  return null;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "text" },
      },
      async authorize (credentials): Promise<CustomUser | null> {
        if (credentials) {
          const parsedCredentials = z
            .object({
              email: z.string().email(),
              password: z.string().min(6)
            })
            .safeParse(credentials)

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data
            const user = await getUser(email)

            if (!user) return null

            // Hash the provided password with the stored salt
            const saltedPassword = password + user.salt; // Concatenate password with salt
            const hashedPassword = CryptoJS.SHA256(saltedPassword).toString(); // Hashing the password

            if (hashedPassword === user.password) {
              return user
            } else {
              return null
            }
          }

          const user = await validateUser(credentials.password)
          if (user) {
            return user
          }
        }
        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        const { id, role, username } = token as { id: string, role: string, username: string }
        const { user } = session
        session = { ...session, user: { ...user, id, role, username } }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        // Check if the user already exists in your database
        const existingUser = await getUser(profile.email)
        if (!existingUser) {
          // Create a new user in your database
          const newUser = {
            id: uuidv4(), // Using uuid to generate a unique ID
            role: 'user',
            username: profile.name,
            email: profile.email,
            password: '', // No password for Google sign-in
            salt: '', // No salt needed for Google sign-in
          };
          await createUser(newUser)
        }
      }
      return true; // Allow sign-in
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/flights";
    }
  }
}

export const handler = NextAuth(authOptions)