const crypto = require('crypto')

console.log('🔐 Decoding Steam Guard Secrets\n')

// Your base64 encoded secrets
const base64SharedSecret = 'OIwqCOqo4SX3SzMVO9IxvReLvjk='
const base64IdentitySecret = 'jiNC1fJZFSnSWmBHWSdL4mq8sJ0='

function decodeBase64Secret(base64String) {
  try {
    // Decode base64 to buffer
    const buffer = Buffer.from(base64String, 'base64')
    
    // Convert to base32 (Steam Guard format)
    const base32String = buffer.toString('base32').replace(/=/g, '')
    
    console.log(`📋 Original base64: ${base64String}`)
    console.log(`📋 Decoded base32: ${base32String}`)
    console.log(`📋 Length: ${base32String.length} characters`)
    
    return base32String
  } catch (error) {
    console.error(`❌ Error decoding: ${error.message}`)
    return null
  }
}

console.log('🔑 Decoding Shared Secret:')
const decodedSharedSecret = decodeBase64Secret(base64SharedSecret)

console.log('\n🔑 Decoding Identity Secret:')
const decodedIdentitySecret = decodeBase64Secret(base64IdentitySecret)

console.log('\n📝 Updated .env file content:')
console.log('=' * 50)
console.log('# Steam Bot Configuration')
console.log('STEAM_BOT_1_USERNAME=CS2DB1')
console.log('STEAM_BOT_1_PASSWORD=X8*Z;]f2bNt6')
console.log(`STEAM_BOT_1_SHARED_SECRET=${decodedSharedSecret}`)
console.log(`STEAM_BOT_1_IDENTITY_SECRET=${decodedIdentitySecret}`)

console.log('\n💡 Note: Steam Guard secrets should be 40-character base32 strings')
console.log('   If the decoded secrets are not 40 characters, they may need different decoding') 