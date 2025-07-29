import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Deep insights into market trends and your portfolio performance.
          </p>
        </div>

        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">📈</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Advanced analytics features are being developed.
          </p>
        </div>
      </div>
    </div>
  )
}