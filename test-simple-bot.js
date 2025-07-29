require('dotenv').config()
const { steamBotManager } = require('./lib/steam-bots-simple.js')

async function testSimpleBot() {
  console.log('🧪 Testing Simple Steam Bot System...\n')

  try {
    console.log('🤖 Initializing Steam bot system...')
    await steamBotManager.initialize()
    
    const status = steamBotManager.getBotStatus()
    console.log('📊 Bot Status:', status)
    
    const testInspectLink = 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview S76561198320430286A44803380965D4631504492215634113'
    console.log('\n🔗 Testing with inspect link:', testInspectLink)
    console.log('Expected item: MAC-10 BRONZER\n')
    
    const params = extractInspectLinkParams(testInspectLink)
    if (!params) {
      console.log('❌ Failed to parse inspect link')
      return
    }
    
    console.log('📋 Parsed parameters:', params)
    
    const bot = steamBotManager.getNextAvailableBot()
    if (!bot) {
      console.log('❌ No available Steam bots')
      return
    }
    
    console.log(`🤖 Using bot: ${bot.username}`)
    console.log(`🍪 Has session cookies: ${bot.sessionCookies ? 'Yes' : 'No'}`)
    
    console.log('\n🔍 Fetching item data with Steam bot...')
    const itemData = await steamBotManager.fetchItemDataWithBot(bot, params)
    
    if (itemData) {
      console.log('\n✅ SUCCESS: Got real item data from Steam bot!')
      console.log('📋 Item Details:')
      console.log(`   Name: ${itemData.name}`)
      console.log(`   Wear: ${itemData.wear}`)
      console.log(`   Pattern: ${itemData.pattern}`)
      console.log(`   Float: ${itemData.float}`)
      console.log(`   Category: ${itemData.category}`)
      console.log(`   Rarity: ${itemData.rarity}`)
      console.log(`   Has Icon: ${itemData.iconUrl ? '✅ Yes' : '❌ No'}`)
      
      if (itemData.name.toLowerCase().includes('mac-10') || itemData.name.toLowerCase().includes('bronzer')) {
        console.log('\n🎉 PERFECT: Got the expected MAC-10 BRONZER!')
      } else {
        console.log('\n⚠️  Got different item than expected')
        console.log('   Expected: MAC-10 BRONZER')
        console.log(`   Got: ${itemData.name}`)
      }
    } else {
      console.log('\n❌ Failed to get item data from Steam bot')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

function extractInspectLinkParams(inspectLink) {
  try {
    // Extract the parameter string from the inspect link
    const match = inspectLink.match(/\+csgo_econ_action_preview\s+(.+)$/)
    if (!match) return null
    
    const paramString = match[1]
    console.log('Decoded link:', inspectLink)
    console.log('Parameter string:', paramString)
    
    // Parse the parameter string (format: S{steamId}A{assetId}D{someHash})
    const steamIdMatch = paramString.match(/S(\d+)/)
    const assetIdMatch = paramString.match(/A(\d+)/)
    const dMatch = paramString.match(/D(\d+)/)
    
    if (!steamIdMatch || !assetIdMatch) return null
    
    const params = {
      steamId: steamIdMatch[1],
      assetId: assetIdMatch[1],
      d: dMatch ? dMatch[1] : null
    }
    
    console.log('Parsed parameters:', params)
    return params
    
  } catch (error) {
    console.error('Error parsing inspect link:', error)
    return null
  }
}

testSimpleBot() 