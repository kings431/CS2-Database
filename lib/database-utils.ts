import { prisma } from './prisma'

export interface SkinFilter {
  searchTerm?: string
  sortBy?: string
  minWear?: number
  maxWear?: number
  selectedWear?: string
  statTrak?: boolean
  souvenir?: boolean
  normal?: boolean
  paintSeed?: string
  selectedRarity?: string
  selectedCollection?: string
  selectedSource?: string
  minAge?: number
  maxAge?: number
  minPrice?: number
  maxPrice?: number
  stickers?: string[]
  stickerSlots?: string[]
  charm?: string
}

interface WhereClause {
  OR?: Array<{
    name?: { contains: string }
    weapon?: { contains: string }
    skin?: { contains: string }
    collection?: { contains: string }
  }>
  float?: {
    gte?: number
    lte?: number
  }
  wear?: string
  isStatTrak?: boolean
  isSouvenir?: boolean
  isNormal?: boolean
  pattern?: number
  rarity?: string
  collection?: string
  source?: string
  age?: {
    gte?: string
    lte?: string
  }
  stickers?: {
    some: {
      OR: Array<{ name: { contains: string } }>
    }
  }
  charms?: {
    some: {
      name: { contains: string }
    }
  }
}

export async function getFilteredSkins(filters: SkinFilter) {
  const where: WhereClause = {}

  // Search term
  if (filters.searchTerm) {
    where.OR = [
      { name: { contains: filters.searchTerm } },
      { weapon: { contains: filters.searchTerm } },
      { skin: { contains: filters.searchTerm } },
      { collection: { contains: filters.searchTerm } }
    ]
  }

  // Wear filter
  if (filters.minWear !== undefined || filters.maxWear !== undefined) {
    where.float = {}
    if (filters.minWear !== undefined) where.float.gte = filters.minWear
    if (filters.maxWear !== undefined) where.float.lte = filters.maxWear
  }

  // Wear condition
  if (filters.selectedWear && filters.selectedWear !== 'Any') {
    where.wear = filters.selectedWear
  }

  // Special properties
  if (filters.statTrak !== undefined) where.isStatTrak = filters.statTrak
  if (filters.souvenir !== undefined) where.isSouvenir = filters.souvenir
  if (filters.normal !== undefined) where.isNormal = filters.normal

  // Pattern
  if (filters.paintSeed) {
    where.pattern = parseInt(filters.paintSeed)
  }

  // Rarity
  if (filters.selectedRarity && filters.selectedRarity !== 'Any') {
    where.rarity = filters.selectedRarity
  }

  // Collection
  if (filters.selectedCollection && filters.selectedCollection !== 'Any') {
    where.collection = filters.selectedCollection
  }

  // Source
  if (filters.selectedSource && filters.selectedSource !== 'Any') {
    where.source = filters.selectedSource
  }

  // Age
  if (filters.minAge !== undefined || filters.maxAge !== undefined) {
    where.age = {}
    if (filters.minAge !== undefined) where.age.gte = filters.minAge.toString()
    if (filters.maxAge !== undefined) where.age.lte = filters.maxAge.toString()
  }

  // Price - This is a complex query that needs special handling
  // For now, we'll use a simpler approach
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    // This would need to be implemented with a more complex query
    // For now, we'll skip price filtering to avoid the complex OR logic
  }

  // Stickers
  if (filters.stickers && filters.stickers.some(s => s.trim() !== '')) {
    where.stickers = {
      some: {
        OR: filters.stickers
          .filter(s => s.trim() !== '')
          .map(sticker => ({ name: { contains: sticker } }))
      }
    }
  }

  // Charm
  if (filters.charm) {
    where.charms = {
      some: {
        name: { contains: filters.charm }
      }
    }
  }

  // Sort order
  const orderBy: Record<string, 'asc' | 'desc'> = {}
  switch (filters.sortBy) {
    case 'Low Float':
      orderBy.float = 'asc'
      break
    case 'High Float':
      orderBy.float = 'desc'
      break
    case 'Price Low to High':
      orderBy.steamPrice = 'asc'
      break
    case 'Price High to Low':
      orderBy.steamPrice = 'desc'
      break
    case 'Name A-Z':
      orderBy.name = 'asc'
      break
    case 'Name Z-A':
      orderBy.name = 'desc'
      break
    default:
      orderBy.float = 'asc'
  }

  return await prisma.item.findMany({
    where,
    orderBy,
    include: {
      stickers: true,
      charms: true
    }
  })
}

export async function seedSampleData() {
  const sampleSkins = [
    {
      name: '★ Karambit Vanilla',
      marketHashName: '★ Karambit Vanilla',
      rarity: 'Covert',
      category: 'knife',
      weapon: 'Karambit',
      skin: 'Vanilla',
      collection: 'The 2018 Inferno Collection',
      source: 'Case',
      float: 0.00000000000000,
      wear: 'FN',
      pattern: 0,
      isStatTrak: false,
      isSouvenir: false,
      isNormal: true,
      age: "120",
      steamPrice: 15000.00,
      buffPrice: 14500.00,
      csMoneyPrice: 14800.00,
      bitskinsPrice: 15200.00
    },
    {
      name: 'MAC-10 Bronzer',
      marketHashName: 'MAC-10 | Bronzer',
      rarity: 'Classified',
      category: 'weapon',
      weapon: 'MAC-10',
      skin: 'Bronzer',
      collection: 'The 2021 Dust 2 Collection',
      source: 'Case',
      float: 0.00000000000000,
      wear: 'FN',
      pattern: 673,
      isStatTrak: true,
      isSouvenir: false,
      isNormal: false,
      age: "90",
      steamPrice: 13000.00,
      buffPrice: 12800.00,
      csMoneyPrice: 12900.00,
      bitskinsPrice: 13100.00
    },
    {
      name: 'AUG Eye of Zapems',
      marketHashName: 'AUG | Eye of Zapems',
      rarity: 'Restricted',
      category: 'weapon',
      weapon: 'AUG',
      skin: 'Eye of Zapems',
      collection: 'The 2018 Nuke Collection',
      source: 'Case',
      float: 0.00000000000000,
      wear: 'FN',
      pattern: 0,
      isStatTrak: false,
      isSouvenir: false,
      isNormal: true,
      age: "150",
      steamPrice: 9000.00,
      buffPrice: 8800.00,
      csMoneyPrice: 8900.00,
      bitskinsPrice: 9100.00
    }
  ]

  for (const skin of sampleSkins) {
    await prisma.item.upsert({
      where: { marketHashName: skin.marketHashName },
      update: skin,
      create: skin
    })
  }

  console.log('Sample data seeded successfully!')
}

export async function getFilterOptions() {
  const [rarities, collections, sources, weapons] = await Promise.all([
    prisma.item.findMany({
      select: { rarity: true },
      distinct: ['rarity']
    }),
    prisma.item.findMany({
      select: { collection: true },
      distinct: ['collection'],
      where: { collection: { not: null } }
    }),
    prisma.item.findMany({
      select: { source: true },
      distinct: ['source'],
      where: { source: { not: null } }
    }),
    prisma.item.findMany({
      select: { weapon: true },
      distinct: ['weapon'],
      where: { weapon: { not: null } }
    })
  ])

  return {
    rarities: rarities.map(r => r.rarity),
    collections: collections.map(c => c.collection),
    sources: sources.map(s => s.source),
    weapons: weapons.map(w => w.weapon)
  }
} 