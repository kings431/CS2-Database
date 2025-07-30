# CS2 Skin Viewer Setup Guide

This guide explains how to set up and use the 3D CS2 Skin Viewer component in your Next.js project.

## 🚀 Features

- **3D Weapon Models**: High-quality 3D rendering using Three.js
- **Dynamic Skin Textures**: Real-time skin application with PNG textures
- **Wear Effects**: Adjustable float values with grayscale wear masks
- **Sticker Overlays**: Apply up to 4 tournament stickers
- **Interactive Controls**: Orbit, zoom, and rotate the weapon
- **Responsive Design**: Works on desktop and mobile devices

## 📁 File Structure

```
public/
├── models/
│   └── ak47.glb                 # 3D weapon model
├── textures/
│   ├── skins/
│   │   ├── ak47_redline.png     # Skin textures
│   │   ├── ak47_asiimov.png
│   │   └── ak47_vulcan.png
│   ├── wearmasks/
│   │   └── ak47_mask.png        # Wear effect masks
│   └── stickers/
│       ├── katowice2014.png     # Tournament stickers
│       ├── dreamhack2014.png
│       └── cologne2014.png
```

## 🛠️ Installation

The required dependencies are already installed:

```bash
npm install three @react-three/fiber @react-three/drei @types/three --legacy-peer-deps
```

## 📦 Component Usage

### Basic Usage

```tsx
import SkinViewer from "@/components/SkinViewer";

<SkinViewer
  model="ak47"
  skin="redline"
  float={0.12}
  stickers={["katowice2014.png", null, null, null]}
/>
```

### Advanced Usage

```tsx
<SkinViewer
  model="ak47"
  skin="asiimov"
  float={0.01}
  stickers={["dreamhack2014.png", "cologne2014.png", "mlg2015.png", null]}
  className="custom-styles"
/>
```

## 🎨 Adding 3D Models

### Model Requirements

1. **Format**: GLB (Binary glTF)
2. **Polygons**: < 10,000 triangles for web performance
3. **UV Mapping**: Properly unwrapped for texture application
4. **Materials**: Standard material with albedo texture support
5. **Scale**: 1 unit = 1 meter
6. **Origin**: Centered at weapon's center of mass

### Model Sources

- **Sketchfab**: Free and paid 3D models
- **TurboSquid**: Professional 3D assets
- **BlenderKit**: Free weapon models
- **Create Your Own**: Use Blender or Maya

### Model Placement

Place your `.glb` files in `public/models/` with the naming convention:
- `ak47.glb`
- `m4a1.glb`
- `awp.glb`
- etc.

## 🎨 Adding Skin Textures

### Texture Requirements

1. **Format**: PNG with transparency support
2. **Resolution**: 1024x1024 or 2048x2048 pixels
3. **UV Mapping**: Must match the weapon model's UV layout
4. **Style**: CS2 skin designs (Redline, Asiimov, Vulcan, etc.)

### Texture Naming Convention

```
public/textures/skins/
├── ak47_redline.png
├── ak47_asiimov.png
├── ak47_vulcan.png
├── ak47_fire_serpent.png
└── ak47_dragon_lore.png
```

### Creating Wear Masks

Wear masks control where wear effects appear on the weapon:

1. **Format**: PNG grayscale
2. **Resolution**: Same as skin texture
3. **Content**: White = no wear, Black = maximum wear
4. **Placement**: `public/textures/wearmasks/ak47_mask.png`

## 🏷️ Adding Stickers

### Sticker Requirements

1. **Format**: PNG with transparency (RGBA)
2. **Resolution**: 256x256 or 512x512 pixels
3. **Content**: Tournament logos and designs
4. **Alpha Channel**: Controls transparency for overlay

### Sticker Placement

```
public/textures/stickers/
├── katowice2014.png
├── dreamhack2014.png
├── cologne2014.png
└── mlg2015.png
```

## 🎮 Demo Page

Visit `/skin-viewer` to see the component in action with multiple configurations:

- AK-47 Redline with wear effects
- AK-47 Asiimov with multiple stickers
- AK-47 Vulcan (Battle-Scarred)
- Sticker showcase with all 4 slots filled

## 🔧 Customization

### Adding New Weapons

1. Add the 3D model to `public/models/`
2. Create skin textures in `public/textures/skins/`
3. Create wear mask in `public/textures/wearmasks/`
4. Update the component's available skins list

### Custom Styling

The component uses Tailwind CSS classes and can be customized:

```tsx
<SkinViewer
  className="custom-container-styles"
  // ... other props
/>
```

### Advanced Shader Effects

The component includes custom shaders for:
- Wear effects using grayscale masks
- Sticker overlays with alpha blending
- Dynamic texture application

## 🐛 Troubleshooting

### Model Not Loading

1. Check file path: `/public/models/weapon.glb`
2. Verify GLB format is valid
3. Ensure model has proper UV mapping
4. Check browser console for errors

### Textures Not Applying

1. Verify texture file exists
2. Check naming convention: `weapon_skin.png`
3. Ensure UV mapping matches between model and texture
4. Verify PNG format with transparency

### Performance Issues

1. Reduce model polygon count
2. Optimize texture resolutions
3. Use compressed textures
4. Enable hardware acceleration

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🎯 Next Steps

1. **Add Real Models**: Replace placeholder files with actual CS2 weapon models
2. **Expand Weapon Types**: Add more weapons (M4A1, AWP, etc.)
3. **Database Integration**: Connect to your CS2 skin database
4. **User Uploads**: Allow users to upload custom skins
5. **Animation**: Add weapon inspection animations
6. **Screenshots**: Add screenshot functionality

## 📄 License

This component is part of the CS2 Database project. Ensure you have proper licenses for any 3D models and textures used. 