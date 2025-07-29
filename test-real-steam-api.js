const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testRealSteamAPI() {
  console.log('🧪 Testing Real Steam API Integration...\n')

  try {
    // Test with the user's specific inspect link
    const testInspectLink = 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview S76561198320430286A44803380965D4631504492215634113'
    
    console.log('🔗 Testing with inspect link:', testInspectLink)
    console.log('Expected item: MAC-10 BRONZER\n')

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
      
      // Check if we got the expected item
      if (data.name.toLowerCase().includes('mac-10') || data.name.toLowerCase().includes('bronzer')) {
        console.log('\n🎉 SUCCESS: Got the expected MAC-10 BRONZER!')
      } else {
        console.log('\n⚠️  WARNING: Got different item than expected')
        console.log('   Expected: MAC-10 BRONZER')
        console.log(`   Got: ${data.name}`)
      }
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

testRealSteamAPI() 