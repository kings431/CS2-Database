# CS2 Model Conversion Guide

## 🎯 **Goal: Convert .vmdl files to .glb for web use**

### **Current Situation:**
- ✅ You have Source 2 Viewer with all CS2 models
- ✅ Models are in `.vmdl` format (Valve Model)
- ❌ Need `.glb` format for web compatibility
- ❌ Source 2 Viewer only exports to `.vmdl`

---

## **🔧 Conversion Methods**

### **Method 1: VRF (Valve Resource Format) Tools**

#### **Step 1: Install VRF Tools**
```bash
# Install VRF tools for Source 2 model conversion
git clone https://github.com/SteamDatabase/ValveResourceFormat.git
cd ValveResourceFormat
dotnet build
```

#### **Step 2: Convert .vmdl to .glb**
```bash
# Convert using VRF
vrf_decompiler.exe weapon_rif_ak47.vmdl_c
# This will extract the model data

# Then use a 3D converter to create .glb
# Options: Blender, Online converters, etc.
```

### **Method 2: Use Blender with VMDL Import Plugin**

#### **Step 1: Install Blender VMDL Plugin**
```bash
# Download VMDL import plugin for Blender
# Search for "Source 2 VMDL Import" plugin
```

#### **Step 2: Import and Export**
1. **Open Blender**
2. **Import .vmdl file** using the plugin
3. **Export as .glb** (File > Export > glTF 2.0)

### **Method 3: Online Conversion Tools**

#### **Step 1: Extract Model Data**
```bash
# Use VRF to extract model data to common formats
vrf_decompiler.exe --format=obj weapon_rif_ak47.vmdl_c
```

#### **Step 2: Convert Online**
- **Sketchfab:** Upload OBJ and download GLB
- **Online GLB converters:** Convert OBJ to GLB
- **Blender Online:** Use Blender's online tools

---

## **🚀 Quick Setup for Your Project**

### **Step 1: Create Model Directory Structure**
```bash
mkdir -p public/models/weapons/ak47
mkdir -p public/models/weapons/m4a4
mkdir -p public/models/weapons/awp
mkdir -p public/models/weapons/knives/karambit
mkdir -p public/models/weapons/knives/m9_bayonet
mkdir -p public/models/gloves/sport
mkdir -p public/models/gloves/specialist
```

### **Step 2: Convert Your Models**
```bash
# For each weapon model:
# 1. Export from Source 2 Viewer as .vmdl
# 2. Convert to .glb using one of the methods above
# 3. Place in appropriate directory
```

### **Step 3: Update Model Paths**
```typescript
// Update WeaponModel.tsx with correct paths
const WEAPON_MODELS = {
  ak47: '/models/weapons/ak47/ak47_base.glb',
  m4a4: '/models/weapons/m4a4/m4a4_base.glb',
  awp: '/models/weapons/awp/awp_base.glb',
  knife_karambit: '/models/weapons/knives/karambit/karambit_base.glb',
  knife_m9: '/models/weapons/knives/m9_bayonet/m9_base.glb',
  gloves_sport: '/models/gloves/sport/sport_base.glb',
  gloves_specialist: '/models/gloves/specialist/specialist_base.glb',
};
```

---

## **📋 Recommended Conversion Workflow**

### **For Each Weapon Model:**

1. **Export from Source 2 Viewer:**
   - Select the weapon model
   - Export as `.vmdl` file
   - Save to a working directory

2. **Convert to Intermediate Format:**
   ```bash
   # Use VRF to extract to OBJ/FBX
   vrf_decompiler.exe --format=obj weapon_rif_ak47.vmdl_c
   ```

3. **Import to Blender:**
   - Open Blender
   - Import the OBJ file
   - Clean up the model if needed
   - Optimize for web (reduce polygons if needed)

4. **Export as GLB:**
   - File > Export > glTF 2.0 (.glb/.gltf)
   - Enable "Include Textures"
   - Set compression if needed

5. **Place in Project:**
   ```bash
   # Copy to your project
   cp ak47_base.glb public/models/weapons/ak47/
   ```

---

## **🎨 Model Optimization for Web**

### **Polygon Count Guidelines:**
- **Weapons:** 5K-15K polygons
- **Knives:** 2K-5K polygons
- **Gloves:** 3K-8K polygons

### **Texture Optimization:**
- **Resolution:** 2048x2048 or 1024x1024
- **Format:** PNG for transparency, JPG for size
- **Compression:** Enable texture compression

### **GLB File Size:**
- **Target:** Under 2MB per model
- **Compression:** Use Draco compression if needed
- **LOD:** Consider multiple detail levels

---

## **🔧 Alternative: Use Existing Tools**

### **Option A: Use Community Converters**
- **Source 2 Model Viewer:** Some versions support GLB export
- **VMDL to GLB converters:** Search for existing tools
- **Online conversion services:** Upload VMDL, download GLB

### **Option B: Manual Recreation**
- **Use Blender:** Create simplified versions based on CS2 models
- **Match proportions:** Use screenshots as reference
- **Focus on key details:** Barrel, stock, grip, etc.

---

## **⚡ Quick Start Script**

```bash
#!/bin/bash
# CS2 Model Conversion Script

# Create directories
mkdir -p public/models/weapons/{ak47,m4a4,awp}
mkdir -p public/models/weapons/knives/{karambit,m9_bayonet}
mkdir -p public/models/gloves/{sport,specialist}

# Convert models (example)
echo "Converting AK-47..."
vrf_decompiler.exe --format=obj weapon_rif_ak47.vmdl_c
# Then import to Blender and export as GLB

echo "Converting M4A4..."
vrf_decompiler.exe --format=obj weapon_rif_m4a4.vmdl_c

echo "Converting AWP..."
vrf_decompiler.exe --format=obj weapon_rif_awp.vmdl_c

echo "Conversion complete!"
```

---

## **📊 Progress Tracking**

- [ ] Install VRF tools
- [ ] Convert AK-47 model
- [ ] Convert M4A4 model
- [ ] Convert AWP model
- [ ] Convert knife models
- [ ] Convert glove models
- [ ] Test models in viewer
- [ ] Optimize file sizes

---

## **🎯 Next Steps**

1. **Immediate:** Install VRF tools and convert one model
2. **Short-term:** Convert all weapon models
3. **Medium-term:** Optimize models for web
4. **Long-term:** Add texture support and animations

**Priority:** Start with converting the AK-47 model to test the workflow, then scale up to all weapons. 