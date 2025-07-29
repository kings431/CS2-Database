require('dotenv').config()
const SteamUser = require('steam-user')
const SteamTotp = require('steam-totp')

console.log('🔐 Testing Steam Login with Steam Guard\n')

const client = new SteamUser()

// Get credentials from environment
const username = process.env.STEAM_BOT_1_USERNAME
const password = process.env.STEAM_BOT_1_PASSWORD
const sharedSecret = process.env.STEAM_BOT_1_SHARED_SECRET

console.log('📋 Credentials:')
console.log(`   Username: ${username}`)
console.log(`   Password: ${password ? 'SET' : 'NOT SET'}`)
console.log(`   Shared Secret: ${sharedSecret ? 'SET' : 'NOT SET'}`)

if (!username || !password || !sharedSecret) {
  console.log('❌ Missing credentials in .env file')
  process.exit(1)
}

console.log('\n🔐 Attempting Steam login with Steam Guard...')

client.logOn({
  accountName: username,
  password: password,
  twoFactorCode: SteamTotp.generateAuthCode(sharedSecret)
})

client.on('loggedOn', () => {
  console.log('✅ SUCCESS: Logged into Steam with Steam Guard!')
  console.log(`   Steam ID: ${client.steamID}`)
  console.log(`   Account Name: ${client.accountName}`)
  client.logOff()
  process.exit(0)
})

client.on('error', (err) => {
  console.log('❌ Steam login error:', err.message)
  process.exit(1)
})

// Timeout after 15 seconds
setTimeout(() => {
  console.log('⏰ Timeout: Login attempt took too long')
  process.exit(1)
}, 15000) 