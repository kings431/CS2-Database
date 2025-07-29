const express = require('express')
const cors = require('cors')
const { steamBotHandler } = require('./steam-bot-handler')

const app = express()
const PORT = 3002

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Steam bot on startup
let botInitialized = false

async function initializeBot() {
  if (!botInitialized) {
    console.log('🚀 Starting Steam bot server...')
    const success = await steamBotHandler.initialize()
    botInitialized = success
    if (success) {
      console.log('✅ Steam bot server ready!')
    } else {
      console.log('❌ Steam bot server failed to initialize')
    }
  }
  return botInitialized
}

// Health check endpoint
app.get('/health', (req, res) => {
  const status = steamBotHandler.getStatus()
  res.json({
    server: 'running',
    bot: status,
    timestamp: new Date().toISOString()
  })
})

// Main endpoint for fetching item data
app.post('/api/fetch-item', async (req, res) => {
  try {
    const { params } = req.body
    
    if (!params) {
      return res.status(400).json({ error: 'Missing params' })
    }

    // Ensure bot is initialized
    const botReady = await initializeBot()
    if (!botReady) {
      return res.status(503).json({ 
        error: 'Steam bot not available',
        fallback: true 
      })
    }

    console.log('🔍 Fetching item data for params:', params)
    
    // Try to fetch real item data from Steam
    const itemData = await steamBotHandler.fetchItemData(params)
    
    if (itemData) {
      console.log('✅ Successfully fetched real item data:', itemData.name)
      res.json({
        success: true,
        data: itemData,
        source: 'steam_bot'
      })
    } else {
      console.log('❌ Failed to fetch item data from Steam bot')
      res.json({
        success: false,
        error: 'No data available',
        fallback: true
      })
    }

  } catch (error) {
    console.error('❌ Steam bot server error:', error)
    res.status(500).json({
      error: error.message,
      fallback: true
    })
  }
})

// Initialize bot and start server
initializeBot().then(() => {
  app.listen(PORT, () => {
    console.log(`🤖 Steam bot server running on http://localhost:${PORT}`)
    console.log(`📊 Health check: http://localhost:${PORT}/health`)
  })
}).catch(error => {
  console.error('❌ Failed to start Steam bot server:', error)
  process.exit(1)
}) 