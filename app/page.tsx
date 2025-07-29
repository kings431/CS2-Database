import { getServerSession } from 'next-auth/next'
import { Dashboard } from '@/components/dashboard'
import { LandingPage } from '@/components/landing-page'

export default async function Home() {
  const session = await getServerSession()

  if (!session) {
    return <LandingPage />
  }

  return <Dashboard />
}