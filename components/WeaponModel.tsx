import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { generateSkinData, loadSkinTexture, type SkinData } from '../lib/skin-textures';
import { skinGenerator } from '../lib/skin-generator';

interface WeaponModelProps {
  weaponType: string;
  skinPath?: string;
  float: number;
  stickers: (string | null)[];
  position?: [number, number, number];
  scale?: number;
}

// Fallback geometries for different weapon types
const WEAPON_GEOMETRIES = {
  rifle: new THREE.BoxGeometry(2.2, 0.15, 0.15),
  sniper: new THREE.BoxGeometry(2.8, 0.12, 0.12),
  pistol: new THREE.BoxGeometry(1.5, 0.12, 0.12),
  knife: new THREE.BoxGeometry(0.6, 0.08, 0.08),
  gloves: new THREE.BoxGeometry(0.8, 0.4, 0.3),
};

// Weapon-specific model paths
const WEAPON_MODELS = {
  ak47: '/models/weapons/ak47/weapon_rif_ak47.glb',
  m4a4: '/models/weapons/m4a4/m4a4_base.glb',
  awp: '/models/weapons/awp/awp_base.glb',
  knife_karambit: '/models/weapons/knives/karambit/weapon_knife_karambit.glb',
  knife_m9: '/models/weapons/knives/m9_bayonet/weapon_knife_m9.glb',
  gloves_sport: '/models/gloves/v_glove_hardknuckle.glb',
  gloves_specialist: '/models/gloves/v_glove_bloodhound.glb',
};

// PBR texture paths for different weapons
const PBR_TEXTURES: { [key: string]: { baseColor: string; roughness: string; normal?: string; metallic?: string; wearMask?: string } } = {
  knife_karambit: {
    baseColor: '/textures/skins/karambit/karam_color_psd_fd5024ca.png',
    roughness: '/textures/skins/karambit/karam_rough_psd_b223c31d.png',
    // Missing texture maps that we need:
    // normal: '/textures/skins/karambit/karam_normal.png',
    // metallic: '/textures/skins/karambit/karam_metallic.png',
    // wearMask: '/textures/wearmasks/knife_karambit_mask.png'
  },
  // Complete PBR set for Black Laminate
  knife_karambit_black_laminate: {
    baseColor: '/textures/skins/karambit/black_laminate/karambit_black_laminate_psd_c1f53dcb.png',
    normal: '/textures/skins/karambit/black_laminate/karambit_black_laminate_normal_psd_417a721a.png',
    roughness: '/textures/skins/karambit/black_laminate/karambit_black_laminate_rough_psd_2e010018.png'
  }
};

// Pattern definitions for different skins
const SKIN_PATTERNS = {
  'case_hardened': {
    name: 'Case Hardened',
    description: 'Pattern affects blue/gold ratio',
    minPattern: 1,
    maxPattern: 1000,
    defaultPattern: 1,
    // Pattern examples with blue percentages
    examples: [
      { pattern: 1, bluePercent: 15, rarity: 'common' },
      { pattern: 2, bluePercent: 25, rarity: 'common' },
      { pattern: 3, bluePercent: 35, rarity: 'uncommon' },
      { pattern: 4, bluePercent: 45, rarity: 'rare' },
      { pattern: 5, bluePercent: 55, rarity: 'rare' },
      { pattern: 6, bluePercent: 65, rarity: 'very rare' },
      { pattern: 7, bluePercent: 75, rarity: 'very rare' },
      { pattern: 8, bluePercent: 85, rarity: 'extremely rare' },
      { pattern: 9, bluePercent: 95, rarity: 'extremely rare' },
      { pattern: 10, bluePercent: 98, rarity: 'legendary' }
    ]
  },
  'fade': {
    name: 'Fade',
    description: 'Pattern affects fade gradient',
    minPattern: 1,
    maxPattern: 100,
    defaultPattern: 1
  },
  'marble_fade': {
    name: 'Marble Fade',
    description: 'Pattern affects marble pattern',
    minPattern: 1,
    maxPattern: 100,
    defaultPattern: 1
  },
  'doppler': {
    name: 'Doppler',
    description: 'Pattern affects color phase',
    minPattern: 1,
    maxPattern: 100,
    defaultPattern: 1
  },
  'gamma_doppler': {
    name: 'Gamma Doppler',
    description: 'Pattern affects gamma phase',
    minPattern: 1,
    maxPattern: 100,
    defaultPattern: 1
  }
};

