import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navigation } from '@/components/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CS2 Skin Tracker - Track Your Counter-Strike Inventory',
  description: 'Professional CS2 skin tracker with price history across major marketplaces. Track your inventory value, get price alerts, and analyze market trends.',
  keywords: 'CS2, Counter-Strike, skin tracker, inventory, price tracking, CSFloat, Steam',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="pt-16">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}