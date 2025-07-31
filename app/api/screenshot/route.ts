import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { imageData, weaponType, skin, float, background, fov } = await request.json();
    
    // Remove data URL prefix to get base64 data
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${weaponType}_${skin}_${float}_${timestamp}.png`;
    
    // Ensure screenshots directory exists
    const screenshotsDir = join(process.cwd(), 'public', 'screenshots');
    if (!existsSync(screenshotsDir)) {
      await mkdir(screenshotsDir, { recursive: true });
    }
    
    // Save the image
    const filePath = join(screenshotsDir, filename);
    await writeFile(filePath, base64Data, 'base64');
    
    // Generate permalink
    const permalink = `/screenshots/${filename}`;
    
    // Return the permalink and metadata
    return NextResponse.json({
      success: true,
      permalink,
      metadata: {
        weaponType,
        skin,
        float,
        background,
        fov,
        timestamp
      }
    });
    
  } catch (error) {
    console.error('Screenshot generation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate screenshot' },
      { status: 500 }
    );
  }
} 