// Wear mask patterns for different weapons
const WEAR_MASKS: { [key: string]: { path: string | null; wearAreas: Array<{ name: string; intensity: number; wearFactor: number }> } } = {
  knife_karambit: {
    path: null, // Will generate procedurally
    wearAreas: [
      { name: 'blade_edge', intensity: 0.8, wearFactor: 0.3 },
      { name: 'blade_spine', intensity: 0.6, wearFactor: 0.5 },
      { name: 'handle_grip', intensity: 0.9, wearFactor: 0.7 },
      { name: 'finger_ring', intensity: 0.7, wearFactor: 0.4 }
    ]
  },
  ak47: {
    path: '/textures/wearmasks/ak47_mask.png',
    wearAreas: [
      { name: 'barrel', intensity: 0.8, wearFactor: 0.3 },
      { name: 'receiver', intensity: 0.6, wearFactor: 0.5 },
      { name: 'stock', intensity: 0.9, wearFactor: 0.7 }
    ]
  }
};

// Skin texture mapping for Karambit - these are the actual CS2 skin files
const KARAMBIT_SKINS = {
  'crimson_web': '/textures/skins/karambit/knife_karambit_crimson_web.jpg',
  'stained': '/textures/skins/karambit/knife_karambit_stained.jpg',
  'case_hardened': '/textures/skins/karambit/knife_karambit_case_hardened.jpg',
  'blue_steel': '/textures/skins/karambit/knife_karambit_blue_steel.jpg',
  'tiger_tooth': '/textures/skins/karambit/knife_karambit_tiger_tooth.jpg',
  'rust_coat': '/textures/skins/karambit/knife_karambit_rust_coat.jpg',
  'damascus-steel': '/textures/skins/karambit/knife_karambit_damascus-steel.jpg',
  'gamma_doppler': '/textures/skins/karambit/knife_karambit_gamma_doppler.jpg',
  'autotronic': '/textures/skins/karambit/knife_karambit_autotronic.jpg',
  'lore': '/textures/skins/karambit/knife_karambit_lore.jpg',
  'freehand': '/textures/skins/karambit/knife_karambit_freehand.jpg',
  'bright_water': '/textures/skins/karambit/knife_karambit_bright_water.jpg',
  'black_laminate': '/textures/skins/karambit/knife_karambit_black_laminate.jpg',
};

// Glove texture mappings
const GLOVE_SKINS = {
  // Sport Gloves
  'sport_ominous': '/textures/skins/gloves_sport_ominous.svg',
  'sport_vice': '/textures/skins/gloves_sport_vice.svg',
  'sport_pandora': '/textures/skins/gloves_sport_pandora.svg',
  
  // Specialist Gloves
  'specialist_fade': '/textures/skins/gloves_specialist_fade.svg',
  'specialist_crimson_kimono': '/textures/skins/gloves_specialist_crimson_kimono.svg',
  'specialist_emerald_web': '/textures/skins/gloves_specialist_emerald_web.svg',
};

