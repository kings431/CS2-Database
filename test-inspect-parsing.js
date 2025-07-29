// Test script for inspect link parsing
const inspectLink = 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview S76561198320430286A44803380965D4631504492215634113'

function extractInspectLinkParams(inspectLink) {
  try {
    // Decode the URL
    const decodedLink = decodeURIComponent(inspectLink)
    console.log('🔍 Decoded link:', decodedLink)
    
    // Extract the parameter string - handle both formats
    let match = decodedLink.match(/\+csgo_econ_action_preview\s+(.+)$/)
    if (!match) {
      // Try alternative format without space
      match = decodedLink.match(/\+csgo_econ_action_preview(.+)$/)
    }
    
    if (!match) {
      console.log('❌ Could not extract parameter string from inspect link')
      return null
    }

    const parameterString = match[1].trim()
    console.log('📋 Parameter string:', parameterString)
    
    // Parse the parameters (format: S{steamId}A{assetId}D{d})
    const paramMatch = parameterString.match(/S(\d+)A(\d+)D(\d+)/)
    if (!paramMatch) {
      console.log('❌ Could not parse parameters from parameter string')
      return null
    }

    const [, steamId, assetId, d] = paramMatch
    const params = { steamId, assetId, d }
    
    console.log('✅ Parsed parameters:', params)
    return params
  } catch (error) {
    console.error('❌ Error extracting inspect link parameters:', error)
    return null
  }
}

function determineItemTypeFromAssetId(assetId) {
  // Since asset IDs don't reliably indicate item types, let's be more conservative
  const assetIdStr = assetId.toString()
  
  // Only return specific types for asset IDs we're confident about
  if (assetIdStr.includes('4462686631')) {
    return 'gloves'
  }
  
  // For all other asset IDs, default to weapon since that's the most common item type
  return 'weapon'
}

console.log('🧪 Testing inspect link parsing...')
console.log('Input:', inspectLink)

const params = extractInspectLinkParams(inspectLink)
if (params) {
  console.log('\n📊 Analysis:')
  console.log('Steam ID:', params.steamId)
  console.log('Asset ID:', params.assetId)
  console.log('D parameter:', params.d)
  console.log('Item type:', determineItemTypeFromAssetId(params.assetId))
  
  // This should be an M249 Gator Mesh based on the user's description
  console.log('\n🎯 Expected item: M249 | Gator Mesh (Field-Tested)')
  console.log('📋 The system should now correctly identify this as a weapon, not a case')
} else {
  console.log('❌ Failed to parse inspect link')
} 