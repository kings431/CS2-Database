const { PrismaClient } = require('@prisma/client')

async function testScraperSetup() {
  console.log('🧪 Testing CS2 Scraper Setup...\n')

  const prisma = new PrismaClient()

  try {
    // Test database connection
    console.log('1. Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully\n')

    // Test schema access
    console.log('2. Testing database schema...')
    const itemCount = await prisma.item.count()
    console.log(`✅ Found ${itemCount} items in database\n`)

    // Test sample query
    console.log('3. Testing sample query...')
    const sampleItems = await prisma.item.findMany({
      take: 3,
      select: {
        name: true,
        marketHashName: true,
        steamPrice: true,
        lastUpdated: true
      }
    })
    
    console.log('✅ Sample items:')
    sampleItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} - $${item.steamPrice || 'N/A'}`)
    })
    console.log()

    // Test environment
    console.log('4. Testing environment...')
    console.log(`✅ DATABASE_URL: ${process.env.DATABASE_URL || 'Not set'}`)
    console.log(`✅ NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`)
    console.log()

    console.log('🎉 All tests passed! Scraper setup is ready.')
    console.log('\n📋 Next steps:')
    console.log('   1. cd scrapers/steam-scraper')
    console.log('   2. npm install')
    console.log('   3. cp env.example .env')
    console.log('   4. Edit .env with your database URL')
    console.log('   5. npm run build')
    console.log('   6. npm start')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('   1. Ensure the main app database exists')
    console.log('   2. Check DATABASE_URL in environment')
    console.log('   3. Run "npx prisma generate" in main app')
  } finally {
    await prisma.$disconnect()
  }
}

testScraperSetup() 