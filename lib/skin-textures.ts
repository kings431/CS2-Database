// Skin texture management system
export interface SkinData {
  defindex: number;
  paintindex: number;
  paintseed: number;
  float: number;
  uuid: string;
}

export interface PatternData {
  paintseed: number;
  uuid: string;
  title: string;
}

export interface FloatData {
  float: number;
  uuid: string;
}

// CSMoney API endpoints
const CSMONEY_API_BASE = 'https://3d.cs.money/api';

// Weapon definitions mapping
const WEAPON_DEFINITIONS = {
  ak47: { defindex: 508, paintindex: 577 }, // AK-47 | Redline
  m4a4: { defindex: 509, paintindex: 578 }, // M4A4 | Howl
  awp: { defindex: 510, paintindex: 579 }, // AWP | Dragon Lore
  knife_karambit: { defindex: 511, paintindex: 580 }, // Karambit | Fade
  knife_m9: { defindex: 512, paintindex: 581 }, // M9 Bayonet | Marble Fade
};

// Generate texture URL based on skin data
export function generateSkinTextureUrl(skinData: SkinData): string {
  // For now, we'll use placeholder textures
  // In production, this would fetch from CSMoney's CDN or Steam's CDN
  const { defindex, paintindex, paintseed, float } = skinData;
  
  // Example texture URL pattern (this would need to be implemented with real CDN)
  return `https://cdn.cs.money/skins/${defindex}_${paintindex}_${paintseed}_${Math.floor(float * 1000)}.png`;
}

// Fetch pattern list from CSMoney API
export async function fetchPatternList(defindex: number, paintindex: number, wear: string): Promise<PatternData[]> {
  try {
    const response = await fetch(
      `${CSMONEY_API_BASE}/skin/patternlist?defindex=${defindex}&paintindex=${paintindex}&wear_name=${wear}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pattern list: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching pattern list:', error);
    return [];
  }
}

// Fetch float list from CSMoney API
export async function fetchFloatList(defindex: number, paintindex: number): Promise<FloatData[]> {
  try {
    const response = await fetch(
      `${CSMONEY_API_BASE}/skin/floatlist?defindex=${defindex}&paintindex=${paintindex}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch float list: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching float list:', error);
    return [];
  }
}

// Generate skin data for a weapon
export function generateSkinData(weaponType: string, skinName: string, float: number): SkinData {
  const weaponDef = WEAPON_DEFINITIONS[weaponType as keyof typeof WEAPON_DEFINITIONS];
  
  if (!weaponDef) {
    // Fallback for unknown weapons
    return {
      defindex: 508,
      paintindex: 577,
      paintseed: Math.floor(Math.random() * 1000),
      float: float,
      uuid: `fallback_${Date.now()}`
    };
  }
  
  // Generate paintseed based on skin name (simplified)
  const paintseed = skinName.length * 13 + skinName.charCodeAt(0);
  
  return {
    defindex: weaponDef.defindex,
    paintindex: weaponDef.paintindex,
    paintseed: paintseed,
    float: float,
    uuid: `${weaponType}_${skinName}_${paintseed}`
  };
}

// Create a procedural texture for testing
export function createProceduralTexture(skinData: SkinData): string {
  const { paintseed, float } = skinData;
  
  // Create a canvas-based texture
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // Generate procedural pattern based on paintseed
  const pattern = paintseed % 4;
  const wear = float;
  
  // Base color
  ctx.fillStyle = `hsl(${paintseed % 360}, 70%, 50%)`;
  ctx.fillRect(0, 0, 512, 512);
  
  // Add wear effect
  if (wear > 0.3) {
    ctx.fillStyle = `rgba(139, 69, 19, ${wear * 0.8})`;
    ctx.fillRect(0, 0, 512, 512);
  }
  
  // Add pattern based on paintseed
  switch (pattern) {
    case 0: // Stripes
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = `hsl(${(paintseed + i * 30) % 360}, 60%, 40%)`;
        ctx.fillRect(i * 50, 0, 30, 512);
      }
      break;
    case 1: // Dots
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillStyle = `hsl(${(paintseed + i * j) % 360}, 80%, 60%)`;
            ctx.beginPath();
            ctx.arc(i * 25, j * 25, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      break;
    case 2: // Gradient
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, `hsl(${paintseed % 360}, 70%, 50%)`);
      gradient.addColorStop(1, `hsl(${(paintseed + 60) % 360}, 70%, 30%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      break;
    case 3: // Geometric
      ctx.fillStyle = `hsl(${(paintseed + 120) % 360}, 60%, 40%)`;
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(i * 64, i * 64, 64, 64);
      }
      break;
  }
  
  return canvas.toDataURL();
}

// Load texture from URL or create procedural
export async function loadSkinTexture(skinData: SkinData): Promise<string> {
  try {
    // Try to load from CSMoney CDN first
    const textureUrl = generateSkinTextureUrl(skinData);
    
    // For now, create procedural texture
    // In production, you'd fetch the actual texture from CDN
    return createProceduralTexture(skinData);
  } catch (error) {
    console.error('Error loading skin texture:', error);
    // Fallback to procedural texture
    return createProceduralTexture(skinData);
  }
} 