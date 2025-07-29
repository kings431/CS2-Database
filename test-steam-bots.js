// Test script for Steam bot system
const { steamBotManager } = require('./lib/steam-bots.ts')

async function testSteamBots() {
  console.log('🧪 Testing Steam bot system...')
  
  try {
    // Initialize the bot system
    await steamBotManager.initialize()
    
    // Get bot status
    const status = steamBotManager.getBotStatus()
    console.log('📊 Bot status:', status)
    
    // Test with the inspect link
    const inspectLink = 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview S76561198320430286A44803380965D4631504492215634113'
    
    // Extract parameters
    const decodedLink = decodeURIComponent(inspectLink)
    let match = decodedLink.match(/\+csgo_econ_action_preview\s+(.+)$/)
    if (!match) {
      match = decodedLink.match(/\+csgo_econ_action_preview(.+)$/)
    }
    
    if (match) {
      const parameterString = match[1].trim()
      const paramMatch = parameterString.match(/S(\d+)A(\d+)D(\d+)/)
      
      if (paramMatch) {
        const [, steamId, assetId, d] = paramMatch
        const params = { steamId, assetId, d }
        
        console.log('📋 Extracted params:', params)
        
        // Get available bot
        const bot = steamBotManager.getNextAvailableBot()
        if (bot) {
          console.log(`🤖 Using bot: ${bot.username}`)
          
          // Try to fetch real item data
          const itemData = await steamBotManager.fetchItemDataWithBot(bot, params)
          if (itemData) {
            console.log('✅ Successfully fetched real item data:')
            console.log('Name:', itemData.name)
            console.log('Wear:', itemData.wear)
            console.log('Pattern:', itemData.pattern)
            console.log('Category:', itemData.category)
            console.log('Rarity:', itemData.rarity)
            console.log('Float:', itemData.float)
            console.log('Icon URL:', itemData.iconUrl ? 'Available' : 'Not available')
          } else {
            console.log('❌ Failed to fetch real item data')
          }
        } else {
          console.log('❌ No available bots')
        }
      } else {
        console.log('❌ Failed to parse parameters')
      }
    } else {
      console.log('❌ Failed to extract parameter string')
    }
    
  } catch (error) {
    console.error('❌ Steam bot test failed:', error)
  }
}

testSteamBots() 