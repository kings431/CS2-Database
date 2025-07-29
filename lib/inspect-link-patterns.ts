interface InspectLinkPattern {
  pattern: string
  name: string
  category: string
  rarity: string
  defaultWear: string
  defaultPattern: number
}

// Known inspect link patterns for common items
// This is now used for dynamic pattern matching based on asset ID ranges
const INSPECT_LINK_PATTERNS: InspectLinkPattern[] = [
  // Add patterns here if needed for specific asset ID ranges
  // For now, we use dynamic detection based on asset ID patterns
]

export function findItemByInspectLink(inspectLink: string): InspectLinkPattern | null {
  // Extract the parameter string from the inspect link
  const match = inspectLink.match(/\+csgo_econ_action_preview\s+(.+)$/)
  if (!match) return null
  
  const paramString = match[1]
  
  // Look for exact pattern match
  const exactMatch = INSPECT_LINK_PATTERNS.find(pattern => 
    paramString.includes(pattern.pattern)
  )
  
  if (exactMatch) {
    return exactMatch
  }
  
  // Look for partial pattern matches
  const partialMatch = INSPECT_LINK_PATTERNS.find(pattern => 
    paramString.includes(pattern.pattern.substring(0, 10)) // First 10 characters
  )
  
  return partialMatch || null
}

export function getItemFromPattern(inspectLink: string) {
  const pattern = findItemByInspectLink(inspectLink)
  
  if (pattern) {
    return {
      name: pattern.name,
      wear: pattern.defaultWear,
      pattern: pattern.defaultPattern,
      category: pattern.category,
      rarity: pattern.rarity,
      iconUrl: undefined, // Will be fetched separately
      inspectLink: inspectLink,
      float: 0.5 // Default float
    }
  }
  
  return null
} 