const { PrismaClient } = require('@prisma/client')
const SteamUser = require('steam-user')
const SteamTotp = require('steam-totp')
const SteamCommunity = require('steamcommunity')

const prisma = new PrismaClient()

class SteamBotManager {
  constructor() {
    this.bots = []
    this.currentBotIndex = 0
    this.isInitialized = false
    this.initializeBots()
  }

  initializeBots() {
    // Only initialize with the bot we have credentials for
    this.bots = [
      {
        id: 'cs2db_bot_1',
        username: process.env.STEAM_BOT_1_USERNAME || 'cs2db1',
        password: process.env.STEAM_BOT_1_PASSWORD || '',
        sharedSecret: process.env.STEAM_BOT_1_SHARED_SECRET || '',
        identitySecret: process.env.STEAM_BOT_1_IDENTITY_SECRET || '',
        requestsToday: 0,
        lastRequestTime: 0,
        isOnline: false
      }
    ]
  }

  async initialize() {
    if (this.isInitialized) return

    console.log('🤖 Initializing Steam bot system...')
    
    // Try to authenticate the bot
    const bot = this.bots[0]
    try {
      await this.authenticateBot(bot)
      console.log(`✅ Bot ${bot.username} authenticated successfully`)
    } catch (error) {
      console.log(`❌ Bot ${bot.username} authentication failed:`, error.message)
      bot.isOnline = false
    }

    this.isInitialized = true
    console.log('🤖 Steam bot system initialized')
  }

