const fs = require('fs')
const path = require('path')
const os = require('os')

console.log('🔍 Targeted Steam Desktop Authenticator Search\n')

// More specific search paths for Steam Desktop Authenticator
const specificPaths = [
  // Common Steam Desktop Authenticator locations
  path.join(os.homedir(), 'AppData', 'Roaming', 'Steam Desktop Authenticator'),
  path.join(os.homedir(), 'AppData', 'Local', 'Steam Desktop Authenticator'),
  path.join(os.homedir(), 'AppData', 'Roaming', 'SDA'),
  path.join(os.homedir(), 'AppData', 'Local', 'SDA'),
  
  // Desktop locations
  path.join(os.homedir(), 'Desktop', 'Steam Desktop Authenticator'),
  path.join(os.homedir(), 'Desktop', 'SDA'),
  
  // Downloads locations
  path.join(os.homedir(), 'Downloads', 'Steam Desktop Authenticator'),
  path.join(os.homedir(), 'Downloads', 'SDA'),
  
  // Program Files
  'C:\\Program Files\\Steam Desktop Authenticator',
  'C:\\Program Files (x86)\\Steam Desktop Authenticator',
  
  // Current directory and immediate subdirectories
  './',
  './Steam Desktop Authenticator',
  './SDA',
]

function searchForSteamAuthFiles(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      return { found: false, reason: 'Directory does not exist' }
    }
    
    console.log(`📁 Checking: ${dirPath}`)
    
    const items = fs.readdirSync(dirPath)
    const results = {
      found: false,
      maFiles: [],
      jsonFiles: [],
      folders: [],
      reason: 'No Steam Auth files found'
    }
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        results.folders.push(item)
        
        // Check if this looks like a Steam Auth folder
        if (item.toLowerCase().includes('mafile') || 
            item.toLowerCase().includes('account') ||
            item.toLowerCase().includes('steam')) {
          console.log(`  📁 Found potential Steam Auth folder: ${item}`)
        }
      } else if (item.endsWith('.maFile')) {
        results.maFiles.push(fullPath)
        console.log(`  📄 Found .maFile: ${item}`)
      } else if (item.endsWith('.json')) {
        results.jsonFiles.push(fullPath)
        console.log(`  📄 Found .json: ${item}`)
      }
    }
    
    if (results.maFiles.length > 0 || results.jsonFiles.length > 0) {
      results.found = true
      results.reason = `Found ${results.maFiles.length} .maFile(s) and ${results.jsonFiles.length} .json file(s)`
    }
    
    return results
    
  } catch (error) {
    return { found: false, reason: `Error: ${error.message}` }
  }
}

function analyzeSteamAuthFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    console.log(`\n🔍 Analyzing: ${path.basename(filePath)}`)
    console.log(`   Size: ${content.length} characters`)
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(content)
      
      // Check for Steam Guard specific fields
      const hasSharedSecret = data.shared_secret || data.sharedSecret
      const hasIdentitySecret = data.identity_secret || data.identitySecret
      const hasAccountName = data.account_name || data.accountName
      const hasDeviceId = data.device_id || data.deviceId
      
      if (hasSharedSecret || hasIdentitySecret) {
        console.log('✅ FOUND STEAM GUARD SECRETS!')
        console.log('📋 Account Details:')
        if (hasAccountName) console.log(`   Account: ${data.account_name || data.accountName}`)
        if (hasSharedSecret) console.log(`   Shared Secret: ${data.shared_secret || data.sharedSecret}`)
        if (hasIdentitySecret) console.log(`   Identity Secret: ${data.identity_secret || data.identitySecret}`)
        if (hasDeviceId) console.log(`   Device ID: ${data.device_id || data.deviceId}`)
        
        console.log('\n🎉 SUCCESS! Add these to your .env file:')
        console.log(`STEAM_BOT_1_USERNAME=${data.account_name || data.accountName || 'cs2db1'}`)
        console.log(`STEAM_BOT_1_SHARED_SECRET=${data.shared_secret || data.sharedSecret}`)
        console.log(`STEAM_BOT_1_IDENTITY_SECRET=${data.identity_secret || data.identitySecret}`)
        console.log(`STEAM_BOT_1_DEVICE_ID=${data.device_id || data.deviceId || ''}`)
        
        return true
      } else {
        console.log('❌ No Steam Guard secrets found in this file')
        console.log('   Available fields:', Object.keys(data).join(', '))
      }
    } catch (parseError) {
      console.log('❌ Not valid JSON')
      console.log('   First 100 chars:', content.substring(0, 100))
    }
    
  } catch (error) {
    console.log(`❌ Error reading file: ${error.message}`)
  }
  
  return false
}

// Search all specific paths
console.log('🔍 Searching for Steam Desktop Authenticator data...\n')

let foundSecrets = false

for (const searchPath of specificPaths) {
  const result = searchForSteamAuthFiles(searchPath)
  
  if (result.found) {
    console.log(`\n✅ Found potential Steam Auth files in: ${searchPath}`)
    console.log(`   ${result.reason}`)
    
    // Analyze .maFile files first (these are most likely to contain secrets)
    for (const maFile of result.maFiles) {
      if (analyzeSteamAuthFile(maFile)) {
        foundSecrets = true
        break
      }
    }
    
    // If no secrets found in .maFile, check .json files
    if (!foundSecrets) {
      for (const jsonFile of result.jsonFiles) {
        if (analyzeSteamAuthFile(jsonFile)) {
          foundSecrets = true
          break
        }
      }
    }
    
    if (foundSecrets) break
  }
}

if (!foundSecrets) {
  console.log('\n❌ No Steam Guard secrets found in common locations')
  console.log('\n💡 Manual Steps:')
  console.log('1. In Steam Desktop Authenticator, try:')
  console.log('   - File → Export Account')
  console.log('   - Right-click on account → Export')
  console.log('   - Look for "Export" or "Save" options')
  console.log('2. Check the folder where you extracted Steam Desktop Authenticator')
  console.log('3. Look for a "maFiles" folder')
  console.log('4. Look for files ending in .maFile or .json')
  console.log('5. The file should contain "shared_secret" and "identity_secret" fields')
} 