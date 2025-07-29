const fs = require('fs')
const path = require('path')
const os = require('os')

console.log('🔍 Searching for Steam Desktop Authenticator data...\n')

// Common locations where Steam Desktop Authenticator stores data
const searchPaths = [
  // Windows - AppData
  path.join(os.homedir(), 'AppData', 'Roaming', 'Steam Desktop Authenticator'),
  path.join(os.homedir(), 'AppData', 'Local', 'Steam Desktop Authenticator'),
  path.join(os.homedir(), 'AppData', 'Roaming', 'SDA'),
  path.join(os.homedir(), 'AppData', 'Local', 'SDA'),
  
  // Windows - Program Files
  'C:\\Program Files\\Steam Desktop Authenticator',
  'C:\\Program Files (x86)\\Steam Desktop Authenticator',
  
  // Current directory and subdirectories
  './',
  './Steam Desktop Authenticator',
  './SDA',
  
  // Desktop
  path.join(os.homedir(), 'Desktop', 'Steam Desktop Authenticator'),
  path.join(os.homedir(), 'Desktop', 'SDA'),
]

function searchForMaFiles(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      return []
    }
    
    const files = fs.readdirSync(dirPath)
    const maFiles = []
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        // Recursively search subdirectories
        const subFiles = searchForMaFiles(fullPath)
        maFiles.push(...subFiles)
      } else if (file.endsWith('.maFile') || file.endsWith('.json')) {
        maFiles.push(fullPath)
      }
    }
    
    return maFiles
  } catch (error) {
    return []
  }
}

function readAndParseFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    console.log(`📄 Found file: ${filePath}`)
    console.log(`📋 File size: ${content.length} characters`)
    
    // Try to parse as JSON
    try {
      const jsonData = JSON.parse(content)
      console.log('✅ Successfully parsed as JSON')
      
      // Look for Steam Guard secrets
      if (jsonData.shared_secret) {
        console.log(`🔑 Shared Secret: ${jsonData.shared_secret}`)
      }
      if (jsonData.identity_secret) {
        console.log(`🔑 Identity Secret: ${jsonData.identity_secret}`)
      }
      if (jsonData.account_name) {
        console.log(`👤 Account Name: ${jsonData.account_name}`)
      }
      if (jsonData.device_id) {
        console.log(`📱 Device ID: ${jsonData.device_id}`)
      }
      
      return jsonData
    } catch (parseError) {
      console.log('❌ Not valid JSON, showing first 200 characters:')
      console.log(content.substring(0, 200))
    }
    
    console.log('---')
  } catch (error) {
    console.log(`❌ Error reading file: ${error.message}`)
  }
  
  return null
}

// Search all paths
let foundFiles = []
for (const searchPath of searchPaths) {
  console.log(`🔍 Searching: ${searchPath}`)
  const files = searchForMaFiles(searchPath)
  foundFiles.push(...files)
}

// Remove duplicates
foundFiles = [...new Set(foundFiles)]

console.log(`\n📋 Found ${foundFiles.length} potential files:`)

if (foundFiles.length === 0) {
  console.log('❌ No .maFile or .json files found in common locations')
  console.log('\n💡 Try these manual steps:')
  console.log('1. Look in the Steam Desktop Authenticator folder where you extracted it')
  console.log('2. Check if there\'s a "maFiles" or "accounts" subfolder')
  console.log('3. Look for files ending in .maFile or .json')
} else {
  console.log('\n📄 Analyzing found files:')
  
  for (const file of foundFiles) {
    console.log(`\n🔍 Analyzing: ${file}`)
    const data = readAndParseFile(file)
    
    if (data && (data.shared_secret || data.identity_secret)) {
      console.log('\n🎉 SUCCESS! Found Steam Guard secrets!')
      console.log('📝 Add these to your .env file:')
      console.log(`STEAM_BOT_1_USERNAME=${data.account_name || 'cs2db1'}`)
      console.log(`STEAM_BOT_1_SHARED_SECRET=${data.shared_secret}`)
      console.log(`STEAM_BOT_1_IDENTITY_SECRET=${data.identity_secret}`)
      console.log(`STEAM_BOT_1_DEVICE_ID=${data.device_id || ''}`)
      break
    }
  }
}

console.log('\n💡 If no secrets were found, try:')
console.log('1. In Steam Desktop Authenticator, go to File → Export Account')
console.log('2. Or check the folder where you extracted Steam Desktop Authenticator')
console.log('3. Look for a "maFiles" folder with .maFile files') 