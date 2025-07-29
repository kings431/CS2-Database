import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'

interface SteamInventoryItem {
  id: string
  name: string
  market_hash_name: string
  market_name: string
  icon_url: string
  icon_url_large: string
  type: string
  rarity: string
  descriptions: Array<{
    type: string
    value: string
    color?: string
  }>
  actions: Array<{
    name: string
    link: string
  }>
  market_actions: Array<{
    name: string
    link: string
  }>
  tags: Array<{
    category: string
    internal_name: string
    localized_category_name: string
    localized_tag_name: string
    color?: string
  }>
  assetid: string
  classid: string
  instanceid: string
  amount: string
  marketable: number
  tradeable: number
  commodity: number
  market_tradable_restriction: string
  market_marketable_restriction: string
  fraudwarnings: string[]
  owner_descriptions: string[]
  owner_actions: string[]
  background_color: string
  icon_drag_url: string
  name_color: string
}

interface SteamInventoryResponse {
  success: boolean
  rgInventory: Record<string, unknown>
  rgDescriptions: Record<string, SteamInventoryItem>
  more: boolean
  more_start: number
  assets: unknown[]
  descriptions: SteamInventoryItem[]
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.steamId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated or no Steam ID found' },
        { status: 401 }
      )
    }

    const steamId = session.user.steamId
    const appId = '730' // CS2 app ID

    // Fetch inventory from Steam
    const inventoryUrl = `https://steamcommunity.com/inventory/${steamId}/${appId}/2?l=english&count=5000`
    
    const response = await fetch(inventoryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Steam API responded with status: ${response.status}`)
    }

    const data: SteamInventoryResponse = await response.json()

    if (!data.success) {
      throw new Error('Failed to fetch inventory from Steam')
    }

    // Process inventory items
    const inventoryItems = Object.values(data.rgDescriptions)
      .filter(item => {
        // Filter for CS2 items (weapons, knives, gloves, etc.)
        const type = item.type?.toLowerCase() || ''
        return type.includes('weapon') || 
               type.includes('knife') || 
               type.includes('gloves') || 
               type.includes('sticker') ||
               type.includes('patch') ||
               type.includes('charm') ||
               type.includes('music kit') ||
               type.includes('graffiti')
      })
      .map(item => {
        // Extract float value from descriptions
        let float = null
        let wear = null
        let pattern = null
        let isStatTrak = false
        let isSouvenir = false

        if (item.descriptions) {
          for (const desc of item.descriptions) {
            if (desc.value?.includes('Float Value:')) {
              const floatMatch = desc.value.match(/Float Value: ([0-9.]+)/)
              if (floatMatch) {
                float = parseFloat(floatMatch[1])
              }
            }
            if (desc.value?.includes('Exterior:')) {
              const wearMatch = desc.value.match(/Exterior: (.+)/)
              if (wearMatch) {
                wear = wearMatch[1]
              }
            }
            if (desc.value?.includes('Pattern:')) {
              const patternMatch = desc.value.match(/Pattern: #(\d+)/)
              if (patternMatch) {
                pattern = parseInt(patternMatch[1])
              }
            }
            if (desc.value?.includes('StatTrak™')) {
              isStatTrak = true
            }
            if (desc.value?.includes('Souvenir')) {
              isSouvenir = true
            }
          }
        }

        // Extract rarity from tags
        let rarity = 'Consumer'
        if (item.tags) {
          const rarityTag = item.tags.find(tag => tag.category === 'Rarity')
          if (rarityTag) {
            rarity = rarityTag.localized_tag_name
          }
        }

        // Extract weapon and skin names
        let weapon = null
        let skin = null
        if (item.market_hash_name) {
          const parts = item.market_hash_name.split(' | ')
          if (parts.length >= 2) {
            weapon = parts[0]
            skin = parts[1]
          } else {
            weapon = item.market_hash_name
          }
        }

        return {
          id: item.assetid || item.classid,
          name: item.name,
          marketHashName: item.market_hash_name,
          type: item.type,
          rarity,
          weapon,
          skin,
          float,
          wear,
          pattern,
          isStatTrak,
          isSouvenir,
          iconUrl: item.icon_url,
          iconUrlLarge: item.icon_url_large,
          marketable: item.marketable === 1,
          tradeable: item.tradeable === 1,
          descriptions: item.descriptions,
          tags: item.tags,
          actions: item.actions,
          marketActions: item.market_actions
        }
      })

    // Get inventory counts
    const inventoryCounts = Object.values(data.rgInventory).reduce((acc: Record<string, number>, item: unknown) => {
      const itemData = item as { classid: string }
      const classId = itemData.classid
      const description = data.rgDescriptions[classId]
      if (description) {
        const type = description.type?.toLowerCase() || ''
        if (type.includes('weapon') || type.includes('knife') || type.includes('gloves')) {
          acc.weapons = (acc.weapons || 0) + 1
        } else if (type.includes('sticker')) {
          acc.stickers = (acc.stickers || 0) + 1
        } else if (type.includes('patch')) {
          acc.patches = (acc.patches || 0) + 1
        } else if (type.includes('charm')) {
          acc.charms = (acc.charms || 0) + 1
        } else {
          acc.other = (acc.other || 0) + 1
        }
      }
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: {
        items: inventoryItems,
        counts: inventoryCounts,
        totalItems: inventoryItems.length,
        steamId
      }
    })

  } catch (error) {
    console.error('Error fetching Steam inventory:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch inventory from Steam',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 