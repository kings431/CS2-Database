// CS2 Skin Generator
// Uses real CS2 texture files from our codebase

export interface SkinProperties {
  baseColor: string;
  patternColor?: string;
  metallic: number;
  roughness: number;
  wear: number;
  paintIndex: number;
  paintSeed: number;
  defIndex: number;
  texturePattern?: string;
  textureNormal?: string;
  textureWear?: string;
  textureColor?: string;
  textureMetalness?: string;
}

export class SkinGenerator {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    // Only create canvas in browser environment
    if (typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1024;
      this.canvas.height = 1024;
      this.ctx = this.canvas.getContext('2d');
    }
  }

  // Generate a CS2-style skin based on the skin name, float, and pattern
  async generateSkin(skinName: string, float: number, patternSeed?: number): Promise<string> {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      console.warn('Not in browser environment, returning fallback texture');
      return this.getFallbackTexture(skinName);
    }
    
    // Ensure canvas is created
    if (!this.canvas || !this.ctx) {
      console.log('Creating canvas for skin generation');
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1024;
      this.canvas.height = 1024;
      this.ctx = this.canvas.getContext('2d');
      
      if (!this.ctx) {
        console.warn('Failed to get canvas context, returning fallback texture');
        return this.getFallbackTexture(skinName);
      }
    }
    
    console.log(`Generating skin: ${skinName} with float: ${float}, pattern: ${patternSeed}`);
    const properties = this.getSkinProperties(skinName, float, patternSeed);
    console.log('Skin properties:', properties);
    const result = await this.renderSkin(properties);
    console.log(`Generated skin data URL: ${result.substring(0, 100)}...`);
    return result;
  }

  private getFallbackTexture(skinName: string): string {
    // Return a simple data URL for fallback
    const properties = this.getSkinProperties(skinName, 0.15, 1);
    const color = properties.baseColor;
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.adjustColor(color, -20)};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
      </svg>
    `)}`;
  }

  private getSkinProperties(skinName: string, float: number, patternSeed?: number): SkinProperties {
    // CS2 weapon definitions (defindex)
    const WEAPON_DEFS = {
      'knife_karambit': 507,
      'knife_m9': 508,
      'ak47': 7,
      'm4a4': 16,
      'awp': 9
    };

    // CS2 paint indices (paintindex) for different skins
    const PAINT_INDICES = {
      'autotronic': 576,
      'black_laminate': 566,
      'lore': 570,
      'crimson_web': 12,
      'fade': 38,
      'marble_fade': 317,
      'doppler': 418,
      'tiger_tooth': 419,
      'case_hardened': 44,
      'damascus-steel': 410,
      'freehand': 323,
      'bright_water': 37,
      'stained': 67,
      'blue_steel': 60,
      'rust_coat': 12,
      'gamma_doppler': 569
    };

    // Map skin names to our actual texture files
    const TEXTURE_FILES = {
      // Karambit skins (we have these files)
      'autotronic': '/textures/skins/knife_karambit_autotronic.jpg',
      'black_laminate': '/textures/skins/knife_karambit_black_laminate.jpg',
      'lore': '/textures/skins/knife_karambit_lore.jpg',
      'crimson_web': '/textures/skins/knife_karambit_crimson_web.jpg',
      'case_hardened': '/textures/skins/knife_karambit_case_hardened.jpg',
      'tiger_tooth': '/textures/skins/knife_karambit_tiger_tooth.jpg',
      'damascus-steel': '/textures/skins/knife_karambit_damascus-steel.jpg',
      'freehand': '/textures/skins/knife_karambit_freehand.jpg',
      'bright_water': '/textures/skins/knife_karambit_bright_water.jpg',
      'stained': '/textures/skins/knife_karambit_stained.jpg',
      'blue_steel': '/textures/skins/knife_karambit_blue_steel.jpg',
      'rust_coat': '/textures/skins/knife_karambit_rust_coat.jpg',
      'gamma_doppler': '/textures/skins/knife_karambit_gamma_doppler.jpg',
      
      // AK47 skins (we have these files)
      'ak47_redline': '/textures/skins/ak47_redline.png',
      'ak47_asiimov': '/textures/skins/ak47_asiimov.svg',
      'ak47_vulcan': '/textures/skins/ak47_vulcan.svg',
      'ak47_fire_serpent': '/textures/skins/ak47_fire_serpent.svg',
      'ak47_dragon_lore': '/textures/skins/ak47_dragon_lore.svg',
      
      // AWP skins (we have these files)
      'awp_asiimov': '/textures/skins/awp_asiimov.svg',
      'awp_dragon_lore': '/textures/skins/awp_dragon_lore.svg',
      
      // M4A4 skins (we have these files)
      'm4a4_asiimov': '/textures/skins/m4a4_asiimov.svg',
      'm4a4_howl': '/textures/skins/m4a4_howl.svg',
      
      // Gloves (we have these files)
      'gloves_specialist_fade': '/textures/skins/gloves_specialist_fade.svg',
      'gloves_sport_ominous': '/textures/skins/gloves_sport_ominous.svg'
    };

    const baseProperties: { [key: string]: SkinProperties } = {
      // Real CS2 skins with actual texture files
      'autotronic': {
        baseColor: '#2F4F4F',
        patternColor: '#FF4500',
        metallic: 0.9,
        roughness: 0.1,
        wear: float,
        paintIndex: PAINT_INDICES.autotronic || 576,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.autotronic
      },
      'black_laminate': {
        baseColor: '#000000',
        patternColor: '#FFFFFF',
        metallic: 0.2,
        roughness: 0.8,
        wear: float,
        paintIndex: PAINT_INDICES.black_laminate || 566,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.black_laminate
      },
      'lore': {
        baseColor: '#8B4513',
        patternColor: '#DAA520',
        metallic: 0.4,
        roughness: 0.6,
        wear: float,
        paintIndex: PAINT_INDICES.lore || 570,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.lore
      },
      'crimson_web': {
        baseColor: '#8B0000',
        patternColor: '#FF0000',
        metallic: 0.3,
        roughness: 0.7,
        wear: float,
        paintIndex: PAINT_INDICES.crimson_web || 12,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.crimson_web
      },
      'case_hardened': {
        baseColor: '#4682B4',
        patternColor: '#FFD700',
        metallic: 0.6,
        roughness: 0.4,
        wear: float,
        paintIndex: PAINT_INDICES.case_hardened || 44,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.case_hardened
      },
      'tiger_tooth': {
        baseColor: '#FFD700',
        patternColor: '#FF8C00',
        metallic: 0.7,
        roughness: 0.3,
        wear: float,
        paintIndex: PAINT_INDICES.tiger_tooth || 419,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.tiger_tooth
      },
      'damascus-steel': {
        baseColor: '#4682B4',
        patternColor: '#FFD700',
        metallic: 0.8,
        roughness: 0.2,
        wear: float,
        paintIndex: PAINT_INDICES['damascus-steel'] || 410,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES['damascus-steel']
      },
      'freehand': {
        baseColor: '#FF6B35',
        patternColor: '#4A90E2',
        metallic: 0.5,
        roughness: 0.5,
        wear: float,
        paintIndex: PAINT_INDICES.freehand || 323,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.freehand
      },
      'bright_water': {
        baseColor: '#00CED1',
        patternColor: '#32CD32',
        metallic: 0.4,
        roughness: 0.6,
        wear: float,
        paintIndex: PAINT_INDICES.bright_water || 37,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.bright_water
      },
      'stained': {
        baseColor: '#8B4513',
        patternColor: '#DAA520',
        metallic: 0.3,
        roughness: 0.7,
        wear: float,
        paintIndex: PAINT_INDICES.stained || 67,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.stained
      },
      'blue_steel': {
        baseColor: '#4682B4',
        patternColor: '#87CEEB',
        metallic: 0.6,
        roughness: 0.4,
        wear: float,
        paintIndex: PAINT_INDICES.blue_steel || 60,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.blue_steel
      },
      'rust_coat': {
        baseColor: '#8B4513',
        patternColor: '#CD853F',
        metallic: 0.2,
        roughness: 0.8,
        wear: float,
        paintIndex: PAINT_INDICES.rust_coat || 12,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.rust_coat
      },
      'gamma_doppler': {
        baseColor: '#4A90E2',
        patternColor: '#FFD700',
        metallic: 0.95,
        roughness: 0.05,
        wear: float,
        paintIndex: PAINT_INDICES.gamma_doppler || 569,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.knife_karambit || 507,
        texturePattern: TEXTURE_FILES.gamma_doppler
      },
      
      // AK47 skins
      'ak47_redline': {
        baseColor: '#8B0000',
        patternColor: '#FF0000',
        metallic: 0.3,
        roughness: 0.7,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.ak47 || 7,
        texturePattern: TEXTURE_FILES.ak47_redline
      },
      'ak47_asiimov': {
        baseColor: '#FF6B35',
        patternColor: '#4A90E2',
        metallic: 0.5,
        roughness: 0.5,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.ak47 || 7,
        texturePattern: TEXTURE_FILES.ak47_asiimov
      },
      'ak47_vulcan': {
        baseColor: '#FF4500',
        patternColor: '#FFD700',
        metallic: 0.7,
        roughness: 0.3,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.ak47 || 7,
        texturePattern: TEXTURE_FILES.ak47_vulcan
      },
      'ak47_fire_serpent': {
        baseColor: '#FF8C00',
        patternColor: '#FFD700',
        metallic: 0.6,
        roughness: 0.4,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.ak47 || 7,
        texturePattern: TEXTURE_FILES.ak47_fire_serpent
      },
      'ak47_dragon_lore': {
        baseColor: '#8B4513',
        patternColor: '#DAA520',
        metallic: 0.4,
        roughness: 0.6,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.ak47 || 7,
        texturePattern: TEXTURE_FILES.ak47_dragon_lore
      },
      
      // AWP skins
      'awp_asiimov': {
        baseColor: '#FF6B35',
        patternColor: '#4A90E2',
        metallic: 0.5,
        roughness: 0.5,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.awp || 9,
        texturePattern: TEXTURE_FILES.awp_asiimov
      },
      'awp_dragon_lore': {
        baseColor: '#8B4513',
        patternColor: '#DAA520',
        metallic: 0.4,
        roughness: 0.6,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.awp || 9,
        texturePattern: TEXTURE_FILES.awp_dragon_lore
      },
      
      // M4A4 skins
      'm4a4_asiimov': {
        baseColor: '#FF6B35',
        patternColor: '#4A90E2',
        metallic: 0.5,
        roughness: 0.5,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.m4a4 || 16,
        texturePattern: TEXTURE_FILES.m4a4_asiimov
      },
      'm4a4_howl': {
        baseColor: '#FF4500',
        patternColor: '#FFD700',
        metallic: 0.7,
        roughness: 0.3,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: WEAPON_DEFS.m4a4 || 16,
        texturePattern: TEXTURE_FILES.m4a4_howl
      },
      
      // Gloves
      'gloves_specialist_fade': {
        baseColor: '#FF6B35',
        patternColor: '#4A90E2',
        metallic: 0.3,
        roughness: 0.7,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: 1,
        texturePattern: TEXTURE_FILES.gloves_specialist_fade
      },
      'gloves_sport_ominous': {
        baseColor: '#2F4F4F',
        patternColor: '#FF4500',
        metallic: 0.2,
        roughness: 0.8,
        wear: float,
        paintIndex: 1,
        paintSeed: patternSeed || 1,
        defIndex: 1,
        texturePattern: TEXTURE_FILES.gloves_sport_ominous
      }
    };

    return baseProperties[skinName] || {
      baseColor: '#808080',
      metallic: 0.5,
      roughness: 0.5,
      wear: float,
      paintIndex: 1,
      paintSeed: patternSeed || 1,
      defIndex: WEAPON_DEFS.knife_karambit || 507
    };
  }

  private async renderSkin(properties: SkinProperties): Promise<string> {
    if (!this.ctx || !this.canvas) {
      return this.getFallbackTexture('default');
    }

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    try {
      // For now, let's create a simple colored texture instead of loading files
      console.log('Creating simple texture for:', properties.texturePattern);
      this.createSimpleTexture(properties);
      console.log('Simple texture created successfully');

      // Apply wear based on float value
      this.applyWear(properties.wear);

      // Apply material properties
      this.applyMaterialProperties(properties.metallic, properties.roughness);

      const dataUrl = this.canvas.toDataURL();
      console.log('Generated skin data URL length:', dataUrl.length);
      return dataUrl;
    } catch (error) {
      console.warn('Failed to create texture, using fallback:', error);
      return this.getFallbackTexture('default');
    }
  }

  private createSimpleTexture(properties: SkinProperties): void {
    if (!this.ctx || !this.canvas) return;
    
    // Create a gradient based on the skin properties
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    
    // Use the base color from properties
    const baseColor = properties.baseColor;
    const patternColor = properties.patternColor || baseColor;
    
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(1, patternColor);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add some texture variation
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const radius = 2 + Math.random() * 8;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    console.log('Created simple texture with colors:', baseColor, 'to', patternColor);
  }

  private async loadTexture(texturePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        console.log('Image loaded successfully:', texturePath, 'dimensions:', img.width, 'x', img.height);
        if (this.ctx && this.canvas) {
          this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
          console.log('Image drawn to canvas');
        }
        resolve();
      };
      
      img.onerror = (error) => {
        console.error('Failed to load image:', texturePath, error);
        // Instead of rejecting, let's create a fallback texture
        console.log('Creating fallback texture for:', texturePath);
        this.createFallbackTexture(texturePath);
        resolve();
      };
      
      console.log('Attempting to load image from:', texturePath);
      img.src = texturePath;
    });
  }

  private createFallbackTexture(skinName: string): void {
    if (!this.ctx || !this.canvas) return;
    
    // Create a gradient based on the skin name
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    
    if (skinName.includes('blue_steel')) {
      gradient.addColorStop(0, '#4682B4');
      gradient.addColorStop(1, '#87CEEB');
    } else if (skinName.includes('crimson_web')) {
      gradient.addColorStop(0, '#8B0000');
      gradient.addColorStop(1, '#FF0000');
    } else if (skinName.includes('autotronic')) {
      gradient.addColorStop(0, '#2F4F4F');
      gradient.addColorStop(1, '#FF4500');
    } else if (skinName.includes('black_laminate')) {
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(1, '#FFFFFF');
    } else {
      gradient.addColorStop(0, '#808080');
      gradient.addColorStop(1, '#A0A0A0');
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    console.log('Created fallback texture for:', skinName);
  }

  private applyWear(wear: number) {
    if (!this.canvas || !this.ctx) return;
    
    // CS2 wear mechanics: higher float = more wear
    if (wear > 0.07) { // Factory New threshold
      // Add scratches and wear marks
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.lineWidth = 1;
      
      // More wear = more scratches
      const scratchCount = Math.floor(wear * 50);
      for (let i = 0; i < scratchCount; i++) {
        const x1 = Math.random() * this.canvas.width;
        const y1 = Math.random() * this.canvas.height;
        const x2 = x1 + (Math.random() - 0.5) * 200;
        const y2 = y1 + (Math.random() - 0.5) * 200;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }
    }
    
    if (wear > 0.15) { // Minimal Wear threshold
      // Add scuffs and abrasions
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let i = 0; i < wear * 30; i++) {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const radius = 2 + Math.random() * 8;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    
    if (wear > 0.38) { // Field-Tested threshold
      // Add more severe wear
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      this.ctx.lineWidth = 2;
      
      for (let i = 0; i < wear * 20; i++) {
        const x1 = Math.random() * this.canvas.width;
        const y1 = Math.random() * this.canvas.height;
        const x2 = x1 + (Math.random() - 0.5) * 300;
        const y2 = y1 + (Math.random() - 0.5) * 300;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }
    }
    
    if (wear > 0.45) { // Well-Worn threshold
      // Add rust and severe damage
      this.ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
      for (let i = 0; i < wear * 40; i++) {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const radius = 3 + Math.random() * 15;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  private applyMaterialProperties(metallic: number, roughness: number) {
    if (!this.canvas || !this.ctx) return;
    
    // Apply metallic and roughness effects
    if (metallic > 0.7) {
      // Add metallic shine
      const gradient = this.ctx.createRadialGradient(
        this.canvas.width / 2, this.canvas.height / 2, 0,
        this.canvas.width / 2, this.canvas.height / 2, 300
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private adjustColor(color: string, amount: number): string {
    // Simple color adjustment
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}

// Export singleton instance
export const skinGenerator = new SkinGenerator(); 