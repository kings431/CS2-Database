require('dotenv').config()

console.log('🧪 Testing Environment Variables\n')

// Check if environment variables are loaded
console.log('📋 Environment Variables:')
console.log(`   STEAM_BOT_1_USERNAME: ${process.env.STEAM_BOT_1_USERNAME || 'NOT SET'}`)
console.log(`   STEAM_BOT_1_PASSWORD: ${process.env.STEAM_BOT_1_PASSWORD ? 'SET (hidden)' : 'NOT SET'}`)
console.log(`   STEAM_BOT_1_SHARED_SECRET: ${process.env.STEAM_BOT_1_SHARED_SECRET || 'NOT SET'}`)
console.log(`   STEAM_BOT_1_IDENTITY_SECRET: ${process.env.STEAM_BOT_1_IDENTITY_SECRET || 'NOT SET'}`)

console.log('\n🔍 Secret Details:')
if (process.env.STEAM_BOT_1_SHARED_SECRET) {
  console.log(`   Shared Secret Length: ${process.env.STEAM_BOT_1_SHARED_SECRET.length} characters`)
  console.log(`   Shared Secret Format: ${process.env.STEAM_BOT_1_SHARED_SECRET}`)
}

if (process.env.STEAM_BOT_1_IDENTITY_SECRET) {
  console.log(`   Identity Secret Length: ${process.env.STEAM_BOT_1_IDENTITY_SECRET.length} characters`)
  console.log(`   Identity Secret Format: ${process.env.STEAM_BOT_1_IDENTITY_SECRET}`)
}

console.log('\n💡 Expected Format:')
console.log('   - Shared Secret: 40-character base32 string (A-Z, 2-7)')
console.log('   - Identity Secret: 40-character base32 string (A-Z, 2-7)')
console.log('   - Example: ABCDEFGHIJKLMNOPQRSTUVWXYZ234567')

// Test if the secrets look like base64
if (process.env.STEAM_BOT_1_SHARED_SECRET && process.env.STEAM_BOT_1_SHARED_SECRET.includes('=')) {
  console.log('\n⚠️  WARNING: Shared secret contains "=" which suggests base64 encoding')
  console.log('   Steam Guard secrets should be base32, not base64')
}

if (process.env.STEAM_BOT_1_IDENTITY_SECRET && process.env.STEAM_BOT_1_IDENTITY_SECRET.includes('=')) {
  console.log('\n⚠️  WARNING: Identity secret contains "=" which suggests base64 encoding')
  console.log('   Steam Guard secrets should be base32, not base64')
} 