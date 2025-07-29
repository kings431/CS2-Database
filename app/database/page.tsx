'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, ChevronDown, Eye, Camera, ExternalLink, Info, X, RotateCcw, HelpCircle } from 'lucide-react'

interface Skin {
  id: string
  name: string
  marketHashName: string
  rarity: string
  category: string
  weapon?: string
  skin?: string
  collection?: string
  source?: string
  float?: number
  wear?: string
  pattern?: number
  isStatTrak: boolean
  isSouvenir: boolean
  isNormal: boolean
  age?: number
  steamPrice?: number
  buffPrice?: number
  csMoneyPrice?: number
  bitskinsPrice?: number
  iconUrl?: string
  inspectLink?: string
  lastUpdated: string
  createdAt: string
  stickers?: Array<{ name: string; slot: number }>
  charms?: Array<{ name: string }>
}

export default function DatabasePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('Low Float')
  const [minWear, setMinWear] = useState('')
  const [maxWear, setMaxWear] = useState('')
  const [selectedWear, setSelectedWear] = useState('Any')
  const [statTrak, setStatTrak] = useState(false)
  const [souvenir, setSouvenir] = useState(false)
  const [normal, setNormal] = useState(true)
  const [paintSeed, setPaintSeed] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('Any')
  const [selectedCollection, setSelectedCollection] = useState('Any')
  const [selectedSource, setSelectedSource] = useState('Any')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [stickers, setStickers] = useState(['', '', '', '', ''])
  const [stickerSlots, setStickerSlots] = useState(['Any', 'Any', 'Any', 'Any', 'Any'])
  const [charm, setCharm] = useState('')
  const [skins, setSkins] = useState<Skin[]>([])
  const [loading, setLoading] = useState(false)
  const [showSearchSpotlight, setShowSearchSpotlight] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const rarityOptions = ['Any', 'Consumer', 'Industrial', 'Mil-Spec', 'Restricted', 'Classified', 'Covert', 'Contraband']
  const collectionOptions = ['Any', 'The 2018 Inferno Collection', 'The 2021 Dust 2 Collection', 'The 2018 Nuke Collection', 'The 2021 Mirage Collection', 'The 2018 Train Collection', 'The 2018 Dust 2 Collection', 'The 2018 Cache Collection']
  const sourceOptions = ['Any', 'Case', 'Operation', 'Collection', 'Trade Up', 'Drop']

  const resetAllFilters = () => {
    setSearchTerm('')
    setSortBy('Low Float')
    setMinWear('')
    setMaxWear('')
    setSelectedWear('Any')
    setStatTrak(false)
    setSouvenir(false)
    setNormal(true)
    setPaintSeed('')
    setSelectedRarity('Any')
    setSelectedCollection('Any')
    setSelectedSource('Any')
    setMinAge('')
    setMaxAge('')
    setMinPrice('')
    setMaxPrice('')
    setStickers(['', '', '', '', ''])
    setStickerSlots(['Any', 'Any', 'Any', 'Any', 'Any'])
    setCharm('')
  }

  const handleStickerChange = (index: number, value: string) => {
    const newStickers = [...stickers]
    newStickers[index] = value
    setStickers(newStickers)
  }

  const handleStickerSlotChange = (index: number, value: string) => {
    const newStickerSlots = [...stickerSlots]
    newStickerSlots[index] = value
    setStickerSlots(newStickerSlots)
  }

  // Parse search query and extract filters
  const parseSearchQuery = (query: string) => {
    const filters: any = {}
    const terms = query.toLowerCase().split(' ').filter(term => term.trim())
    
    // Extract float range
    const floatRangeMatch = query.match(/(\d+\.?\d*)-(\d+\.?\d*)/)
    if (floatRangeMatch) {
      filters.minWear = parseFloat(floatRangeMatch[1])
      filters.maxWear = parseFloat(floatRangeMatch[2])
    } else {
      const lessThanMatch = query.match(/<(\d+\.?\d*)/)
      const greaterThanMatch = query.match(/>(\d+\.?\d*)/)
      if (lessThanMatch) {
        filters.maxWear = parseFloat(lessThanMatch[1])
      }
      if (greaterThanMatch) {
        filters.minWear = parseFloat(greaterThanMatch[1])
      }
    }

    // Extract paint seed
    const paintSeedMatch = query.match(/#(\d+)/)
    if (paintSeedMatch) {
      filters.paintSeed = paintSeedMatch[1]
    }

    // Extract wear condition
    const wearTerms = ['fn', 'mw', 'ft', 'ww', 'bs']
    const foundWear = terms.find(term => wearTerms.includes(term))
    if (foundWear) {
      filters.selectedWear = foundWear.toUpperCase()
    }

    // Extract categories
    if (terms.includes('st') || terms.includes('stattrak')) {
      filters.statTrak = true
    }
    if (terms.includes('souvenir') || terms.includes('souv')) {
      filters.souvenir = true
    }
    if (terms.includes('normal') || terms.includes('norm')) {
      filters.normal = true
    }

    // Extract sort options
    if (terms.includes('high float')) {
      filters.sortBy = 'High Float'
    } else if (terms.includes('low float')) {
      filters.sortBy = 'Low Float'
    }

    // Extract sticker names (common ones)
    const stickerTerms = ['crown', 'titan', 'ibp', 'holo', 'foil']
    const foundStickers = terms.filter(term => stickerTerms.includes(term))
    if (foundStickers.length > 0) {
      filters.stickers = foundStickers
    }

    return filters
  }

  const fetchSkins = async () => {
    setLoading(true)
    try {
      const parsedFilters = parseSearchQuery(searchTerm)
      
      const params = new URLSearchParams({
        sortBy: parsedFilters.sortBy || sortBy,
        normal: normal.toString(),
        statTrak: statTrak.toString(),
        souvenir: souvenir.toString()
      })

      if (parsedFilters.minWear !== undefined) params.append('minWear', parsedFilters.minWear.toString())
      if (parsedFilters.maxWear !== undefined) params.append('maxWear', parsedFilters.maxWear.toString())
      if (minWear) params.append('minWear', minWear)
      if (maxWear) params.append('maxWear', maxWear)
      if (selectedWear !== 'Any') params.append('selectedWear', selectedWear)
      if (paintSeed || parsedFilters.paintSeed) params.append('paintSeed', paintSeed || parsedFilters.paintSeed)
      if (selectedRarity !== 'Any') params.append('selectedRarity', selectedRarity)
      if (selectedCollection !== 'Any') params.append('selectedCollection', selectedCollection)
      if (selectedSource !== 'Any') params.append('selectedSource', selectedSource)
      if (minAge) params.append('minAge', minAge)
      if (maxAge) params.append('maxAge', maxAge)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (charm) params.append('charm', charm)

      // Add sticker filters
      const activeStickers = stickers.filter(s => s.trim() !== '')
      if (activeStickers.length > 0 || parsedFilters.stickers) {
        const stickersToUse = parsedFilters.stickers || activeStickers
        stickersToUse.forEach((sticker: string) => {
          params.append('stickers', sticker)
        })
      }

      const response = await fetch(`/api/database/skins?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setSkins(data.data)
      } else {
        console.error('Error fetching skins:', data.error)
      }
    } catch (error) {
      console.error('Error fetching skins:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkins()
  }, [sortBy, minWear, maxWear, selectedWear, statTrak, souvenir, normal, paintSeed, selectedRarity, selectedCollection, selectedSource, minAge, maxAge, minPrice, maxPrice, stickers, charm])

  const SearchSpotlight = () => (
    <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg p-4 mt-2 z-50 max-h-96 overflow-y-auto">
      <div className="space-y-4">
        {/* Apply Search Button */}
        <div className="text-center">
          <button
            onClick={() => {
              fetchSkins()
              setShowSearchSpotlight(false)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Apply Search
          </button>
        </div>

        {/* Quick Search Examples */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Quick Search Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'ak redline st ft',
              'awp dragon lore fn',
              'karambit fade mw',
              'm4a4 howl fn',
              'ak fire serpent ft',
              'awp medusa fn'
            ].map((example) => (
              <button
                key={example}
                onClick={() => {
                  setSearchTerm(example)
                  setShowSearchSpotlight(false)
                }}
                className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Item */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Item</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 font-mono">Syntax:</span>
              <span className="text-gray-300 ml-2">{'{item_name}'}</span>
            </div>
            <div>
              <span className="text-blue-400">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['dlore', 'awp', 'ak ch', 'karambit'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setSearchTerm(prev => prev + ' ' + example)}
                    className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Search for an item. Supports weapons, skins, stickers, patches, charms, and more!
            </p>
          </div>
        </div>

        {/* Float Range */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Float Range</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 font-mono">Syntax:</span>
              <span className="text-gray-300 ml-2">{'>'}{'{fv}'}, {'<'}{'{fv}'}, {'{min}-{max}'}</span>
            </div>
            <div>
              <span className="text-blue-400">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['<0.04', '>0.3', '0.15-0.19'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setSearchTerm(prev => prev + ' ' + example)}
                    className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Filters items based on a float range (e.g., value less than or greater than a specified float).
              Float values must be between 0.0 and 1.0. Use {'<'}{' '}for "less than" or {'>'}{' '}for "greater than".
              Omitting the operator defaults to a max float.
            </p>
          </div>
        </div>

        {/* Paint Seed */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Paint Seed</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 font-mono">Syntax:</span>
              <span className="text-gray-300 ml-2">#{'seed'}, {'seed'}</span>
            </div>
            <div>
              <span className="text-blue-400">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['#661', '340', '#955', '#387', '#321'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setSearchTerm(prev => prev + ' ' + example)}
                    className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Filters items based on paint seed. Range must be between 0 and 1000. 
              For more accurate results, specify a hashtag symbol (e.g., #661).
            </p>
          </div>
        </div>

        {/* Wear */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Wear</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 font-mono">Syntax:</span>
              <span className="text-gray-300 ml-2">{'{wear}'}</span>
            </div>
            <div>
              <span className="text-blue-400">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['fn', 'mw', 'ft', 'ww', 'bs'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setSearchTerm(prev => prev + ' ' + example)}
                    className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Filters items based on wear category. Supports Factory New, Minimal Wear, Field-Tested, Well-Worn, and Battle-Scarred. 
              Acronyms are supported (e.g., fn, mw, ft, ww, bs).
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Category</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 font-mono">Syntax:</span>
              <span className="text-gray-300 ml-2">{'{category}'}</span>
            </div>
            <div>
              <span className="text-blue-400">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['st', 'souvenir', 'normal'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setSearchTerm(prev => prev + ' ' + example)}
                    className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Filters items based on category. Supports StatTrak™, Souvenir, and Normal. 
              Aliases are also supported e.g., st, souv, norm.
            </p>
          </div>
        </div>

        {/* Sticker Search */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Sticker Search</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 font-mono">Syntax:</span>
              <span className="text-gray-300 ml-2">{'{sticker_name}'} {'{count}x'}</span>
            </div>
            <div>
              <span className="text-blue-400">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['crown foil', 'titan holo', 'ibp holo', '4x', '3x'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setSearchTerm(prev => prev + ' ' + example)}
                    className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Search for items with specific stickers. Use 4x, 3x, etc. to specify sticker count.
              Examples: "ak redline 4x crown foil" or "awp dragon lore titan holo"
            </p>
          </div>
        </div>

        {/* Sort By */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Sort By</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 font-mono">Syntax:</span>
              <span className="text-gray-300 ml-2">{'{sort_by}'}</span>
            </div>
            <div>
              <span className="text-blue-400">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['high float', 'low float', 'newest', 'updated'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setSearchTerm(prev => prev + ' ' + example)}
                    className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-sm transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Orders items by a specific criterion. Supports all database sorting criterion 
              (e.g., low float, high float, recently updated, etc.).
            </p>
          </div>
        </div>

        {/* Collection */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Collection</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 font-mono">Syntax:</span>
              <span className="text-gray-300 ml-2">{'{collection}'}</span>
            </div>
            <div>
              <span className="text-blue-400">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="bg-gray-600 px-2 py-1 rounded text-sm">chroma 2 collection</span>
                <span className="bg-gray-600 px-2 py-1 rounded text-sm">2021 dust 2</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Filters items based on their collection. Supports all collections.
            </p>
          </div>
        </div>

        {/* Rarity */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Rarity</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 font-mono">Syntax:</span>
              <span className="text-gray-300 ml-2">{'{rarity}'}</span>
            </div>
            <div>
              <span className="text-blue-400">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="bg-gray-600 px-2 py-1 rounded text-sm">contraband</span>
                <span className="bg-gray-600 px-2 py-1 rounded text-sm">milspec</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Filters items based on rarity. Supports all rarity types 
              (e.g., Consumer, Industrial, Mil-Spec, Restricted, Classified, Covert, and Contraband).
            </p>
          </div>
        </div>

        {/* Applied Sticker */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Applied Sticker</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 font-mono">Syntax:</span>
              <span className="text-gray-300 ml-2">{'{count}x {sticker_name}'}, {'{sticker_name}'}</span>
            </div>
            <div>
              <span className="text-blue-400">Examples:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="bg-gray-600 px-2 py-1 rounded text-sm">4x ibp holo kato 14</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Search for items with specific applied stickers. Use 4x, 3x, etc. to specify sticker count.
              Examples: "4x ibp holo kato 14" or "titan holo"
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CS2 Skin Database</h1>
          <p className="text-gray-400">Search and filter through thousands of CS2 skins with advanced filters</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search skins (e.g., ak vulcan st ft 4x crown foil)"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  if (e.target.value.length > 0) {
                    setShowSearchSpotlight(true)
                  } else {
                    setShowSearchSpotlight(false)
                  }
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => setSearchFocused(false), 200)
                  setTimeout(() => setShowSearchSpotlight(false), 200)
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              {(showSearchSpotlight || searchFocused) && <SearchSpotlight />}
            </div>
            <button
              onClick={() => setShowSearchSpotlight(!showSearchSpotlight)}
              className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <button
              onClick={fetchSkins}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Main Layout - Float Style */}
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-96 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </h2>
                <button
                  onClick={resetAllFilters}
                  className="text-gray-400 hover:text-white flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset All
                </button>
              </div>

              <div className="space-y-6">
                {/* Search on Database Button */}
                <button
                  onClick={fetchSkins}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
                >
                  Search on Database
                </button>

                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Q Search for items...</label>
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
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option>Low Float</option>
                    <option>High Float</option>
                    <option>Price Low to High</option>
                    <option>Price High to Low</option>
                    <option>Name A-Z</option>
                    <option>Name Z-A</option>
                  </select>
                </div>

                {/* Wear */}
                <div>
                  <label className="block text-sm font-medium mb-2">Wear</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        max="1"
                        value={minWear}
                        onChange={(e) => setMinWear(e.target.value)}
                        placeholder="Minimum 0"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        max="1"
                        value={maxWear}
                        onChange={(e) => setMaxWear(e.target.value)}
                        placeholder="Maximum 1"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex gap-1">
                      {['FN', 'MW', 'FT', 'WW', 'BS'].map((wear) => (
                        <button
                          key={wear}
                          onClick={() => setSelectedWear(selectedWear === wear ? 'Any' : wear)}
                          className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
                            selectedWear === wear 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {wear}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Special */}
                <div>
                  <label className="block text-sm font-medium mb-2">Special</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={statTrak}
                        onChange={(e) => setStatTrak(e.target.checked)}
                        className="mr-2"
                      />
                      StatTrak™
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={souvenir}
                        onChange={(e) => setSouvenir(e.target.checked)}
                        className="mr-2"
                      />
                      Souvenir
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={normal}
                        onChange={(e) => setNormal(e.target.checked)}
                        className="mr-2"
                      />
                      Normal
                    </label>
                  </div>
                </div>

                {/* Patterns */}
                <div>
                  <label className="block text-sm font-medium mb-2">Paint Seed</label>
                  <input
                    type="text"
                    value={paintSeed}
                    onChange={(e) => setPaintSeed(e.target.value)}
                    placeholder="Paint Seed"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Stickers */}
                <div>
                  <label className="block text-sm font-medium mb-2">Applied Stickers</label>
                  <div className="space-y-2">
                    {stickers.map((sticker, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={sticker}
                          onChange={(e) => handleStickerChange(index, e.target.value)}
                          placeholder={`Sticker ${index + 1}`}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        <select
                          value={stickerSlots[index]}
                          onChange={(e) => handleStickerSlotChange(index, e.target.value)}
                          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option>Any Slot</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <label className="block text-sm font-medium mb-2">Rarity</label>
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {rarityOptions.map(option => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Collection</label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {collectionOptions.map(option => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Source</label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {sourceOptions.map(option => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Min Age (days)</label>
                  <input
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    placeholder="0"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Age (days)</label>
                  <input
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    placeholder="365"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Min Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="10000.00"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Charm</label>
                  <input
                    type="text"
                    value={charm}
                    onChange={(e) => setCharm(e.target.value)}
                    placeholder="hot sauce"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Results */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Results ({skins.length})</h2>
                {loading && <div className="text-blue-400">Loading...</div>}
              </div>

              {skins.length === 0 && !loading ? (
                <div className="text-center py-8 text-gray-400">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No skins found. Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4">Rank</th>
                        <th className="text-left py-3 px-4">Skin</th>
                        <th className="text-left py-3 px-4">Float Value</th>
                        <th className="text-left py-3 px-4">Seed</th>
                        <th className="text-left py-3 px-4">Applied</th>
                        <th className="text-left py-3 px-4">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skins.map((skin, index) => (
                        <tr key={skin.id} className="border-b border-gray-700 hover:bg-gray-750">
                          <td className="py-3 px-4 text-sm text-gray-400">#{index + 1}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                                {skin.iconUrl ? (
                                  <img 
                                    src={skin.iconUrl} 
                                    alt={skin.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).style.display = 'none'
                                      ;(e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'
                                    }}
                                  />
                                ) : null}
                                <div className={`w-full h-full flex items-center justify-center ${skin.iconUrl ? 'hidden' : ''}`}>
                                  {skin.category === 'knife' ? '🔪' : '🔫'}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">{skin.name}</div>
                                <div className="text-sm text-gray-400">
                                  {skin.weapon} {skin.skin && `| ${skin.skin}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <div>{skin.float?.toFixed(14) || 'N/A'}</div>
                              <div className="text-gray-400">{skin.wear}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{skin.pattern || '0'}</td>
                          <td className="py-3 px-4">
                            {skin.stickers && skin.stickers.length > 0 ? (
                              <div className="flex gap-1">
                                {skin.stickers.slice(0, 4).map((sticker, idx) => (
                                  <div
                                    key={idx}
                                    className="w-4 h-4 rounded-full bg-yellow-500"
                                    title={sticker.name}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {skin.steamPrice ? (
                                <span className="text-sm">${skin.steamPrice.toFixed(2)}</span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                              <div className="flex gap-1">
                                {skin.inspectLink && (
                                  <button 
                                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                                    title="Inspect in Steam"
                                    onClick={() => window.open(skin.inspectLink, '_blank')}
                                  >
                                    <Eye size={14} />
                                  </button>
                                )}
                                <button className="p-1 text-gray-400 hover:text-white">
                                  <Camera size={14} />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-white">
                                  <RotateCcw size={14} />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-white">
                                  <span className="text-xs">1</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}