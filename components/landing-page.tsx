'use client'

import { signIn } from 'next-auth/react'
import { TrendingUp, Shield, Zap, Database, Users, Star } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 -mt-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground mb-6">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 10,000+ CS2 traders
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
              Track Your CS2 Inventory
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Like a Pro
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Monitor price changes across major marketplaces, analyze your inventory value, 
              and get real-time alerts on your favorite CS2 skins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => signIn('steam')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 pulse-glow"
              >
                <Database className="w-5 h-5" />
                <span>Start Tracking with Steam</span>
              </button>
              <button className="border border-border hover:bg-accent text-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Track CS2 Skins
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From inventory management to price analytics, we&apos;ve got all the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="skin-card">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Price Tracking</h3>
              <p className="text-muted-foreground">
                Monitor prices across Steam, Buff163, CS.Money, and Bitskins in real-time.
              </p>
            </div>

            <div className="skin-card">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Inventory Analytics</h3>
              <p className="text-muted-foreground">
                Get detailed insights into your inventory value, trends, and performance.
              </p>
            </div>

            <div className="skin-card">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your data is encrypted and secure. We never store your Steam credentials.
              </p>
            </div>

            <div className="skin-card">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Real-time Alerts</h3>
              <p className="text-muted-foreground">
                Get notified when your favorite skins hit your target price points.
              </p>
            </div>

            <div className="skin-card">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Community Driven</h3>
              <p className="text-muted-foreground">
                Join thousands of traders sharing insights and market analysis.
              </p>
            </div>

            <div className="skin-card">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Premium Features</h3>
              <p className="text-muted-foreground">
                Advanced analytics, multiple accounts, and priority support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Start Tracking?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of CS2 traders who trust us with their inventory tracking.
          </p>
          <button
            onClick={() => signIn('steam')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-4 rounded-lg font-semibold text-xl transition-all duration-200 inline-flex items-center space-x-2"
          >
            <Database className="w-6 h-6" />
            <span>Get Started for Free</span>
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Free trial included
          </p>
        </div>
      </section>
    </div>
  )
}