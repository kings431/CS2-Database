# VMDL to GLB Conversion Guide

## 🎯 **Current Status**
- ✅ VMDL file: `weapon_rif_ak47.vmdl` (54KB)
- ✅ GLB placeholder created for testing
- ❌ Need to convert VMDL to proper GLB

---

## **🔧 Conversion Methods**

### **Method 1: Fix VRF Tools (Recommended)**

#### **Step 1: Build VRF Tools**
```bash
# Navigate to VRF directory
cd C:\Users\marc_\ValveResourceFormat

# Build the project
dotnet build

# Find the executable
dir /s *.exe
```

#### **Step 2: Use the Built Executable**
```bash
# Use the correct path to the built executable
.\bin\Debug\net6.0\vrf_decompiler.exe "C:\Users\marc_\OneDrive\Desktop\CS2-Database\public\models\weapons\ak47\weapon_rif_ak47.vmdl" --format=obj
```

### **Method 2: Use Blender (Easiest)**

#### **Step 1: Download Blender**
- Download from: https://www.blender.org/
- Install Blender 3.6+ (free)

#### **Step 2: Install VMDL Plugin**
1. Open Blender
2. Go to Edit > Preferences > Add-ons
3. Search for "VMDL" or "Source 2"
4. Install the VMDL import plugin

#### **Step 3: Import and Export**
1. **File > Import > VMDL**
2. Select your `weapon_rif_ak47.vmdl` file
3. **File > Export > glTF 2.0 (.glb/.gltf)**
4. Save as `ak47_base.glb`

### **Method 3: Online Conversion**

#### **Step 1: Extract Model Data**
```bash
# Use any VRF tool to extract to OBJ
# Or use Source 2 Viewer to export as OBJ
```

#### **Step 2: Convert Online**
- **Sketchfab:** Upload OBJ, download GLB
- **Online GLB converters:** Convert OBJ to GLB
- **Blender Online:** Use Blender's online tools

### **Method 4: Manual Recreation (Fallback)**

#### **Step 1: Create Simple Model**
1. Open Blender
2. Create a basic weapon shape
3. Export as GLB

#### **Step 2: Use Placeholder**
- Use the current placeholder GLB for testing
- Focus on skin viewer functionality first

---

## **🚀 Quick Test Setup**

### **Step 1: Start Development Server**
```bash
npm run dev
```

### **Step 2: Test Current Setup**
Visit: `http://localhost:3000/test-skin-viewer`

### **Step 3: Verify Functionality**
- ✅ Weapon selection works
- ✅ Skin selection works
- ✅ Map backgrounds work
- ✅ Float slider works
- ❌ Real 3D models (using fallback)

---

## **📋 Conversion Checklist**

### **For AK-47:**
- [x] VMDL file imported
- [x] GLB placeholder created
- [ ] Convert VMDL to GLB
- [ ] Test in viewer
- [ ] Apply textures

### **For Other Weapons:**
- [ ] Export M4A4 from Source 2 Viewer
- [ ] Export AWP from Source 2 Viewer
- [ ] Export knives from Source 2 Viewer
- [ ] Export gloves from Source 2 Viewer

---

## **🎯 Immediate Next Steps**

1. **Try Blender Method (Easiest):**
   - Download Blender
   - Install VMDL plugin
   - Import VMDL, export GLB

2. **Fix VRF Tools:**
   - Build the project properly
   - Use correct executable path

3. **Test Current Setup:**
   - Start dev server
   - Test skin viewer functionality

---

## **📚 Resources**

- **Blender:** https://www.blender.org/
- **VRF Tools:** https://github.com/SteamDatabase/ValveResourceFormat
- **VMDL Plugin:** Search for "Source 2 VMDL Import"
- **Online Converter:** https://www.vectary.com/3d-modeling-tool/

---

## **⚡ Quick Commands**

```bash
# Start development server
npm run dev

# Test skin viewer
# Visit: http://localhost:3000/test-skin-viewer

# Build VRF tools (if needed)
cd C:\Users\marc_\ValveResourceFormat
dotnet build
```

**Priority:** Start with Blender method for easiest conversion! 