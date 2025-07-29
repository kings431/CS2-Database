require('dotenv').config()

async function testAppIntegration() {
  console.log('🧪 Testing Application Integration with Steam Bot\n')

  try {
    const testInspectLink = 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview S76561198320430286A44803380965D4631504492215634113'
    console.log('🔗 Testing with inspect link:', testInspectLink)
    console.log('Expected item: MAC-10 BRONZER\n')

    console.log('📡 Calling your application API...')
    const response = await fetch('http://localhost:3000/api/screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspectLink: testInspectLink }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log('\n✅ SUCCESS: Application API response:')
      console.log(`   Name: ${data.name}`)
      console.log(`   Wear: ${data.wear}`)
      console.log(`   Pattern: ${data.pattern}`)
      console.log(`   Has Image: ${data.imageUrl ? '✅ Yes' : '❌ No'}`)
      console.log(`   Timestamp: ${data.timestamp}`)
      
      if (data.name.toLowerCase().includes('mac-10') || data.name.toLowerCase().includes('bronzer')) {
        console.log('\n🎉 PERFECT: Got the expected MAC-10 BRONZER from your app!')
        console.log('✅ Steam bot integration is working!')
      } else {
        console.log('\n⚠️  Got different item than expected')
        console.log('   Expected: MAC-10 BRONZER')
        console.log(`   Got: ${data.name}`)
        console.log('   This might be using fallback data')
      }
    } else {
      console.log('❌ Application API failed:', response.status)
      const error = await response.text()
      console.log('Error:', error)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n💡 Make sure your application is running with: npm run dev')
  }
}

testAppIntegration() 