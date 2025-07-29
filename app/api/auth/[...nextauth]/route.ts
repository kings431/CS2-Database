import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth-config'

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      steamId?: string
      licenseType?: string
    }
  }
  
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    steamId?: string
    licenseType?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    steamId?: string
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }