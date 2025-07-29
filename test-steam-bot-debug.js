require('dotenv').config()
const { steamBotHandler } = require('./scripts/steam-bot-handler')

async function debugSteamBot() {
  console.log('🔍 Debugging Steam Bot Authentication\n')
  
  // Check environment variables
  console.log('📋 Environment Variables:')
  console.log(`   STEAM_BOT_1_USERNAME: ${process.env.STEAM_BOT_1_USERNAME || 'NOT SET'}`)
  console.log(`   STEAM_BOT_1_PASSWORD: ${process.env.STEAM_BOT_1_PASSWORD ? 'SET (hidden)' : 'NOT SET'}`)
  console.log(`   STEAM_BOT_1_SHARED_SECRET: ${process.env.STEAM_BOT_1_SHARED_SECRET ? 'SET' : 'NOT SET'}`)
  
  if (!process.env.STEAM_BOT_1_USERNAME || !process.env.STEAM_BOT_1_PASSWORD || !process.env.STEAM_BOT_1_SHARED_SECRET) {
    console.log('\n❌ Missing required environment variables!')
    console.log('   Make sure your .env file has all the Steam bot credentials')
    return
  }
  
  console.log('\n🤖 Testing Steam bot initialization...')
  
  try {
    const success = await steamBotHandler.initialize()
    
    if (success) {
      console.log('✅ Steam bot initialized successfully!')
      
      const status = steamBotHandler.getStatus()
      console.log('📊 Bot Status:', status)
      
      // Test fetching item data
      console.log('\n🔍 Testing item data fetch...')
      const testParams = {
        steamId: '76561198320430286',
        assetId: '44803380965',
        d: '4631504492215634113'
      }
      
      const itemData = await steamBotHandler.fetchItemData(testParams)
      
      if (itemData) {
        console.log('✅ Successfully fetched item data:')
        console.log(`   Name: ${itemData.name}`)
        console.log(`   Wear: ${itemData.wear}`)
        console.log(`   Pattern: ${itemData.pattern}`)
        console.log(`   Float: ${itemData.float}`)
        console.log(`   Has Icon: ${itemData.iconUrl ? 'Yes' : 'No'}`)
      } else {
        console.log('❌ Failed to fetch item data')
      }
      
    } else {
      console.log('❌ Steam bot initialization failed!')
    }
    
  } catch (error) {
    console.error('❌ Error during Steam bot test:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

debugSteamBot() 