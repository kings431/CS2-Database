import { NextRequest, NextResponse } from 'next/server'
import { getFilteredSkins, getFilterOptions } from '@/lib/database-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      searchTerm: searchParams.get('searchTerm') || undefined,
      sortBy: searchParams.get('sortBy') || 'Low Float',
      minWear: searchParams.get('minWear') ? parseFloat(searchParams.get('minWear')!) : undefined,
      maxWear: searchParams.get('maxWear') ? parseFloat(searchParams.get('maxWear')!) : undefined,
      selectedWear: searchParams.get('selectedWear') || undefined,
      statTrak: searchParams.get('statTrak') === 'true',
      souvenir: searchParams.get('souvenir') === 'true',
      normal: searchParams.get('normal') === 'true',
      paintSeed: searchParams.get('paintSeed') || undefined,
      selectedRarity: searchParams.get('selectedRarity') || undefined,
      selectedCollection: searchParams.get('selectedCollection') || undefined,
      selectedSource: searchParams.get('selectedSource') || undefined,
      minAge: searchParams.get('minAge') ? parseInt(searchParams.get('minAge')!) : undefined,
      maxAge: searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')!) : undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      stickers: searchParams.getAll('stickers'),
      stickerSlots: searchParams.getAll('stickerSlots'),
      charm: searchParams.get('charm') || undefined
    }

    const skins = await getFilteredSkins(filters)
    
    return NextResponse.json({ 
      success: true, 
      data: skins,
      count: skins.length 
    })
  } catch (error) {
    console.error('Error fetching skins:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skins' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'getFilterOptions') {
      const options = await getFilterOptions()
      return NextResponse.json({ success: true, data: options })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in database API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 