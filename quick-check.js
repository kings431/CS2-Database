const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function quickCheck() {
  try {
    const totalItems = await prisma.item.count()
    const itemsWithPrices = await prisma.item.count({
      where: { steamPrice: { not: null } }
    })
    const recentItems = await prisma.item.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
        }
      }
    })
    
    console.log('=== CS2 Database Status ===')
    console.log(`Total Items: ${totalItems}`)
    console.log(`Items with Prices: ${itemsWithPrices}`)
    console.log(`Items Added (Last 10 min): ${recentItems}`)
    
    if (recentItems > 0) {
      console.log('✅ Scraper is actively working!')
    } else {
      console.log('⏳ Scraper may be idle or processing...')
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

quickCheck() 