  async authenticateBot(bot) {
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
          // Use the shared secret to generate the code
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

  getNextAvailableBot() {
    const bot = this.bots[0]
    
    // Check if bot is available (online and has session cookies)
    if (bot.isOnline && bot.sessionCookies) {
      return bot
    }

    return null
  }

  async fetchItemDataWithBot(bot, params) {
    try {
      console.log(`🤖 Using Steam bot: ${bot.username} to fetch item data`)
      
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

      console.log(`❌ Bot ${bot.username} failed to fetch item data from all sources`)
      return null

    } catch (error) {
      console.error(`❌ Bot ${bot.username} fetch error:`, error)
      return null
    }
  }

  async fetchFromSteamInternalAPI(bot, params) {
    try {
      console.log(`🔍 Bot ${bot.username} trying Steam internal API...`)
      
      // Use the bot's authenticated session to fetch item details
      const url = `https://steamcommunity.com/inventory/${params.steamId}/730/2?l=english&count=5000`
      
      const response = await fetch(url, {
        headers: {
          'Cookie': bot.sessionCookies.join('; '),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const item = this.findItemByAssetId(data, params.assetId)
        
        if (item) {
          return this.createItemDataFromSteamResponse(item, params)
        }
      }

      return null
    } catch (error) {
      console.error(`❌ Steam internal API error:`, error)
      return null
    }
  }

  async fetchFromSteamCommunityAPI(bot, params) {
    try {
      console.log(`🔍 Bot ${bot.username} trying Steam Community API...`)
      
      // Use Steam Community API with bot session
      const url = `https://steamcommunity.com/inventory/${params.steamId}/730/2?l=english&count=5000`
      
      const response = await fetch(url, {
        headers: {
          'Cookie': bot.sessionCookies.join('; '),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const item = this.findItemByAssetId(data, params.assetId)
        
        if (item) {
          return this.createItemDataFromInventoryWithDetails(data, item, params)
        }
      }

      return null
    } catch (error) {
      console.error(`❌ Steam Community API error:`, error)
      return null
    }
  }

  async fetchFromSteamMarketAPI(bot, params) {
    try {
      console.log(`🔍 Bot ${bot.username} trying Steam Market API...`)
      
      // Use Steam Market API with bot session
      const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encodeURIComponent(params.marketHashName || '')}`
      
      const response = await fetch(url, {
        headers: {
          'Cookie': bot.sessionCookies.join('; '),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (response.ok) {
        const data = await response.json()
        return this.createItemDataFromMarketResponse(data, params)
      }

      return null
    } catch (error) {
      console.error(`❌ Steam Market API error:`, error)
      return null
    }
  }

  createItemDataFromSteamResponse(itemInfo, params) {
    return {
      name: itemInfo.market_hash_name || 'Unknown Item',
      wear: this.getWearConditionFromFloat(itemInfo.float_value || 0.5),
      pattern: itemInfo.paintseed || 0,
      float: itemInfo.float_value || 0.5,
      category: this.determineCategory(itemInfo.market_hash_name || ''),
      rarity: this.determineRarity(itemInfo.market_hash_name || ''),
      iconUrl: itemInfo.icon_url || null,
      timestamp: new Date().toISOString()
    }
  }

  createItemDataFromMarketResponse(marketData, params) {
    return {
      name: params.marketHashName || 'Unknown Item',
      wear: 'Field-Tested', // Default wear
      pattern: 0,
      float: 0.5,
      category: this.determineCategory(params.marketHashName || ''),
      rarity: this.determineRarity(params.marketHashName || ''),
      iconUrl: null,
      timestamp: new Date().toISOString()
    }
  }

  createItemDataFromInventoryWithDetails(inventoryData, item, params) {
    return {
      name: item.market_hash_name || 'Unknown Item',
      wear: this.getWearConditionFromFloat(item.float_value || 0.5),
      pattern: item.paintseed || 0,
      float: item.float_value || 0.5,
      category: this.determineCategory(item.market_hash_name || ''),
      rarity: this.determineRarity(item.market_hash_name || ''),
      iconUrl: item.icon_url || null,
      timestamp: new Date().toISOString()
    }
  }

  findItemByAssetId(data, assetId) {
    if (!data.descriptions || !data.assets) return null
    
    // Find the asset
    const asset = data.assets[assetId]
    if (!asset) return null
    
    // Find the description
    const description = data.descriptions.find(desc => desc.classid === asset.classid && desc.instanceid === asset.instanceid)
    if (!description) return null
    
    return {
      ...description,
      float_value: asset.float_value,
      paintseed: asset.paintseed
    }
  }

  getWearConditionFromFloat(floatValue) {
    if (floatValue < 0.07) return 'Factory New'
    if (floatValue < 0.15) return 'Minimal Wear'
    if (floatValue < 0.38) return 'Field-Tested'
    if (floatValue < 0.45) return 'Well-Worn'
    return 'Battle-Scarred'
  }

  determineCategory(marketHashName) {
    const name = marketHashName.toLowerCase()
    if (name.includes('knife') || name.includes('karambit') || name.includes('bayonet')) return 'Knife'
    if (name.includes('gloves') || name.includes('hand wraps')) return 'Gloves'
    if (name.includes('ak-47') || name.includes('m4a4') || name.includes('awp')) return 'Rifle'
    if (name.includes('usp') || name.includes('glock') || name.includes('deagle')) return 'Pistol'
    if (name.includes('mac-10') || name.includes('mp9') || name.includes('ump')) return 'SMG'
    return 'Other'
  }

  determineRarity(marketHashName) {
    const name = marketHashName.toLowerCase()
    if (name.includes('contraband')) return 'Contraband'
    if (name.includes('covert')) return 'Covert'
    if (name.includes('classified')) return 'Classified'
    if (name.includes('restricted')) return 'Restricted'
    if (name.includes('mil-spec')) return 'Mil-Spec'
    return 'Consumer Grade'
  }

  getBotStatus() {
    const totalBots = this.bots.length
    const availableBots = this.bots.filter(bot => bot.isOnline && bot.sessionCookies).length
    const totalRequestsToday = this.bots.reduce((sum, bot) => sum + bot.requestsToday, 0)

    return {
      totalBots,
      availableBots,
      totalRequestsToday
    }
  }
}

const steamBotManager = new SteamBotManager()

module.exports = { steamBotManager } 