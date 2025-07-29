// Test script for screenshot API

async function testScreenshotAPI() {
  const inspectLink = 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview S76561198320430286A44803380965D4631504492215634113';
  
  console.log('🧪 Testing screenshot API...');
  console.log('Input:', inspectLink);
  
  try {
    const response = await fetch('http://localhost:3000/api/screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspectLink }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success!');
      console.log('Item name:', data.name);
      console.log('Wear:', data.wear);
      console.log('Pattern:', data.pattern);
      console.log('Image URL:', data.imageUrl ? 'Available' : 'Not available');
      console.log('Timestamp:', data.timestamp);
    } else {
      const error = await response.json();
      console.log('❌ Error:', error.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testScreenshotAPI(); 