'use client'

import { TrendingUp, TrendingDown, AlertCircle, Clock } from 'lucide-react'

const mockActivity = [
  {
    id: '1',
    type: 'price_alert',
    title: 'AK-47 | Redline',
    description: 'Price dropped below $85.00',
    timestamp: '2 minutes ago',
    change: -2.50,
    icon: AlertCircle,
    iconColor: 'text-orange-400',
  },
  {
    id: '2',
    type: 'price_increase',
    title: 'AWP | Dragon Lore',
    description: 'Increased by $125.50',
    timestamp: '15 minutes ago',
    change: 125.50,
    icon: TrendingUp,
    iconColor: 'text-green-400',
  },
  {
    id: '3',
    type: 'price_decrease',
    title: 'M4A4 | Howl',
    description: 'Decreased by $89.25',
    timestamp: '1 hour ago',
    change: -89.25,
    icon: TrendingDown,
    iconColor: 'text-red-400',
  },
  {
    id: '4',
    type: 'inventory_sync',
    title: 'Inventory Updated',
    description: 'Found 3 new items',
    timestamp: '2 hours ago',
    change: 0,
    icon: Clock,
    iconColor: 'text-blue-400',
  },
]

export function RecentActivity() {
  return (
    <div className="skin-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mockActivity.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${activity.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
              </div>
              {activity.change !== 0 && (
                <div className={`text-sm font-medium ${activity.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {activity.change > 0 ? '+' : ''}${activity.change.toFixed(2)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}