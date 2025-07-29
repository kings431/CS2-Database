import { PrismaClient } from '@prisma/client'
import SteamUser from 'steam-user'
import SteamTotp from 'steam-totp'
import SteamCommunity from 'steamcommunity'

const prisma = new PrismaClient()

export interface SteamBot {
  id: string
  username: string
  password: string
  sharedSecret: string
  identitySecret: string
  requestsToday: number
  lastRequestTime: number
  isOnline: boolean
  sessionId?: string
  steamGuardCode?: string
  client?: SteamUser
  community?: SteamCommunity
  sessionCookies?: string[]
}

export interface SteamItemData {
  name: string
  wear: string
  pattern: number
  category: string
  rarity: string
  iconUrl?: string
  inspectLink: string
  float?: number
  marketHashName?: string
}

export class SteamBotManager {
  private bots: SteamBot[] = []
  private currentBotIndex = 0
  private isInitialized = false

  constructor() {
    this.initializeBots()
  }

  private initializeBots() {
    // Initialize with Steam bot accounts from environment variables
    this.bots = [
      {
        id: 'cs2db_bot_1',
        username: process.env.STEAM_BOT_1_USERNAME || '',
        password: process.env.STEAM_BOT_1_PASSWORD || '',
        sharedSecret: process.env.STEAM_BOT_1_SHARED_SECRET || '',
        identitySecret: process.env.STEAM_BOT_1_IDENTITY_SECRET || '',
        requestsToday: 0,
        lastRequestTime: 0,
        isOnline: false
      },
      {
        id: 'cs2db_bot_2',
        username: process.env.STEAM_BOT_2_USERNAME || '',
        password: process.env.STEAM_BOT_2_PASSWORD || '',
        sharedSecret: process.env.STEAM_BOT_2_SHARED_SECRET || '',
        identitySecret: process.env.STEAM_BOT_2_IDENTITY_SECRET || '',
        requestsToday: 0,
        lastRequestTime: 0,
        isOnline: false
      }
    ]

    // Filter out bots without credentials
    this.bots = this.bots.filter(bot => 
      bot.username && bot.password && bot.sharedSecret && bot.identitySecret
    )

    console.log(`🤖 Initialized ${this.bots.length} Steam bots`)
  }

  async initialize() {
    if (this.isInitialized) return

    console.log('🤖 Initializing Steam bot system...')
    
    if (this.bots.length === 0) {
      console.log('⚠️ No Steam bots configured with valid credentials')
      return
    }
    
    // Try to authenticate all bots
    for (const bot of this.bots) {
      try {
        await this.authenticateBot(bot)
        console.log(`✅ Bot ${bot.username} authenticated successfully`)
      } catch (error) {
        console.log(`❌ Bot ${bot.username} authentication failed:`, error.message)
        bot.isOnline = false
      }
    }

    this.isInitialized = true
    console.log('🤖 Steam bot system initialized')
  }

  private async authenticateBot(bot: SteamBot): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create Steam client
        const client = new SteamUser()
        bot.client = client

        // Generate Steam Guard code
        const steamGuardCode = SteamTotp.generateAuthCode(bot.sharedSecret)

        // Set up event handlers
        client.on('loggedOn', () => {
          console.log(`✅ Bot ${bot.username} logged on to Steam`)
          bot.isOnline = true
          
          // Set up Steam Community
          const community = new SteamCommunity()
          bot.community = community
          
          // Get web session cookies
          client.webLogOn((sessionID, cookies) => {
            bot.sessionId = sessionID
            bot.sessionCookies = cookies
            console.log(`✅ Bot ${bot.username} web session established`)
            resolve()
          })
        })

        client.on('error', (error) => {
          console.error(`❌ Bot ${bot.username} error:`, error)
          bot.isOnline = false
          reject(error)
        })

        client.on('steamGuard', (domain, callback) => {
          console.log(`🔐 Bot ${bot.username} Steam Guard required`)
          // For now, we'll use the shared secret to generate the code
          const code = SteamTotp.generateAuthCode(bot.sharedSecret)
          callback(code)
        })

