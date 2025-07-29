const { PrismaClient } = require('@prisma/client')
const SteamUser = require('steam-user')
const SteamTotp = require('steam-totp')
const SteamCommunity = require('steamcommunity')

const prisma = new PrismaClient()

class SteamBotHandler {
  constructor() {
    this.client = null
    this.community = null
    this.sessionCookies = null
    this.isInitialized = false
  }

  async initialize() {
    if (this.isInitialized) return true

    console.log('🤖 Initializing Steam bot handler...')
    
    try {
      await this.authenticateBot()
      console.log('✅ Steam bot authenticated successfully')
      this.isInitialized = true
      return true
    } catch (error) {
      console.log('❌ Steam bot authentication failed:', error.message)
      this.isInitialized = false
      return false
    }
  }

  async authenticateBot() {
    return new Promise((resolve, reject) => {
      try {
        // Create Steam client
        this.client = new SteamUser()

        // Get credentials from environment
        const username = process.env.STEAM_BOT_1_USERNAME
        const password = process.env.STEAM_BOT_1_PASSWORD
        const sharedSecret = process.env.STEAM_BOT_1_SHARED_SECRET

        if (!username || !password || !sharedSecret) {
          reject(new Error('Missing Steam bot credentials in environment variables'))
          return
        }

        // Generate Steam Guard code
        const steamGuardCode = SteamTotp.generateAuthCode(sharedSecret)

        // Set up event handlers
        this.client.on('loggedOn', () => {
          console.log('✅ Bot logged on to Steam')
          
          // Set up Steam Community
          this.community = new SteamCommunity()
          
          // Get web session cookies with timeout
          const webLogOnTimeout = setTimeout(() => {
            console.log('⚠️ Web logon timeout, proceeding without session cookies')
            this.sessionCookies = []
            resolve()
          }, 10000) // 10 second timeout
          
          this.client.webLogOn((sessionID, cookies) => {
            clearTimeout(webLogOnTimeout)
            this.sessionCookies = cookies
            console.log('✅ Bot web session established')
            resolve()
          })
        })

        this.client.on('error', (error) => {
          console.error('❌ Bot error:', error)
          reject(error)
        })

        this.client.on('steamGuard', (domain, callback) => {
          console.log('🔐 Bot Steam Guard required')
          // Use the shared secret to generate the code
          const code = SteamTotp.generateAuthCode(sharedSecret)
          callback(code)
        })

        // Log on to Steam
        this.client.logOn({
          accountName: username,
          password: password,
          twoFactorCode: steamGuardCode
        })

        // Add overall timeout
        setTimeout(() => {
          reject(new Error('Steam bot authentication timeout'))
        }, 30000) // 30 second timeout

      } catch (error) {
        console.error('❌ Bot authentication error:', error)
        reject(error)
      }
    })
  }

  async fetchItemData(params) {
    if (!this.isInitialized || !this.sessionCookies) {
      console.log('❌ Bot not initialized or no session cookies')
      return null
    }

    try {
      console.log('🤖 Using Steam bot to fetch item data')
      
      // Try Steam's internal item details API with authenticated session
      const itemData = await this.fetchFromSteamInternalAPI(params)
      if (itemData) {
        console.log('✅ Bot successfully fetched real item data')
        return itemData
      }

      // Try Steam Community API with bot session
      const communityData = await this.fetchFromSteamCommunityAPI(params)
      if (communityData) {
        console.log('✅ Bot successfully fetched community data')
        return communityData
      }

      console.log('❌ Bot failed to fetch item data from all sources')
      return null

    } catch (error) {
      console.error('❌ Bot fetch error:', error)
      return null
    }
  }

  async fetchFromSteamInternalAPI(params) {
    try {
      console.log('🔍 Bot trying Steam internal API...')
      
      // Use the bot's authenticated session to fetch item details
      const url = `https://steamcommunity.com/inventory/${params.steamId}/730/2?l=english&count=5000`
      
      const response = await fetch(url, {
        headers: {
          'Cookie': this.sessionCookies.join('; '),
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
      console.error('❌ Steam internal API error:', error)
      return null
    }
  }

  async fetchFromSteamCommunityAPI(params) {
    try {
      console.log('🔍 Bot trying Steam Community API...')
      
      // Use Steam Community API with bot session
      const url = `https://steamcommunity.com/inventory/${params.steamId}/730/2?l=english&count=5000`
      
      const response = await fetch(url, {
        headers: {
          'Cookie': this.sessionCookies.join('; '),
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
      console.error('❌ Steam Community API error:', error)
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
      inspectLink: `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${params.steamId}A${params.assetId}D${params.d}`,
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
      inspectLink: `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${params.steamId}A${params.assetId}D${params.d}`,
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

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasSessionCookies: !!this.sessionCookies
    }
  }
}

// Create singleton instance
const steamBotHandler = new SteamBotHandler()

// Export for use in API routes
module.exports = { steamBotHandler } 