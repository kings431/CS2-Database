const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function monitorScraper() {
  try {
    console.log('🔍 Monitoring CS2 Database Scraper Progress...\n')
    
    // Get total items count
    const totalItems = await prisma.item.count()
    console.log(`📊 Total Items in Database: ${totalItems}`)
    
    // Get items with prices
    const itemsWithPrices = await prisma.item.count({
      where: {
        steamPrice: {
          not: null
        }
      }
    })
    console.log(`💰 Items with Prices: ${itemsWithPrices}`)
    
    // Get items with images
    const itemsWithImages = await prisma.item.count({
      where: {
        iconUrl: {
          not: null
        }
      }
    })
    console.log(`🖼️  Items with Images: ${itemsWithImages}`)
    
    // Get items with inspect links
    const itemsWithInspectLinks = await prisma.item.count({
      where: {
        inspectLink: {
          not: null
        }
      }
    })
    console.log(`🔗 Items with Inspect Links: ${itemsWithInspectLinks}`)
    
    // Get recent items (last 10)
    const recentItems = await prisma.item.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        name: true,
        steamPrice: true,
        category: true,
        createdAt: true
      }
    })
    
    console.log('\n🆕 Recent Items Added:')
    recentItems.forEach((item, index) => {
      const timeAgo = new Date() - new Date(item.createdAt)
      const minutesAgo = Math.floor(timeAgo / 60000)
      console.log(`${index + 1}. ${item.name} - $${item.steamPrice || 'N/A'} (${item.category}) - ${minutesAgo} minutes ago`)
    })
    
    // Get items by category
    const categoryStats = await prisma.item.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    })
    
    console.log('\n📈 Items by Category:')
    categoryStats.forEach(stat => {
      console.log(`   ${stat.category}: ${stat._count.category} items`)
    })
    
    // Get average price
    const avgPrice = await prisma.item.aggregate({
      where: {
        steamPrice: {
          not: null
        }
      },
      _avg: {
        steamPrice: true
      }
    })
    
    console.log(`\n💵 Average Price: $${avgPrice._avg.steamPrice?.toFixed(2) || 'N/A'}`)
    
    // Check if scraper is actively adding items
    const lastHourItems = await prisma.item.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    })
    
    console.log(`\n⏰ Items Added in Last Hour: ${lastHourItems}`)
    
    if (lastHourItems > 0) {
      console.log('✅ Scraper is actively running and adding items!')
    } else {
      console.log('⚠️  No items added in the last hour. Scraper may be idle.')
    }
    
  } catch (error) {
    console.error('❌ Error monitoring scraper:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run monitoring
monitorScraper() 