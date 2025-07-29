require('dotenv').config()
const SteamUser = require('steam-user')

console.log('🔐 Testing Steam Login Credentials\n')

const client = new SteamUser()

// Get credentials from environment
const username = process.env.STEAM_BOT_1_USERNAME
const password = process.env.STEAM_BOT_1_PASSWORD

console.log('📋 Credentials:')
console.log(`   Username: ${username}`)
console.log(`   Password: ${password ? 'SET' : 'NOT SET'}`)

if (!username || !password) {
  console.log('❌ Missing username or password in .env file')
  process.exit(1)
}

console.log('\n🔐 Attempting Steam login...')

client.logOn({
  accountName: username,
  password: password
})

client.on('loggedOn', () => {
  console.log('✅ SUCCESS: Logged into Steam!')
  console.log(`   Steam ID: ${client.steamID}`)
  console.log(`   Account Name: ${client.accountName}`)
  client.logOff()
  process.exit(0)
})

client.on('error', (err) => {
  console.log('❌ Steam login error:', err.message)
  process.exit(1)
})

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Timeout: Login attempt took too long')
  process.exit(1)
}, 10000) 