import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

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
          ak47: '/models/weapons/ak47/ak-47.glb',
  m4a4: '/models/weapons/m4a4/m4a4_base.glb',
  awp: '/models/weapons/awp/awp_base.glb',
  knife_karambit: '/models/weapons/knives/karambit/karambit_base.glb',
  knife_m9: '/models/weapons/knives/m9_bayonet/m9_base.glb',
  gloves_sport: '/models/gloves/sport/sport_base.glb',
  gloves_specialist: '/models/gloves/specialist/specialist_base.glb',
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
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [materials, setMaterials] = useState<THREE.Material[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Try to load the 3D model
  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        // Try to load the GLB model
        const modelPath = WEAPON_MODELS[weaponType as keyof typeof WEAPON_MODELS];
        if (modelPath) {
          const gltf = useGLTF(modelPath);
          setModel(gltf.scene);
          
          // Extract materials for skin application
          const modelMaterials: THREE.Material[] = [];
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              if (Array.isArray(child.material)) {
                modelMaterials.push(...child.material);
              } else {
                modelMaterials.push(child.material);
              }
            }
          });
          setMaterials(modelMaterials);
        } else {
          throw new Error('No model path found for weapon type');
        }
      } catch (error) {
        console.warn(`Failed to load GLB model for ${weaponType}, using fallback geometry:`, error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, [weaponType]);

  // Apply skin texture to materials
  useEffect(() => {
    if (skinPath && materials.length > 0) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        skinPath,
        (texture) => {
          texture.flipY = false;
          materials.forEach(material => {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.map = texture;
              material.needsUpdate = true;
            }
          });
        },
        undefined,
        (error) => {
          console.warn('Failed to load skin texture:', error);
        }
      );
    }
  }, [skinPath, materials]);

  // Apply wear effect based on float
  useEffect(() => {
    materials.forEach(material => {
      if (material instanceof THREE.MeshStandardMaterial) {
        // Simulate wear by adjusting roughness and metalness
        material.roughness = 0.2 + (float * 0.8);
        material.metalness = 0.8 - (float * 0.6);
        material.needsUpdate = true;
      }
    });
  }, [float, materials]);

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

  // Loading state
  if (isLoading) {
    return (
      <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
        <mesh geometry={fallbackGeometry}>
          <meshStandardMaterial 
            color={0x666666}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      </group>
    );
  }

  // Error state - use fallback geometry
  if (hasError || !model) {
    return (
      <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
        <mesh geometry={fallbackGeometry}>
          <meshStandardMaterial 
            color={0x8B4513}
            metalness={0.8 - (float * 0.6)}
            roughness={0.2 + (float * 0.8)}
          />
        </mesh>
      </group>
    );
  }

  // Success state - render the loaded model
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      <primitive object={model} />
    </group>
  );
};

export default WeaponModel; 