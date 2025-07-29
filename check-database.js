const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database content...\n')
    
    // Count total items
    const totalItems = await prisma.item.count()
    console.log(`📊 Total items in database: ${totalItems}`)
    
    // Get recent items
    const recentItems = await prisma.item.findMany({
      take: 10,
      orderBy: { lastUpdated: 'desc' },
      select: {
        id: true,
        name: true,
        marketHashName: true,
        steamPrice: true,
        lastUpdated: true,
        isStatTrak: true,
        isSouvenir: true,
        isNormal: true
      }
    })
    
    console.log('\n🕒 Most recent items:')
    recentItems.forEach(item => {
      console.log(`  • ${item.name}`)
      console.log(`    Price: $${item.steamPrice || 'N/A'}`)
      console.log(`    Type: ${item.isStatTrak ? 'StatTrak' : item.isSouvenir ? 'Souvenir' : 'Normal'}`)
      console.log(`    Updated: ${item.lastUpdated}`)
      console.log('')
    })
    
    // Check price distribution
    const itemsWithPrices = await prisma.item.findMany({
      where: { steamPrice: { not: null } },
      select: { steamPrice: true }
    })
    
    console.log(`💰 Items with prices: ${itemsWithPrices.length}/${totalItems}`)
    
    if (itemsWithPrices.length > 0) {
      const prices = itemsWithPrices.map(item => item.steamPrice)
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
      const maxPrice = Math.max(...prices)
      const minPrice = Math.min(...prices)
      
      console.log(`   Average price: $${avgPrice.toFixed(2)}`)
      console.log(`   Price range: $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`)
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase() 