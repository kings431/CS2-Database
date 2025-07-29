'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle } from 'lucide-react'
import { InventoryOverview } from './dashboard/inventory-overview'
import { PriceChart } from './dashboard/price-chart'
import { RecentActivity } from './dashboard/recent-activity'
import { TopGainers } from './dashboard/top-gainers'

interface DashboardStats {
  totalValue: number
  dailyChange: number
  itemCount: number
  alerts: number
}

export function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalValue: 0,
    dailyChange: 0,
    itemCount: 0,
    alerts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setStats({
        totalValue: 12847.52,
        dailyChange: 127.43,
        itemCount: 247,
        alerts: 3,
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Package className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading your inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {session?.user?.name}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your CS2 inventory today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="skin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                <p className="text-2xl font-bold text-foreground">
                  ${stats.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="skin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">24h Change</p>
                <p className={`text-2xl font-bold ${stats.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.dailyChange >= 0 ? '+' : ''}${stats.dailyChange.toFixed(2)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stats.dailyChange >= 0 
                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                {stats.dailyChange >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-white" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
          </div>

          <div className="skin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                <p className="text-2xl font-bold text-foreground">{stats.itemCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="skin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
                <p className="text-2xl font-bold text-foreground">{stats.alerts}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <PriceChart />
            <InventoryOverview />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <RecentActivity />
            <TopGainers />
          </div>
        </div>
      </div>
    </div>
  )
}