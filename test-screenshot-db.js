const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testScreenshotDatabase() {
  console.log('🧪 Testing Screenshot Database Integration...\n')
  
  try {
    // Check if we have items in the database
    const itemCount = await prisma.item.count()
    console.log(`📊 Total items in database: ${itemCount}`)
    
    if (itemCount === 0) {
      console.log('❌ No items found in database. Please run the scraper first.')
      return
    }
    
    // Get some sample items
    const sampleItems = await prisma.item.findMany({
      where: {
        name: { not: '' },
        wear: { not: '' },
        pattern: { not: null }
      },
      take: 5,
      orderBy: {
        lastUpdated: 'desc'
      }
    })
    
    console.log('\n🎯 Sample items from database:')
    sampleItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`)
      console.log(`   Wear: ${item.wear}`)
      console.log(`   Pattern: ${item.pattern}`)
      console.log(`   Category: ${item.category}`)
      console.log(`   Rarity: ${item.rarity}`)
      console.log(`   Has Icon: ${item.iconUrl ? '✅ Yes' : '❌ No'}`)
      console.log('')
    })
    
    // Test the screenshot API endpoint
    console.log('🔗 Testing screenshot API endpoint...')
    
    const testInspectLink = 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198093714585A44626866315D13835460595494074492'
    
    const response = await fetch('http://localhost:3000/api/screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspectLink: testInspectLink }),
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Screenshot API response:')
      console.log(`   Name: ${data.name}`)
      console.log(`   Wear: ${data.wear}`)
      console.log(`   Pattern: ${data.pattern}`)
      console.log(`   Has Image: ${data.imageUrl ? '✅ Yes' : '❌ No'}`)
      console.log(`   Timestamp: ${data.timestamp}`)
    } else {
      console.log('❌ Screenshot API failed:', response.status)
      const error = await response.text()
      console.log('Error:', error)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testScreenshotDatabase() 