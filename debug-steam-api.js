async function debugSteamAPI() {
  try {
    // Extract parameters from the inspect link
    const inspectLink = 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198093714585A44626866315D13835460595494074492';
    const decodedLink = decodeURIComponent(inspectLink);
    const match = decodedLink.match(/\+csgo_econ_action_preview\s+(.+)$/);
    const parameterString = match[1];
    const paramMatch = parameterString.match(/S(\d+)A(\d+)D(\d+)/);
    const [, steamId, assetId, d] = paramMatch;
    
    console.log('Steam ID:', steamId);
    console.log('Asset ID:', assetId);
    console.log('D:', d);
    
    // Test Steam inventory API
    const inventoryUrl = `https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=5000`;
    console.log('Fetching from:', inventoryUrl);
    
    const response = await fetch(inventoryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('Inventory data keys:', Object.keys(data));
    console.log('Assets count:', data.assets ? Object.keys(data.assets).length : 'No assets');
    console.log('Descriptions count:', data.descriptions ? data.descriptions.length : 'No descriptions');
    
    if (data.assets && data.assets[assetId]) {
      console.log('Found asset:', data.assets[assetId]);
    } else {
      console.log('Asset not found in inventory');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugSteamAPI(); 