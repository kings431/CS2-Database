import { NextRequest, NextResponse } from 'next/server';
import { fetchPatternList, fetchFloatList, generateSkinData, type SkinData } from '../../../lib/skin-textures';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weaponType = searchParams.get('weapon');
    const skinName = searchParams.get('skin');
    const float = parseFloat(searchParams.get('float') || '0.15');
    const wear = searchParams.get('wear') || 'Field-Tested';

    if (!weaponType || !skinName) {
      return NextResponse.json({ error: 'Missing weapon or skin parameter' }, { status: 400 });
    }

    // Generate skin data
    const skinData = generateSkinData(weaponType, skinName, float);

    // Fetch pattern and float data from CSMoney
    const [patterns, floats] = await Promise.all([
      fetchPatternList(skinData.defindex, skinData.paintindex, wear),
      fetchFloatList(skinData.defindex, skinData.paintindex)
    ]);

    // Find closest matching pattern and float
    const closestPattern = patterns.find(p => p.paintseed === skinData.paintseed) || patterns[0];
    const closestFloat = floats.find(f => Math.abs(f.float - float) < 0.1) || floats[0];

    const response = {
      skinData: {
        ...skinData,
        paintseed: closestPattern?.paintseed || skinData.paintseed,
        float: closestFloat?.float || skinData.float,
        uuid: closestPattern?.uuid || skinData.uuid
      },
      patterns: patterns.slice(0, 10), // Limit to first 10 patterns
      floats: floats.slice(0, 10), // Limit to first 10 floats
      weaponType,
      skinName,
      wear
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching skin data:', error);
    return NextResponse.json({ error: 'Failed to fetch skin data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { weaponType, skinName, float = 0.15, wear = 'Field-Tested' } = await request.json();

    if (!weaponType || !skinName) {
      return NextResponse.json({ error: 'Missing weapon or skin parameter' }, { status: 400 });
    }

    // Generate skin data
    const skinData = generateSkinData(weaponType, skinName, float);

    // Fetch pattern and float data from CSMoney
    const [patterns, floats] = await Promise.all([
      fetchPatternList(skinData.defindex, skinData.paintindex, wear),
      fetchFloatList(skinData.defindex, skinData.paintindex)
    ]);

    // Find closest matching pattern and float
    const closestPattern = patterns.find(p => p.paintseed === skinData.paintseed) || patterns[0];
    const closestFloat = floats.find(f => Math.abs(f.float - float) < 0.1) || floats[0];

    const response = {
      skinData: {
        ...skinData,
        paintseed: closestPattern?.paintseed || skinData.paintseed,
        float: closestFloat?.float || skinData.float,
        uuid: closestPattern?.uuid || skinData.uuid
      },
      patterns: patterns.slice(0, 10), // Limit to first 10 patterns
      floats: floats.slice(0, 10), // Limit to first 10 floats
      weaponType,
      skinName,
      wear
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching skin data:', error);
    return NextResponse.json({ error: 'Failed to fetch skin data' }, { status: 500 });
  }
} 