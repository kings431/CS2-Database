console.log('Testing inspect link parsing...');

const inspectLink = 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview S76561198320430286A44803380965D4631504492215634113';

console.log('Input:', inspectLink);

// Decode the URL
const decodedLink = decodeURIComponent(inspectLink);
console.log('Decoded:', decodedLink);

// Extract the parameter string
let match = decodedLink.match(/\+csgo_econ_action_preview\s+(.+)$/);
if (!match) {
  match = decodedLink.match(/\+csgo_econ_action_preview(.+)$/);
}

if (match) {
  const parameterString = match[1].trim();
  console.log('Parameter string:', parameterString);
  
  // Parse the parameters
  const paramMatch = parameterString.match(/S(\d+)A(\d+)D(\d+)/);
  if (paramMatch) {
    const [, steamId, assetId, d] = paramMatch;
    console.log('Steam ID:', steamId);
    console.log('Asset ID:', assetId);
    console.log('D parameter:', d);
  } else {
    console.log('Failed to parse parameters');
  }
} else {
  console.log('Failed to extract parameter string');
} 