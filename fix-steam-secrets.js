console.log('🔐 Converting Steam Guard Secrets from Base64 to Base32\n')

// Your base64 encoded secrets
const base64SharedSecret = 'OIwqCOqo4SX3SzMVO9IxvReLvjk='
const base64IdentitySecret = 'jiNC1fJZFSnSWmBHWSdL4mq8sJ0='

// Base32 alphabet
const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base64ToBase32(base64String) {
  try {
    // Decode base64 to buffer
    const buffer = Buffer.from(base64String, 'base64')
    
    // Convert to base32 manually
    let bits = 0
    let value = 0
    let result = ''
    
    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i]
      bits += 8
      
      while (bits >= 5) {
        result += base32Alphabet[(value >>> (bits - 5)) & 31]
        bits -= 5
      }
    }
    
    // Handle remaining bits
    if (bits > 0) {
      result += base32Alphabet[(value << (5 - bits)) & 31]
    }
    
    console.log(`📋 Original base64: ${base64String}`)
    console.log(`📋 Converted base32: ${result}`)
    console.log(`📋 Length: ${result.length} characters`)
    
    return result
  } catch (error) {
    console.error(`❌ Error converting: ${error.message}`)
    return null
  }
}

console.log('🔑 Converting Shared Secret:')
const convertedSharedSecret = base64ToBase32(base64SharedSecret)

console.log('\n🔑 Converting Identity Secret:')
const convertedIdentitySecret = base64ToBase32(base64IdentitySecret)

console.log('\n📝 Updated .env file content:')
console.log('=' * 50)
console.log('# Steam Bot Configuration')
console.log('STEAM_BOT_1_USERNAME=CS2DB1')
console.log('STEAM_BOT_1_PASSWORD=X8*Z;]f2bNt6')
console.log(`STEAM_BOT_1_SHARED_SECRET=${convertedSharedSecret}`)
console.log(`STEAM_BOT_1_IDENTITY_SECRET=${convertedIdentitySecret}`)

console.log('\n💡 Copy these values to your .env file')
console.log('   The secrets should now be 40-character base32 strings') 