'use client'

import { useState } from 'react'
import { Search, Filter, ChevronDown } from 'lucide-react'

const mockItems = [
  {
    id: '1',
    name: 'AK-47 | Redline',
    condition: 'Field-Tested',
    float: 0.2847,
    steamPrice: 87.50,
    buffPrice: 92.30,
    csMoneyPrice: 89.15,
    rarity: 'Classified',
    iconUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_1K9kL_u0Z_ptMvXiSw0g87Hsjc/360fx360f',
  },
  {
    id: '2',
    name: 'AWP | Dragon Lore',
    condition: 'Field-Tested',
    float: 0.1642,
    steamPrice: 4250.00,
    buffPrice: 4180.50,
    csMoneyPrice: 4320.75,
    rarity: 'Covert',
    iconUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2D8CsJMgiLiVpI2t2VDj_Es_YGumJ4bGdFQ4aFrU-wK7wO3ug5G5tM7Izns3syQg7HzfgVXp1gYMMLJxxavJvHdvITg/360fx360f',
  },
  {
    id: '3',
    name: 'M4A4 | Howl',
    condition: 'Minimal Wear',
    float: 0.0892,
    steamPrice: 3850.25,
    buffPrice: 3765.80,
    csMoneyPrice: 3920.45,
    rarity: 'Covert',
    iconUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPNl31IppQt2rCRrYmliAC1-EVrYW6mLdWXcw89YljY-FLqk7_ug5W8u5vKwCMwvCF2-z-DyJlT4pFo/360fx360f',
  },
]

export function InventoryOverview() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('value')

  return (
    <div className="skin-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Inventory Overview</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-accent transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Condition</th>
              <th>Float</th>
              <th>Steam</th>
              <th>Buff163</th>
              <th>CS.Money</th>
              <th>Best Price</th>
            </tr>
          </thead>
          <tbody>
            {mockItems.map((item) => {
              const bestPrice = Math.max(item.steamPrice, item.buffPrice, item.csMoneyPrice)
              return (
                <tr key={item.id} className="hover:bg-muted/20 cursor-pointer">
                  <td>
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.iconUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className={`text-sm rarity-${item.rarity.toLowerCase().replace(' ', '')}`}>
                          {item.rarity}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-muted-foreground">
                      {item.condition}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-mono text-foreground">
                      {item.float.toFixed(4)}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-foreground">
                      ${item.steamPrice.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-foreground">
                      ${item.buffPrice.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-foreground">
                      ${item.csMoneyPrice.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-green-400">
                      ${bestPrice.toFixed(2)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing 3 of 247 items</span>
          <button className="text-primary hover:text-primary/80 transition-colors">
            View All Items →
          </button>
        </div>
      </div>
    </div>
  )
}