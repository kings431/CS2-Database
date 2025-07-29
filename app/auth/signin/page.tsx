'use client'

import { signIn, getSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Database, Shield, Zap } from 'lucide-react'

export default function SignIn() {
  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to CS2Tracker</h1>
          <p className="text-muted-foreground">
            Sign in with Steam to start tracking your CS2 inventory
          </p>
        </div>

        <div className="skin-card">
          <div className="space-y-6">
            <button
              onClick={() => signIn('steam', { callbackUrl: '/' })}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <Database className="w-6 h-6" />
              <span>Continue with Steam</span>
            </button>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Secure Steam OpenID authentication</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Zap className="w-5 h-5 text-blue-400" />
                <span>Instant inventory synchronization</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Database className="w-5 h-5 text-purple-400" />
                <span>Real-time price tracking</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              We never store your Steam credentials.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}