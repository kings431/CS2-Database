'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Star
} from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  marketHashName: string
  type: string
  rarity: string
  weapon?: string
  skin?: string
  float?: number
  wear?: string
  pattern?: number
  isStatTrak: boolean
  isSouvenir: boolean
  iconUrl: string
  iconUrlLarge: string
  marketable: boolean
  tradeable: boolean
  descriptions: Array<{
    type: string
    value: string
    color?: string
  }>
  tags: Array<{
    category: string
    internal_name: string
    localized_category_name: string
    localized_tag_name: string
    color?: string
  }>
  actions: Array<{
    name: string
    link: string
  }>
  marketActions: Array<{
    name: string
    link: string
  }>
}

interface InventoryData {
  items: InventoryItem[]
  counts: {
    weapons?: number
    stickers?: number
    patches?: number
    charms?: number
    other?: number
  }
  totalItems: number
  steamId: string
}

export default function InventoryPage() {
  const { data: session, status } = useSession()
  const [inventory, setInventory] = useState<InventoryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      redirect('/auth/signin')
    }

    fetchInventory()
  }, [session, status])

  const fetchInventory = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/inventory/steam')
      const data = await response.json()
      
      if (data.success) {
        setInventory(data.data)
      } else {
        setError(data.error || 'Failed to fetch inventory')
      }
    } catch (err) {
      setError('Failed to fetch inventory from Steam')
      console.error('Error fetching inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'consumer':
        return 'text-gray-400'
      case 'industrial':
        return 'text-blue-400'
      case 'mil-spec':
        return 'text-green-400'
      case 'restricted':
        return 'text-blue-500'
      case 'classified':
        return 'text-purple-400'
      case 'covert':
        return 'text-red-400'
      case 'contraband':
        return 'text-orange-400'
      default:
        return 'text-gray-300'
    }
  }

  const getWearColor = (wear: string) => {
    switch (wear?.toLowerCase()) {
      case 'factory new':
        return 'text-green-400'
      case 'minimal wear':
        return 'text-blue-400'
      case 'field-tested':
        return 'text-yellow-400'
      case 'well-worn':
        return 'text-orange-400'
      case 'battle-scarred':
        return 'text-red-400'
      default:
        return 'text-gray-300'
    }
  }

  const filteredItems = inventory?.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.marketHashName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRarity = selectedRarity === 'All' || item.rarity === selectedRarity
    const matchesType = selectedType === 'All' || item.type.toLowerCase().includes(selectedType.toLowerCase())
    
    return matchesSearch && matchesRarity && matchesType
  }) || []

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'rarity':
        return a.rarity.localeCompare(b.rarity)
      case 'float':
        return (a.float || 0) - (b.float || 0)
      case 'type':
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your CS2 Inventory</h1>
              <p className="text-gray-400">
                {inventory ? `${inventory.totalItems} items from Steam` : 'Loading your inventory...'}
              </p>
            </div>
            <button
              onClick={fetchInventory}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats */}
          {inventory && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-gray-400">Total Items</span>
                </div>
                <div className="text-2xl font-bold">{inventory.totalItems}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-gray-400">Weapons</span>
                </div>
                <div className="text-2xl font-bold">{inventory.counts.weapons || 0}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-400">Stickers</span>
                </div>
                <div className="text-2xl font-bold">{inventory.counts.stickers || 0}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-purple-400" />
                  <span className="text-sm text-gray-400">Patches</span>
                </div>
                <div className="text-2xl font-bold">{inventory.counts.patches || 0}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-400" />
                  <span className="text-sm text-gray-400">Charms</span>
                </div>
                <div className="text-2xl font-bold">{inventory.counts.charms || 0}</div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
            <p className="text-red-300 text-sm mt-2">
              This might be because your inventory is private or Steam is temporarily unavailable.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h2>
            <span className="text-gray-400">{filteredItems.length} items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option>All Rarities</option>
              <option>Consumer</option>
              <option>Industrial</option>
              <option>Mil-Spec</option>
              <option>Restricted</option>
              <option>Classified</option>
              <option>Covert</option>
              <option>Contraband</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option>All Types</option>
              <option>Weapon</option>
              <option>Knife</option>
              <option>Gloves</option>
              <option>Sticker</option>
              <option>Patch</option>
              <option>Charm</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="rarity">Sort by Rarity</option>
              <option value="float">Sort by Float</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <RefreshCw className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-400" />
            <p className="text-gray-400">Fetching your inventory from Steam...</p>
          </div>
        )}

        {/* Inventory Grid */}
        {!loading && inventory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                {/* Item Image */}
                <div className="relative bg-gray-700 h-48 flex items-center justify-center">
                  {item.iconUrl ? (
                    <img
                      src={`https://community.cloudflare.steamstatic.com/economy/image/${item.iconUrl}`}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                                             onError={(e) => {
                         const target = e.currentTarget as HTMLImageElement
                         target.style.display = 'none'
                         const nextSibling = target.nextElementSibling as HTMLElement
                         if (nextSibling) {
                           nextSibling.style.display = 'flex'
                         }
                       }}
                    />
                  ) : null}
                  <div className="hidden items-center justify-center w-full h-full text-gray-500">
                    <Package className="h-12 w-12" />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {item.isStatTrak && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">ST</span>
                    )}
                    {item.isSouvenir && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">SV</span>
                    )}
                  </div>
                </div>

                {/* Item Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.name}</h3>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Rarity:</span>
                      <span className={getRarityColor(item.rarity)}>{item.rarity}</span>
                    </div>
                    
                    {item.weapon && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Weapon:</span>
                        <span className="text-white">{item.weapon}</span>
                      </div>
                    )}
                    
                    {item.skin && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Skin:</span>
                        <span className="text-white">{item.skin}</span>
                      </div>
                    )}
                    
                    {item.float !== null && item.float !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Float:</span>
                        <span className="text-white">{item.float.toFixed(6)}</span>
                      </div>
                    )}
                    
                    {item.wear && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Wear:</span>
                        <span className={getWearColor(item.wear)}>{item.wear}</span>
                      </div>
                    )}
                    
                    {item.pattern !== null && item.pattern !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Pattern:</span>
                        <span className="text-white">#{item.pattern}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                    {item.marketable && (
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Market
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && inventory && sortedItems.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-semibold mb-2">No items found</h2>
            <p className="text-gray-400">
              {searchTerm || selectedRarity !== 'All' || selectedType !== 'All' 
                ? 'Try adjusting your filters' 
                : 'Your inventory appears to be empty or private'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}