export const WeaponModel: React.FC<WeaponModelProps> = ({
  weaponType,
  skinPath,
  float,
  stickers,
  position = [0, 0, 0],
  scale = 1.0
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [materials, setMaterials] = useState<THREE.Material[]>([]);
  const [skinData, setSkinData] = useState<SkinData | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  // Determine weapon category for fallback geometry
  const getWeaponCategory = (type: string) => {
    if (type.includes('knife')) return 'knife';
    if (type.includes('gloves')) return 'gloves';
    if (type === 'awp') return 'sniper';
    if (['ak47', 'm4a4', 'm4a1'].includes(type)) return 'rifle';
    return 'rifle';
  };

  const weaponCategory = getWeaponCategory(weaponType);
  const fallbackGeometry = WEAPON_GEOMETRIES[weaponCategory as keyof typeof WEAPON_GEOMETRIES];

  // Load the GLB model using useGLTF hook - must be at top level
  const modelPath = WEAPON_MODELS[weaponType as keyof typeof WEAPON_MODELS];
  let gltf: any = null;

  if (modelPath) {
    console.log(`Loading model for ${weaponType}: ${modelPath}`);
    try {
      gltf = useGLTF(modelPath);
      console.log(`Successfully loaded GLB model for ${weaponType}:`, gltf);
    } catch (error) {
      console.error(`Failed to load GLB model for ${weaponType}:`, error);
      // Don't set modelLoaded to false here, let the fallback handle it
    }
  } else {
    console.warn(`No model path found for weapon type: ${weaponType}`);
  }

  // Set model as loaded if we have a valid GLTF, otherwise use fallback
  useEffect(() => {
    if (gltf && gltf.scene) {
      setModelLoaded(true);
      console.log(`Model loaded successfully for ${weaponType}`);
    } else {
      // Set a timeout to ensure we always show something
      const timeout = setTimeout(() => {
        setModelLoaded(false);
        console.log(`Using fallback geometry for ${weaponType} after timeout`);
      }, 2000); // 2 second timeout
      
      return () => clearTimeout(timeout);
    }
  }, [gltf, weaponType]);

  // Load PBR textures for Karambit
  useEffect(() => {
    if (weaponType === 'knife_karambit' && !texturesLoaded) {
      const textureLoader = new THREE.TextureLoader();
      
      // Check if we have a complete PBR set for the current skin
      const skinName = skinPath?.split('_')[0] || 'default';
      const pbrSetKey = `knife_karambit_${skinName}`;
      const pbrTextures = PBR_TEXTURES[pbrSetKey as keyof typeof PBR_TEXTURES];
      
      if (pbrTextures && pbrTextures.baseColor && pbrTextures.normal && pbrTextures.roughness) {
        // Load complete PBR set
        console.log('Loading complete PBR set for:', skinName);
        
        // Load base color texture (may contain alpha channel for wear mask)
        textureLoader.load(pbrTextures.baseColor, (baseColorTexture) => {
          baseColorTexture.flipY = false;
          baseColorTexture.generateMipmaps = true;
          
          // Load normal map
          textureLoader.load(pbrTextures.normal!, (normalTexture) => {
            normalTexture.flipY = false;
            normalTexture.generateMipmaps = true;
            
            // Load roughness map
            textureLoader.load(pbrTextures.roughness, (roughnessTexture) => {
              roughnessTexture.flipY = false;
              roughnessTexture.generateMipmaps = true;
              
              console.log('Complete PBR textures loaded for:', skinName);
              setTexturesLoaded(true);
              
              // Apply all textures to materials
              materials.forEach((material) => {
                if (material instanceof THREE.MeshStandardMaterial) {
                  material.map = baseColorTexture;
                  material.normalMap = normalTexture;
                  material.roughnessMap = roughnessTexture;
                  
                  // Set proper material properties for CS2-style rendering
                  material.metalness = 0.8;
                  material.roughness = 0.2;
                  material.envMapIntensity = 1.0;
                  
                  // Apply wear effects after loading textures (will extract alpha channel if present)
                  applyWearToMaterial(material, float);
                  
                  material.needsUpdate = true;
                }
              });
            });
          });
        });
      } else {
        // Fallback to basic PBR textures
        const pbrTextures = PBR_TEXTURES.knife_karambit;
        
        // Load base color texture (may contain alpha channel for wear mask)
        textureLoader.load(pbrTextures.baseColor, (baseColorTexture) => {
          baseColorTexture.flipY = false;
          baseColorTexture.generateMipmaps = true;
          
          // Load roughness texture
          textureLoader.load(pbrTextures.roughness, (roughnessTexture) => {
            roughnessTexture.flipY = false;
            roughnessTexture.generateMipmaps = true;
            
            console.log('Basic PBR textures loaded for Karambit');
            setTexturesLoaded(true);
            
            // Apply textures to materials
            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.map = baseColorTexture;
                material.roughnessMap = roughnessTexture;
                
                // Set default material properties for CS2-style rendering
                material.metalness = 0.8;
                material.roughness = 0.2;
                material.envMapIntensity = 1.0;
                
                // Apply wear effects after loading textures (will extract alpha channel if present)
                applyWearToMaterial(material, float);
                
                material.needsUpdate = true;
              }
            });
          });
        });
      }
    }
  }, [weaponType, materials, texturesLoaded, skinPath, float]);

  // Use an effect to handle the model loading result and create new materials
  useEffect(() => {
    console.log(`Model loading effect triggered - gltf: ${!!gltf}, gltf.scene: ${!!gltf?.scene}, weaponType: ${weaponType}`);
    
    if (gltf && gltf.scene) {
      setModelLoaded(true);
      const newMaterials: THREE.Material[] = [];
      
      console.log(`Processing ${weaponType} model with ${gltf.scene.children.length} children`);
      
      gltf.scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          console.log('Found mesh:', child.name, 'with geometry:', child.geometry.type);
          
          // Create a new PBR material for each mesh
          const material = new THREE.MeshStandardMaterial({
            color: 0x808080,
            metalness: 0.8,
            roughness: 0.2,
            envMapIntensity: 1.0
          });
          
          // Apply the new material to the mesh
          child.material = material;
          newMaterials.push(material);
          console.log('Created PBR material for mesh:', child.name);
        }
      });
      
      setMaterials(newMaterials);
      console.log(`Created ${newMaterials.length} PBR materials for ${weaponType} model`);
    } else {
      setModelLoaded(false);
      console.warn(`Failed to load GLB model for ${weaponType}, using fallback geometry.`);
      console.warn(`gltf: ${gltf}, gltf.scene: ${gltf?.scene}`);
    }
  }, [gltf, weaponType]);

  // Apply skin textures for Karambit
  useEffect(() => {
    if (weaponType === 'knife_karambit' && skinPath && materials.length > 0) {
      // Extract skin name from skinPath (format: skinname_pattern)
      let skinName = skinPath;
      let patternSeed: number | undefined;
      
      if (skinName.includes('_')) {
        const parts = skinName.split('_');
        const lastPart = parts[parts.length - 1];
        if (!isNaN(parseInt(lastPart))) {
          patternSeed = parseInt(lastPart);
          skinName = parts.slice(0, -1).join('_');
        }
      }
      
      console.log('Loading CS2 skin:', skinName, 'with pattern:', patternSeed);
      
      // Check if we have a specific skin texture
      const skinTexturePath = KARAMBIT_SKINS[skinName as keyof typeof KARAMBIT_SKINS];
      
      if (skinTexturePath) {
        console.log('Loading CS2 skin texture:', skinTexturePath);
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
          skinTexturePath,
          (skinTexture) => {
            console.log('CS2 texture loaded successfully:', skinTexturePath);
            console.log(`Texture properties - Width: ${skinTexture.image?.width}, Height: ${skinTexture.image?.height}, Format: ${skinTexture.image?.src?.split('.').pop()}`);
            skinTexture.flipY = false;
            skinTexture.generateMipmaps = true;
            
            // Apply skin-specific modifications
            if (skinName === 'tiger_tooth') {
              applyTigerToothSkin(skinTexture, materials);
            } else if (skinName === 'fade') {
              applyFadeSkin(skinTexture, materials, patternSeed);
            } else if (skinName === 'doppler') {
              applyDopplerSkin(skinTexture, materials, patternSeed);
            } else if (skinName === 'marble_fade') {
              applyMarbleFadeSkin(skinTexture, materials, patternSeed);
            } else {
              // Apply the exact CS2 skin texture without modifications
              materials.forEach((material) => {
                if (material instanceof THREE.MeshStandardMaterial) {
                  material.map = skinTexture;
                  material.needsUpdate = true;
                  console.log(`Applied CS2 skin texture: ${skinName}`);
                  
                  // Apply wear effects after loading texture (will check alpha channel)
                  applyWearToMaterial(material, float);
                }
              });
            }
          },
          undefined,
          (error) => {
            console.error('Failed to load CS2 texture:', skinTexturePath, error);
            // Fall back to procedural generation only if CS2 texture fails
            generateProceduralSkin(skinName, patternSeed);
          }
        );
      } else {
        console.log('No CS2 skin texture found, using procedural generation for:', skinName);
        // Fall back to procedural generation for skins not in our texture set
        generateProceduralSkin(skinName, patternSeed);
      }
    }
  }, [weaponType, skinPath, materials]);

  // Apply glove textures
  useEffect(() => {
    console.log(`Glove texture effect triggered - weaponType: ${weaponType}, skinPath: ${skinPath}, materials.length: ${materials.length}`);
    
    if ((weaponType === 'gloves_sport' || weaponType === 'gloves_specialist') && skinPath && materials.length > 0) {
      // Extract skin name from skinPath
      let skinName = skinPath;
      let patternSeed: number | undefined;
      
      if (skinName.includes('_')) {
        const parts = skinName.split('_');
        const lastPart = parts[parts.length - 1];
        if (!isNaN(parseInt(lastPart))) {
          patternSeed = parseInt(lastPart);
          skinName = parts.slice(0, -1).join('_');
        }
      }
      
      console.log('Loading glove skin:', skinName, 'with pattern:', patternSeed);
      
      // Create glove skin key
      const gloveSkinKey = `${weaponType}_${skinName}`;
      console.log('Looking for glove texture with key:', gloveSkinKey);
      console.log('Available glove textures:', Object.keys(GLOVE_SKINS));
      
      const gloveTexturePath = GLOVE_SKINS[gloveSkinKey as keyof typeof GLOVE_SKINS];
      
      if (gloveTexturePath) {
        console.log('Loading glove texture:', gloveTexturePath);
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
          gloveTexturePath,
          (gloveTexture) => {
            console.log('Glove texture loaded successfully:', gloveTexturePath);
            console.log(`Glove texture properties - Width: ${gloveTexture.image?.width}, Height: ${gloveTexture.image?.height}, Format: ${gloveTexture.image?.src?.split('.').pop()}`);
            gloveTexture.flipY = false;
            gloveTexture.generateMipmaps = true;
            
            // Apply glove texture
            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.map = gloveTexture;
                material.needsUpdate = true;
                console.log(`Applied glove texture: ${skinName}`);
                
                // Apply wear effects after loading texture (will check alpha channel)
                applyWearToMaterial(material, float);
              }
            });
          },
          undefined,
          (error) => {
            console.error('Failed to load glove texture:', gloveTexturePath, error);
            // Generate procedural glove texture
            generateProceduralGloveSkin(skinName, patternSeed);
          }
        );
      } else {
        console.log('No glove texture found, using procedural generation for:', skinName);
        generateProceduralGloveSkin(skinName, patternSeed);
      }
    } else {
      console.log(`Glove texture effect skipped - conditions not met: weaponType=${weaponType}, skinPath=${skinPath}, materials.length=${materials.length}`);
    }
  }, [weaponType, skinPath, materials]);

  // Apply Tiger Tooth skin with proper orange/yellow stripes
  const applyTigerToothSkin = (baseTexture: THREE.Texture, materials: THREE.Material[]) => {
    // Create canvas to modify the texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw base texture
      ctx.drawImage(baseTexture.image, 0, 0, 512, 512);
      
      // Apply Tiger Tooth pattern overlay
      ctx.globalCompositeOperation = 'multiply';
      
      // Create orange/yellow tiger stripes
      const stripeColors = ['#FF8C00', '#FFA500', '#FFD700']; // Orange to yellow
      
      for (let i = 0; i < 8; i++) {
        const x = i * 64;
        const color = stripeColors[i % stripeColors.length];
        
        ctx.fillStyle = color;
        ctx.fillRect(x, 0, 32, 512);
      }
      
      // Add black stripes
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000000';
      for (let i = 0; i < 4; i++) {
        const x = 16 + (i * 128);
        ctx.fillRect(x, 0, 16, 512);
      }
      
      // Convert back to texture
      const modifiedTexture = new THREE.CanvasTexture(canvas);
      modifiedTexture.flipY = false;
      modifiedTexture.generateMipmaps = true;
      
      // Apply to materials
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.map = modifiedTexture;
          material.needsUpdate = true;
          console.log('Applied Tiger Tooth skin with proper orange/yellow stripes');
        }
      });
    }
  };

  // Apply Fade skin with gradient
  const applyFadeSkin = (baseTexture: THREE.Texture, materials: THREE.Material[], patternSeed?: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(baseTexture.image, 0, 0, 512, 512);
      
      // Create fade gradient based on pattern
      const fadePosition = patternSeed ? (patternSeed % 100) / 100 : 0.5;
      
      const gradient = ctx.createLinearGradient(0, 0, 512, 0);
      gradient.addColorStop(0, 'rgba(255, 165, 0, 0.8)'); // Orange
      gradient.addColorStop(fadePosition, 'rgba(255, 255, 255, 0.5)'); // White
      gradient.addColorStop(1, 'rgba(128, 0, 128, 0.8)'); // Purple
      
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      const modifiedTexture = new THREE.CanvasTexture(canvas);
      modifiedTexture.flipY = false;
      modifiedTexture.generateMipmaps = true;
      
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.map = modifiedTexture;
          material.needsUpdate = true;
          console.log('Applied Fade skin with gradient');
        }
      });
    }
  };

  // Apply Doppler skin with color phases
  const applyDopplerSkin = (baseTexture: THREE.Texture, materials: THREE.Material[], patternSeed?: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(baseTexture.image, 0, 0, 512, 512);
      
      // Apply doppler color phase based on pattern
      const phase = patternSeed ? (patternSeed % 4) : 0;
      let dopplerColor = '#4A90E2'; // Default blue
      
      switch (phase) {
        case 0: dopplerColor = '#4A90E2'; break; // Blue
        case 1: dopplerColor = '#FF6B35'; break; // Orange
        case 2: dopplerColor = '#8B0000'; break; // Red
        case 3: dopplerColor = '#800080'; break; // Purple
      }
      
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = dopplerColor;
      ctx.fillRect(0, 0, 512, 512);
      
      const modifiedTexture = new THREE.CanvasTexture(canvas);
      modifiedTexture.flipY = false;
      modifiedTexture.generateMipmaps = true;
      
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.map = modifiedTexture;
          material.needsUpdate = true;
          console.log(`Applied Doppler skin with phase ${phase}`);
        }
      });
    }
  };

  // Apply Marble Fade skin
  const applyMarbleFadeSkin = (baseTexture: THREE.Texture, materials: THREE.Material[], patternSeed?: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(baseTexture.image, 0, 0, 512, 512);
      
      // Create marble pattern
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(255, 215, 0, 0.6)'; // Gold
      ctx.fillRect(0, 0, 512, 512);
      
      // Add marble veins
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, 0);
        ctx.lineTo(Math.random() * 512, 512);
        ctx.stroke();
      }
      
      const modifiedTexture = new THREE.CanvasTexture(canvas);
      modifiedTexture.flipY = false;
      modifiedTexture.generateMipmaps = true;
      
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.map = modifiedTexture;
          material.needsUpdate = true;
          console.log('Applied Marble Fade skin');
        }
      });
    }
  };

  // Apply Case Hardened pattern based on seed
  const applyCaseHardenedPattern = (baseTexture: THREE.Texture, patternSeed: number, materials: THREE.Material[]) => {
    // Create canvas to modify the texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw base texture
      ctx.drawImage(baseTexture.image, 0, 0, 512, 512);
      
      // Apply pattern modifications based on seed
      const bluePercent = Math.min(98, 15 + (patternSeed % 85)); // 15-98% blue
      
      // Create blue overlay based on pattern
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = `rgba(0, 100, 255, ${bluePercent / 100})`;
      ctx.fillRect(0, 0, 512, 512);
      
      // Convert back to texture
      const modifiedTexture = new THREE.CanvasTexture(canvas);
      modifiedTexture.flipY = false;
      modifiedTexture.generateMipmaps = true;
      
      // Apply to materials
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.map = modifiedTexture;
          material.needsUpdate = true;
          console.log(`Applied Case Hardened pattern ${patternSeed} with ${bluePercent}% blue`);
        }
      });
    }
  };

  // Procedural skin generation for non-textured skins
  const generateProceduralSkin = async (skinName: string, patternSeed?: number) => {
    try {
      console.log('Generating procedural skin for:', skinName, 'with wear:', float, 'pattern:', patternSeed);
      const skinDataUrl = await skinGenerator.generateSkin(skinName, float, patternSeed);
      
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        skinDataUrl,
        (texture) => {
          console.log('Procedural texture loaded for:', skinName);
          texture.flipY = false;
          texture.generateMipmaps = true;
          
          materials.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.map = texture;
              material.needsUpdate = true;
            }
          });
        },
        undefined,
        (error) => {
          console.warn(`Failed to generate procedural skin ${skinName}:`, error);
        }
      );
    } catch (error) {
      console.warn('Failed to generate procedural skin:', error);
    }
  };

  // Apply wear effects to material using alpha channel as wear mask
  const applyWearToMaterial = (material: THREE.MeshStandardMaterial, wearFactor: number) => {
    if (!material.map) return;
    
    // Extract wear mask from alpha channel of base color texture
    const baseTexture = material.map;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx && baseTexture.image) {
      canvas.width = baseTexture.image.width;
      canvas.height = baseTexture.image.height;
      
      // Draw the base texture
      ctx.drawImage(baseTexture.image, 0, 0);
      
      // Get the image data to access alpha channel
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Check if alpha channel has any non-255 values (indicating transparency/wear mask)
      let hasAlphaChannel = false;
      let alphaSum = 0;
      let alphaCount = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        alphaSum += alpha;
        alphaCount++;
        
        if (alpha < 255) {
          hasAlphaChannel = true;
        }
      }
      
      const averageAlpha = alphaSum / alphaCount;
      console.log(`Texture alpha analysis - Has alpha channel: ${hasAlphaChannel}, Average alpha: ${averageAlpha.toFixed(2)}`);
      
      if (hasAlphaChannel) {
        // Create wear mask from alpha channel
        const wearMaskData = new Uint8ClampedArray(canvas.width * canvas.height);
        for (let i = 0; i < data.length; i += 4) {
          // Alpha channel is at index 3 (RGBA)
          wearMaskData[i / 4] = data[i + 3];
        }
        
        // Create wear mask texture
        const wearMaskImageData = new ImageData(wearMaskData, canvas.width, canvas.height);
        const wearMaskCanvas = document.createElement('canvas');
        wearMaskCanvas.width = canvas.width;
        wearMaskCanvas.height = canvas.height;
        const wearMaskCtx = wearMaskCanvas.getContext('2d');
        
        if (wearMaskCtx) {
          wearMaskCtx.putImageData(wearMaskImageData, 0, 0);
          const wearMaskTexture = new THREE.CanvasTexture(wearMaskCanvas);
          wearMaskTexture.flipY = false;
          wearMaskTexture.generateMipmaps = true;
          
          // Apply wear effects based on the mask
          material.roughnessMap = wearMaskTexture;
          material.roughness = 0.2 + (wearFactor * 0.8);
          material.metalness = 0.8 - (wearFactor * 0.6);
          material.envMapIntensity = 1.0 - (wearFactor * 0.7);
          material.needsUpdate = true;
          
          console.log(`✅ Applied wear mask from alpha channel with factor: ${wearFactor}`);
        }
      } else {
        // Fallback to procedural wear if no alpha channel
        console.log(`⚠️ No alpha channel found, using procedural wear for factor: ${wearFactor}`);
        material.roughness = 0.2 + (wearFactor * 0.8);
        material.metalness = 0.8 - (wearFactor * 0.6);
        material.envMapIntensity = 1.0 - (wearFactor * 0.7);
        material.needsUpdate = true;
      }
    } else {
      // Fallback to procedural wear if no texture image
      console.log(`❌ No texture image available, using procedural wear for factor: ${wearFactor}`);
      material.roughness = 0.2 + (wearFactor * 0.8);
      material.metalness = 0.8 - (wearFactor * 0.6);
      material.envMapIntensity = 1.0 - (wearFactor * 0.7);
      material.needsUpdate = true;
    }
  };

  // Apply wear effect based on float
  useEffect(() => {
    materials.forEach(material => {
      if (material instanceof THREE.MeshStandardMaterial) {
        // Enhanced wear simulation for PBR materials
        const wearFactor = float;
        
        // Get wear mask configuration
        const wearMaskConfig = WEAR_MASKS[weaponType as keyof typeof WEAR_MASKS];
        
        if (wearMaskConfig && wearFactor > 0) {
          if (wearMaskConfig.path) {
            // Load wear mask texture if available
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(wearMaskConfig.path, (wearMaskTexture) => {
              wearMaskTexture.flipY = false;
              wearMaskTexture.generateMipmaps = true;
              
              // Apply wear mask to roughness
              material.roughnessMap = wearMaskTexture;
              material.roughness = 0.2 + (wearFactor * 0.8);
              
              // Adjust metalness based on wear
              material.metalness = 0.8 - (wearFactor * 0.6);
              
              // Reduce environment map intensity for worn areas
              material.envMapIntensity = 1.0 - (wearFactor * 0.7);
              
              material.needsUpdate = true;
            });
          } else {
            // Generate procedural wear mask based on wear areas
            generateProceduralWearMask(material, wearMaskConfig.wearAreas, wearFactor);
          }
        } else {
          // Enhanced fallback wear simulation without mask
          // Create more realistic wear patterns
          
          // Adjust roughness based on wear (more wear = more rough)
          if (material.roughnessMap) {
            // Keep the roughness map but adjust overall roughness
            material.roughness = 0.2 + (wearFactor * 0.6);
          } else {
            material.roughness = 0.2 + (wearFactor * 0.8);
          }
          
          // Adjust metalness (more wear = less metallic)
          material.metalness = 0.8 - (wearFactor * 0.4);
          
          // Minimal color changes for high wear (no orange tinting)
          if (wearFactor > 0.7) {
            // Only apply very subtle color changes for extreme wear
            const wearColor = new THREE.Color(0x8B7355); // Very subtle brown
            material.color.lerp(wearColor, wearFactor * 0.02); // Very minimal color change
          }
          
          // Add wear to environment map intensity
          material.envMapIntensity = 1.0 - (wearFactor * 0.5);
          
          // Add subtle wear to normal map intensity for more realistic effect
          if (material.normalMap) {
            material.normalScale.setScalar(1.0 - (wearFactor * 0.3));
          }
          
          material.needsUpdate = true;
        }
      }
    });
  }, [float, materials, weaponType]);

  // Generate procedural wear mask based on wear areas
  const generateProceduralWearMask = (material: THREE.MeshStandardMaterial, wearAreas: Array<{ name: string; intensity: number; wearFactor: number }>, wearFactor: number) => {
    // Create a canvas to generate wear mask
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 512, 512);
      
      // Generate wear patterns based on wear areas
      wearAreas.forEach(area => {
        const intensity = area.intensity * wearFactor;
        
        // Create wear pattern for this area
        ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
        
        // Different patterns for different areas
        switch (area.name) {
          case 'blade_edge':
            // Edge wear - horizontal lines along the blade edge
            for (let i = 0; i < 15; i++) {
              const x = 100 + (i * 20);
              const y = 200 + Math.sin(i * 0.5) * 10;
              ctx.fillRect(x, y, 300, 3);
            }
            break;
          case 'blade_spine':
            // Spine wear - vertical scratches along the blade spine
            for (let i = 0; i < 10; i++) {
              const x = 250 + Math.sin(i) * 15;
              const y = 100 + (i * 30);
              ctx.fillRect(x, y, 2, 40);
            }
            break;
          case 'handle_grip':
            // Grip wear - circular pattern on handle
            ctx.beginPath();
            ctx.arc(256, 400, 60, 0, 2 * Math.PI);
            ctx.fill();
            // Add finger groove wear
            for (let i = 0; i < 3; i++) {
              ctx.beginPath();
              ctx.arc(256, 380 + (i * 20), 15, 0, 2 * Math.PI);
              ctx.fill();
            }
            break;
          case 'finger_ring':
            // Ring wear - ring pattern
            ctx.beginPath();
            ctx.arc(256, 450, 35, 0, 2 * Math.PI);
            ctx.fill();
            break;
        }
      });
      
      // Add some random wear spots
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = 5 + Math.random() * 15;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Convert canvas to texture
      const texture = new THREE.CanvasTexture(canvas);
      texture.flipY = false;
      texture.generateMipmaps = true;
      
      // Apply wear mask
      material.roughnessMap = texture;
      material.roughness = 0.2 + (wearFactor * 0.8);
      material.metalness = 0.8 - (wearFactor * 0.6);
      material.envMapIntensity = 1.0 - (wearFactor * 0.7);
      material.needsUpdate = true;
    }
  };

  // Generate procedural glove skin
  const generateProceduralGloveSkin = (skinName: string, patternSeed?: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create base glove texture based on skin name
      let baseColor = '#8B4513'; // Default brown
      
      if (skinName.includes('fade')) {
        baseColor = '#FF6B35'; // Orange
      } else if (skinName.includes('crimson')) {
        baseColor = '#8B0000'; // Dark red
      } else if (skinName.includes('emerald')) {
        baseColor = '#228B22'; // Green
      } else if (skinName.includes('vice')) {
        baseColor = '#4B0082'; // Purple
      } else if (skinName.includes('ominous')) {
        baseColor = '#2F4F4F'; // Dark slate
      }
      
      // Fill canvas with base color
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add some texture pattern
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = 10 + Math.random() * 20;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Convert to texture
      const texture = new THREE.CanvasTexture(canvas);
      texture.flipY = false;
      texture.generateMipmaps = true;
      
      // Apply to materials
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.map = texture;
          material.needsUpdate = true;
          console.log(`Generated procedural glove skin: ${skinName}`);
        }
      });
    }
  };

  // Animation frame
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Add slight bobbing for weapons
      if (weaponCategory !== 'gloves') {
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      }
    }
  });

  // Test alpha channels for all available textures
  useEffect(() => {
    const testAllTextures = async () => {
      console.log('🧪 Testing alpha channels for all available textures...');
      
      const textureLoader = new THREE.TextureLoader();
      
      // Test Karambit skins
      for (const [skinName, texturePath] of Object.entries(KARAMBIT_SKINS)) {
        try {
          textureLoader.load(
            texturePath,
            (texture) => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (ctx && texture.image) {
                canvas.width = texture.image.width;
                canvas.height = texture.image.height;
                ctx.drawImage(texture.image, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                let hasAlpha = false;
                let alphaSum = 0;
                let alphaCount = 0;
                
                for (let i = 0; i < data.length; i += 4) {
                  const alpha = data[i + 3];
                  alphaSum += alpha;
                  alphaCount++;
                  if (alpha < 255) hasAlpha = true;
                }
                
                const avgAlpha = alphaSum / alphaCount;
                console.log(`📊 ${skinName}: ${hasAlpha ? '✅ Has alpha' : '❌ No alpha'} (avg: ${avgAlpha.toFixed(2)})`);
              }
            },
            undefined,
            (error) => {
              console.log(`❌ Failed to load ${skinName}: ${error}`);
            }
          );
        } catch (error) {
          console.log(`❌ Error testing ${skinName}: ${error}`);
        }
      }
      
      // Test glove textures
      for (const [gloveKey, texturePath] of Object.entries(GLOVE_SKINS)) {
        try {
          textureLoader.load(
            texturePath,
            (texture) => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (ctx && texture.image) {
                canvas.width = texture.image.width;
                canvas.height = texture.image.height;
                ctx.drawImage(texture.image, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                let hasAlpha = false;
                let alphaSum = 0;
                let alphaCount = 0;
                
                for (let i = 0; i < data.length; i += 4) {
                  const alpha = data[i + 3];
                  alphaSum += alpha;
                  alphaCount++;
                  if (alpha < 255) hasAlpha = true;
                }
                
                const avgAlpha = alphaSum / alphaCount;
                console.log(`📊 ${gloveKey}: ${hasAlpha ? '✅ Has alpha' : '❌ No alpha'} (avg: ${avgAlpha.toFixed(2)})`);
              }
            },
            undefined,
            (error) => {
              console.log(`❌ Failed to load ${gloveKey}: ${error}`);
            }
          );
        } catch (error) {
          console.log(`❌ Error testing ${gloveKey}: ${error}`);
        }
      }
    };
    
    // Run the test after a short delay to ensure everything is loaded
    setTimeout(testAllTextures, 1000);
  }, []);

  // Render logic based on modelLoaded state
  if (!modelLoaded) {
    console.log(`Rendering fallback geometry for ${weaponType} with category ${weaponCategory}`);
    console.log(`Fallback geometry: ${fallbackGeometry.type} with ${fallbackGeometry.attributes.position.count} vertices`);
    return (
      <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
        <mesh geometry={fallbackGeometry}>
          <meshStandardMaterial 
            color={weaponCategory === 'gloves' ? 0x4A4A4A : 0x8B4513}
            metalness={0.8 - (float * 0.6)}
            roughness={0.2 + (float * 0.8)}
          />
        </mesh>
        {/* Add a second mesh for gloves to make them more visible */}
        {weaponCategory === 'gloves' && (
          <mesh geometry={new THREE.BoxGeometry(0.6, 0.3, 0.2)} position={[0.4, 0, 0]}>
            <meshStandardMaterial 
              color={0x4A4A4A}
              metalness={0.8 - (float * 0.6)}
              roughness={0.2 + (float * 0.8)}
            />
          </mesh>
        )}
        {/* Add a third mesh for gloves to make them even more visible */}
        {weaponCategory === 'gloves' && (
          <mesh geometry={new THREE.BoxGeometry(0.4, 0.2, 0.15)} position={[-0.3, 0, 0]}>
            <meshStandardMaterial 
              color={0x6B6B6B}
              metalness={0.8 - (float * 0.6)}
              roughness={0.2 + (float * 0.8)}
            />
          </mesh>
        )}
      </group>
    );
  }

  // Success state - render the loaded model
  console.log(`Rendering loaded model for ${weaponType} with ${gltf.scene.children.length} children`);
  return (
    <group ref={groupRef} position={position} scale={[scale * 2, scale * 2, scale * 2]}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default WeaponModel; 