'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

const mockGainers = [
  {
    id: '1',
    name: 'AK-47 | Fire Serpent',
    price: 2450.00,
    change: 12.5,
    changePercent: 0.51,
    iconUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_1K9kL_u0Z_ptMvXiSw0g87Hsjc/360fx360f',
  },
  {
    id: '2',
    name: 'Karambit | Fade',
    price: 1850.75,
    change: -45.25,
    changePercent: -2.38,
    iconUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-YkvPLPr7Vn35cppx0i7HCpdWtjQK1rUM9az2id9fGJFQ2aFHYqFnvxLzqg5a86pzBznFhuycj-z-DyErq_K2w/360fx360f',
  },
  {
    id: '3',
    name: 'Glock-18 | Fade',
    price: 425.30,
    change: 18.75,
    changePercent: 4.61,
    iconUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3dzxP7c-JmYWPkuHxPYTdn2xZ_IslieXI8oThxlHj_UE4ZWr7ctfBJg8_NQzV-QO2xOm8jMO56pTOnSRr7iMi5HmLgVXp1ma2pSvW/360fx360f',
  },
  {
    id: '4',
    name: 'M4A1-S | Hot Rod',
    price: 625.90,
    change: -12.10,
    changePercent: -1.90,
    iconUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO-jb-Gw_alDLPNl31IppQt2rCRrYmliAC1-EVrYW6mLdWXcw89YljY-FLqk7_ug5W8u5vKwCMwvCF2-z-DyJlT4pFo/360fx360f',
  },
]

export function TopGainers() {
  return (
    <div className="skin-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Top Movers</h2>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View Market
        </button>
      </div>

      <div className="space-y-3">
        {mockGainers.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <img
              src={item.iconUrl}
              alt={item.name}
              className="w-10 h-10 rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.name}
              </p>
              <p className="text-sm text-muted-foreground">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                item.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.change > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
              </div>
              <p className={`text-xs ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.change > 0 ? '+' : ''}${item.change.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}