        // Log on to Steam
        client.logOn({
          accountName: bot.username,
          password: bot.password,
          twoFactorCode: steamGuardCode
        })

      } catch (error) {
        console.error(`❌ Bot ${bot.username} authentication error:`, error)
        bot.isOnline = false
        reject(error)
      }
    })
  }

  getNextAvailableBot(): SteamBot | null {
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    const maxRequestsPerDay = 86400 // 1 request per second for 24 hours

    for (let i = 0; i < this.bots.length; i++) {
      const bot = this.bots[this.currentBotIndex]
      this.currentBotIndex = (this.currentBotIndex + 1) % this.bots.length

      // Reset daily request count if it's been more than 24 hours
      if (now - bot.lastRequestTime > oneDay) {
        bot.requestsToday = 0
      }

      // Check if bot is available (online, not rate limited, and within daily limit)
      if (bot.isOnline && bot.requestsToday < maxRequestsPerDay && bot.sessionCookies) {
        return bot
      }
    }

    return null
  }

  async fetchItemDataWithBot(bot: SteamBot, params: any): Promise<SteamItemData | null> {
    try {
      console.log(`🤖 Using Steam bot: ${bot.username} to fetch item data`)
      
      // Update bot usage
      bot.requestsToday++
      bot.lastRequestTime = Date.now()

      // Method 1: Try Steam's internal item details API with authenticated session
      const itemData = await this.fetchFromSteamInternalAPI(bot, params)
      if (itemData) {
        console.log(`✅ Bot ${bot.username} successfully fetched real item data`)
        return itemData
      }

      // Method 2: Try Steam Community API with bot session
      const communityData = await this.fetchFromSteamCommunityAPI(bot, params)
      if (communityData) {
        console.log(`✅ Bot ${bot.username} successfully fetched community data`)
        return communityData
      }

      // Method 3: Try Steam Market API with bot session
      const marketData = await this.fetchFromSteamMarketAPI(bot, params)
      if (marketData) {
        console.log(`✅ Bot ${bot.username} successfully fetched market data`)
        return marketData
      }

      console.log(`❌ Bot ${bot.username} failed to fetch item data`)
      return null

    } catch (error) {
      console.error(`❌ Steam bot ${bot.username} failed to fetch item data:`, error)
      return null
    }
  }

  private async fetchFromSteamInternalAPI(bot: SteamBot, params: any): Promise<SteamItemData | null> {
    try {
      console.log(`🔍 Bot ${bot.username} trying Steam internal API...`)
      
      if (!bot.community || !bot.sessionCookies) {
        console.log(`❌ Bot ${bot.username} not properly authenticated`)
        return null
      }

      // Use Steam Community with authenticated session
      const url = `https://steamcommunity.com/economy/itemdetails/${params.assetId}/?l=english`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://steamcommunity.com/',
          'Origin': 'https://steamcommunity.com',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Cookie': bot.sessionCookies.join('; ')
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Bot ${bot.username} got Steam internal API response:`, data)
        
        if (data.success && data.iteminfo) {
          return this.createItemDataFromSteamResponse(data.iteminfo, params)
        }
      } else {
        console.log(`❌ Bot ${bot.username} Steam internal API failed:`, response.status)
      }
      
      return null
    } catch (error) {
      console.error(`❌ Steam internal API failed for bot ${bot.username}:`, error)
      return null
    }
  }

  private async fetchFromSteamCommunityAPI(bot: SteamBot, params: any): Promise<SteamItemData | null> {
    try {
      console.log(`🔍 Bot ${bot.username} trying Steam Community API...`)
      
      if (!bot.sessionCookies) {
        return null
      }

      // Try to fetch from the specific user's inventory with authenticated session
      const url = `https://steamcommunity.com/inventory/${params.steamId}/730/2?l=english&count=5000`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://steamcommunity.com/',
          'Origin': 'https://steamcommunity.com',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Connection': 'keep-alive',
          'Cookie': bot.sessionCookies.join('; ')
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Bot ${bot.username} got Steam Community API response`)
        
        const item = this.findItemByAssetId(data, params.assetId)
        if (item) {
          return this.createItemDataFromInventoryWithDetails(data, item, params)
        }
      } else {
        console.log(`❌ Bot ${bot.username} Steam Community API failed:`, response.status)
      }
      
      return null
    } catch (error) {
      console.error(`❌ Steam Community API failed for bot ${bot.username}:`, error)
      return null
    }
  }

  private async fetchFromSteamMarketAPI(bot: SteamBot, params: any): Promise<SteamItemData | null> {
    try {
      console.log(`🔍 Bot ${bot.username} trying Steam Market API...`)
      
      if (!bot.sessionCookies) {
        return null
      }

      const url = `https://steamcommunity.com/market/itemordershistogram?country=US&language=english&currency=1&item_nameid=${params.assetId}`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://steamcommunity.com/market/',
          'Origin': 'https://steamcommunity.com',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Connection': 'keep-alive',
          'Cookie': bot.sessionCookies.join('; ')
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Bot ${bot.username} got Steam Market API response:`, data)
        
        if (data.success === 1 && data.item_name) {
          return this.createItemDataFromMarketResponse(data, params)
        }
      } else {
        console.log(`❌ Bot ${bot.username} Steam Market API failed:`, response.status)
      }
      
      return null
    } catch (error) {
      console.error(`❌ Steam Market API failed for bot ${bot.username}:`, error)
      return null
    }
  }

  private createItemDataFromSteamResponse(itemInfo: any, params: any): SteamItemData {
    console.log('Creating item data from Steam response:', itemInfo)
    
    // Extract real float value from descriptions
    let floatValue = 0.5 // Default
    let patternValue = 1 // Default
    
    if (itemInfo.descriptions) {
      for (const desc of itemInfo.descriptions) {
        if (desc.value && desc.value.includes('Float Value:')) {
          const floatMatch = desc.value.match(/Float Value: ([0-9.]+)/)
          if (floatMatch) {
            floatValue = parseFloat(floatMatch[1])
            console.log('Found float value:', floatValue)
          }
        }
        if (desc.value && desc.value.includes('Pattern Template:')) {
          const patternMatch = desc.value.match(/Pattern Template: (\d+)/)
          if (patternMatch) {
            patternValue = parseInt(patternMatch[1])
            console.log('Found pattern value:', patternValue)
          }
        }
      }
    }
    
    // Extract wear condition from float value
    const wearCondition = this.getWearConditionFromFloat(floatValue)
    
    return {
      name: itemInfo.name || itemInfo.market_name || 'Unknown Item',
      wear: wearCondition,
      pattern: patternValue,
      category: this.determineCategory(itemInfo.name || ''),
      rarity: this.determineRarity(itemInfo.name || ''),
      iconUrl: itemInfo.icon_url || itemInfo.icon_url_large,
      inspectLink: `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${params.steamId}A${params.assetId}D${params.d}`,
      float: floatValue,
      marketHashName: itemInfo.market_hash_name || itemInfo.name
    }
  }

  private createItemDataFromMarketResponse(marketData: any, params: any): SteamItemData {
    console.log('Creating item data from Steam Market response:', marketData)
    
    // Extract float and pattern from market data
    let floatValue = 0.5
    let patternValue = 1
    
    if (marketData.iteminfo && marketData.iteminfo.descriptions) {
      for (const desc of marketData.iteminfo.descriptions) {
        if (desc.value && desc.value.includes('Float Value:')) {
          const floatMatch = desc.value.match(/Float Value: ([0-9.]+)/)
          if (floatMatch) {
            floatValue = parseFloat(floatMatch[1])
          }
        }
        if (desc.value && desc.value.includes('Pattern Template:')) {
          const patternMatch = desc.value.match(/Pattern Template: (\d+)/)
          if (patternMatch) {
            patternValue = parseInt(patternMatch[1])
          }
        }
      }
    }
    
    const wearCondition = this.getWearConditionFromFloat(floatValue)
    
    return {
      name: marketData.item_name || 'Unknown Item',
      wear: wearCondition,
      pattern: patternValue,
      category: this.determineCategory(marketData.item_name || ''),
      rarity: this.determineRarity(marketData.item_name || ''),
      iconUrl: marketData.iteminfo?.icon_url,
      inspectLink: `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${params.steamId}A${params.assetId}D${params.d}`,
      float: floatValue,
      marketHashName: marketData.item_name
    }
  }

  private createItemDataFromInventoryWithDetails(inventoryData: any, item: any, params: any): SteamItemData {
    console.log('Creating item data from Steam Inventory API:', item)
    
    // Find the item description
    const descriptions = inventoryData.descriptions || []
    const itemDescription = descriptions.find((desc: any) => 
      desc.classid === item.classid && desc.instanceid === item.instanceid
    )
    
    if (!itemDescription) {
      throw new Error('Item description not found')
    }
    
    // Extract real float and pattern values
    let floatValue = 0.5
    let patternValue = 1
    
    if (itemDescription.descriptions) {
      for (const desc of itemDescription.descriptions) {
        if (desc.value && desc.value.includes('Float Value:')) {
          const floatMatch = desc.value.match(/Float Value: ([0-9.]+)/)
          if (floatMatch) {
            floatValue = parseFloat(floatMatch[1])
          }
        }
        if (desc.value && desc.value.includes('Pattern Template:')) {
          const patternMatch = desc.value.match(/Pattern Template: (\d+)/)
          if (patternMatch) {
            patternValue = parseInt(patternMatch[1])
          }
        }
      }
    }
    
    const wearCondition = this.getWearConditionFromFloat(floatValue)
    
    return {
      name: itemDescription.market_hash_name,
      wear: wearCondition,
      pattern: patternValue,
      category: this.determineCategory(itemDescription.market_hash_name),
      rarity: this.determineRarity(itemDescription.market_hash_name),
      iconUrl: `https://community.cloudflare.steamstatic.com/economy/image/${itemDescription.icon_url}`,
      inspectLink: `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${params.steamId}A${params.assetId}D${params.d}`,
      float: floatValue,
      marketHashName: itemDescription.market_hash_name
    }
  }

  private findItemByAssetId(data: any, assetId: string) {
    const assets = data.assets || []
    console.log('Searching for asset ID:', assetId, 'in', assets.length, 'assets')
    
    const item = assets.find((asset: any) => asset.assetid === assetId)
    if (item) {
      console.log('Found asset:', item)
    } else {
      console.log('Asset not found. First few assets:', assets.slice(0, 3))
    }
    return item
  }

  private getWearConditionFromFloat(floatValue: number): string {
    if (floatValue <= 0.07) return 'Factory New'
    if (floatValue <= 0.15) return 'Minimal Wear'
    if (floatValue <= 0.38) return 'Field-Tested'
    if (floatValue <= 0.45) return 'Well-Worn'
    return 'Battle-Scarred'
  }

  private determineCategory(marketHashName: string): string {
    const name = marketHashName.toLowerCase()
    
    if (name.includes('★') || name.includes('knife')) return 'knife'
    if (name.includes('gloves') || name.includes('hand wraps')) return 'gloves'
    if (name.includes('sticker')) return 'sticker'
    if (name.includes('case')) return 'case'
    if (name.includes('key')) return 'key'
    if (name.includes('music kit')) return 'music'
    if (name.includes('agent')) return 'agent'
    
    return 'weapon'
  }

  private determineRarity(marketHashName: string): string {
    const name = marketHashName.toLowerCase()
    
    if (name.includes('consumer grade') || name.includes('light blue')) return 'Consumer Grade'
    if (name.includes('industrial grade') || name.includes('blue')) return 'Industrial Grade'
    if (name.includes('mil-spec') || name.includes('purple')) return 'Mil-Spec'
    if (name.includes('restricted') || name.includes('pink')) return 'Restricted'
    if (name.includes('classified') || name.includes('red')) return 'Classified'
    if (name.includes('covert') || name.includes('yellow')) return 'Covert'
    if (name.includes('contraband') || name.includes('gold')) return 'Contraband'
    
    return 'Classified' // Default
  }

  // Public method to get bot status
  getBotStatus(): { totalBots: number; availableBots: number; totalRequestsToday: number } {
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    const maxRequestsPerDay = 86400

    let availableBots = 0
    let totalRequestsToday = 0

    for (const bot of this.bots) {
      if (now - bot.lastRequestTime > oneDay) {
        bot.requestsToday = 0
      }

      if (bot.isOnline && bot.requestsToday < maxRequestsPerDay) {
        availableBots++
      }

      totalRequestsToday += bot.requestsToday
    }

    return {
      totalBots: this.bots.length,
      availableBots,
      totalRequestsToday
    }
  }

  // Method to manually authenticate a bot (for testing)
  async authenticateBotManually(botId: string): Promise<boolean> {
    const bot = this.bots.find(b => b.id === botId)
    if (!bot) {
      console.log(`❌ Bot ${botId} not found`)
      return false
    }

    try {
      await this.authenticateBot(bot)
      return true
    } catch (error) {
      console.error(`❌ Failed to authenticate bot ${botId}:`, error)
      return false
    }
  }
}

// Create and export a singleton instance
export const steamBotManager = new SteamBotManager() 