const fs = require('fs');
const path = require('path');

console.log('🎯 VMDL to GLB Converter');
console.log('==========================');

// Check if VMDL file exists
const vmdlPath = path.join(__dirname, 'public/models/weapons/ak47/weapon_rif_ak47.vmdl');
const glbPath = path.join(__dirname, 'public/models/weapons/ak47/ak47_base.glb');

if (fs.existsSync(vmdlPath)) {
  console.log('✅ Found VMDL file:', vmdlPath);
  console.log('📋 VMDL file size:', fs.statSync(vmdlPath).size, 'bytes');
  
  // Read VMDL content
  const vmdlContent = fs.readFileSync(vmdlPath, 'utf8');
  console.log('📖 VMDL file contains:', vmdlContent.length, 'characters');
  
  console.log('\n🔧 Conversion Options:');
  console.log('1. Use VRF Tools (Recommended)');
  console.log('2. Use Blender with VMDL Plugin');
  console.log('3. Use Online Converters');
  
  console.log('\n📋 Next Steps:');
  console.log('1. Install VRF Tools: https://github.com/SteamDatabase/ValveResourceFormat');
  console.log('2. Convert VMDL to OBJ: vrf_decompiler.exe weapon_rif_ak47.vmdl --format=obj');
  console.log('3. Import OBJ to Blender');
  console.log('4. Export as GLB from Blender');
  console.log('5. Place GLB file in:', glbPath);
  
  console.log('\n🎯 Quick Conversion:');
  console.log('If you have Blender installed:');
  console.log('1. Open Blender');
  console.log('2. Install VMDL import plugin');
  console.log('3. Import the VMDL file directly');
  console.log('4. Export as GLB (File > Export > glTF 2.0)');
  
} else {
  console.log('❌ VMDL file not found at:', vmdlPath);
  console.log('Please ensure the file exists before running conversion.');
}

console.log('\n📚 Resources:');
console.log('• VRF Tools: https://github.com/SteamDatabase/ValveResourceFormat');
console.log('• Blender: https://www.blender.org/');
console.log('• VMDL Plugin: Search for "Source 2 VMDL Import"');
console.log('• Online Converter: https://www.vectary.com/3d-modeling-tool/');

console.log('\n✅ Ready to convert your VMDL to GLB!'); 