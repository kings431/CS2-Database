const crypto = require('crypto')

// Your encrypted Steam Guard data
const encryptedData = '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'

function decryptSteamGuardData(encryptedData) {
  try {
    console.log('🔐 Decrypting Steam Guard data...')
    
    // The data is base64 encoded, so decode it first
    const decodedData = Buffer.from(encryptedData, 'base64')
    console.log('📋 Decoded data length:', decodedData.length, 'bytes')
    
    // Steam Guard data is typically encrypted with a device-specific key
    // For now, let's try to extract what we can from the raw data
    console.log('🔍 Analyzing encrypted data structure...')
    
    // Try to find patterns that might indicate the structure
    const hexData = decodedData.toString('hex')
    console.log('🔍 First 100 characters of hex data:', hexData.substring(0, 100))
    
    // Steam Guard data usually contains JSON-like structures
    // Let's try to find readable strings in the data
    const readableStrings = []
    let currentString = ''
    
    for (let i = 0; i < decodedData.length; i++) {
      const byte = decodedData[i]
      if (byte >= 32 && byte <= 126) { // Printable ASCII
        currentString += String.fromCharCode(byte)
      } else {
        if (currentString.length > 3) {
          readableStrings.push(currentString)
        }
        currentString = ''
      }
    }
    
    if (currentString.length > 3) {
      readableStrings.push(currentString)
    }
    
    console.log('📋 Found readable strings:')
    readableStrings.forEach((str, index) => {
      console.log(`   ${index + 1}: "${str}"`)
    })
    
    // Try to extract potential secrets (32+ character strings)
    const potentialSecrets = readableStrings.filter(str => str.length >= 32)
    console.log('\n🔑 Potential secrets found:')
    potentialSecrets.forEach((secret, index) => {
      console.log(`   Secret ${index + 1}: ${secret}`)
    })
    
    return {
      decodedData: decodedData,
      readableStrings: readableStrings,
      potentialSecrets: potentialSecrets
    }
    
  } catch (error) {
    console.error('❌ Error decrypting Steam Guard data:', error)
    return null
  }
}

function extractSecretsFromData(data) {
  console.log('\n🔍 Attempting to extract Steam Guard secrets...')
  
  // Steam Guard secrets are typically:
  // - shared_secret: 40 character base32 string
  // - identity_secret: 40 character base32 string
  
  const base32Pattern = /[A-Z2-7]{40}/g
  const base64Pattern = /[A-Za-z0-9+/]{40,}/g
  
  const allStrings = data.readableStrings.join(' ')
  
  console.log('🔍 Looking for base32 patterns (shared_secret)...')
  const base32Matches = allStrings.match(base32Pattern)
  if (base32Matches) {
    console.log('✅ Found potential shared_secret candidates:')
    base32Matches.forEach((match, index) => {
      console.log(`   ${index + 1}: ${match}`)
    })
  }
  
  console.log('🔍 Looking for base64 patterns (identity_secret)...')
  const base64Matches = allStrings.match(base64Pattern)
  if (base64Matches) {
    console.log('✅ Found potential identity_secret candidates:')
    base64Matches.forEach((match, index) => {
      console.log(`   ${index + 1}: ${match}`)
    })
  }
  
  return {
    sharedSecret: base32Matches ? base32Matches[0] : null,
    identitySecret: base64Matches ? base64Matches[0] : null
  }
}

// Main execution
console.log('🧪 Steam Guard Data Decryption Tool\n')

const decryptedData = decryptSteamGuardData(encryptedData)

if (decryptedData) {
  const secrets = extractSecretsFromData(decryptedData)
  
  console.log('\n📋 Extraction Results:')
  console.log('=' * 50)
  
  if (secrets.sharedSecret) {
    console.log('✅ Shared Secret found:')
    console.log(`   ${secrets.sharedSecret}`)
  } else {
    console.log('❌ Shared Secret not found')
  }
  
  if (secrets.identitySecret) {
    console.log('✅ Identity Secret found:')
    console.log(`   ${secrets.identitySecret}`)
  } else {
    console.log('❌ Identity Secret not found')
  }
  
  console.log('\n📝 Next Steps:')
  console.log('1. If secrets were found, add them to your .env file:')
  console.log('   STEAM_BOT_1_SHARED_SECRET=your_shared_secret_here')
  console.log('   STEAM_BOT_1_IDENTITY_SECRET=your_identity_secret_here')
  console.log('2. If no secrets were found, you may need to use a different extraction method')
  console.log('3. Test the secrets with: node test-steam-bots.js')
  
} else {
  console.log('❌ Failed to decrypt Steam Guard data')
} 