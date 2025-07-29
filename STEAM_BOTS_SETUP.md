# Steam Bots Setup Guide - Real Item Data Fetching

## 🎯 **Overview**

This guide will help you set up Steam bots to fetch real item data from inspect links, just like swap.gg and Skinport do. The Steam bot system uses authenticated Steam accounts with CS:GO access to bypass rate limits and get real-time item data.

## 🚀 **Quick Start**

### 1. **Install Dependencies**
```bash
npm install steam-user steam-totp steamcommunity steam-tradeoffer-manager
```

### 2. **Set Up Steam Bot Accounts**

You need **Steam accounts with CS:GO installed** to access real item data. Here's how to set them up:

#### **Step 1: Create Steam Accounts**
1. Go to [Steam](https://store.steampowered.com/) and create new accounts
2. Each account needs to have CS:GO installed (free to play)
3. Enable Steam Guard (2FA) on each account
4. Get the Steam Guard shared secret and identity secret

#### **Step 2: Get Steam Guard Secrets**
1. **Shared Secret**: Used to generate 2FA codes
   - Go to Steam Guard settings
   - Click "Show QR Code"
   - The shared secret is in the URL or QR code data

2. **Identity Secret**: Used for trade confirmations
   - Found in the same Steam Guard settings
   - Used for automated trade confirmations

#### **Step 3: Configure Environment Variables**
Add these to your `.env` file:

```env
# Steam Bot Configuration
STEAM_BOT_1_USERNAME=your_steam_bot_1_username
STEAM_BOT_1_PASSWORD=your_steam_bot_1_password
STEAM_BOT_1_SHARED_SECRET=your_steam_bot_1_shared_secret
STEAM_BOT_1_IDENTITY_SECRET=your_steam_bot_1_identity_secret

STEAM_BOT_2_USERNAME=your_steam_bot_2_username
STEAM_BOT_2_PASSWORD=your_steam_bot_2_password
STEAM_BOT_2_SHARED_SECRET=your_steam_bot_2_shared_secret
STEAM_BOT_2_IDENTITY_SECRET=your_steam_bot_2_identity_secret
```

### 3. **Test the System**
```bash
node test-steam-bots.js
```

## 🔧 **How It Works**

### **Steam Bot Authentication Flow**
1. **Login**: Bot logs into Steam using username/password
2. **2FA**: Uses shared secret to generate Steam Guard codes
3. **Session**: Establishes web session with Steam Community
4. **Cookies**: Gets authenticated session cookies
5. **API Calls**: Uses cookies to make authenticated API calls

### **Item Data Fetching Process**
1. **Parse Inspect Link**: Extract Steam ID, Asset ID, and D parameter
2. **Bot Selection**: Choose available bot (not rate limited)
3. **API Calls**: Try multiple Steam APIs with authenticated session:
   - Steam Internal Item Details API
   - Steam Community Inventory API
   - Steam Market API
4. **Data Extraction**: Parse real float values, patterns, and item details
5. **Response**: Return real item data with exact values

## 📊 **Rate Limits & Performance**

### **Bot Limits**
- **Requests per second**: 1 per bot
- **Daily limit**: 86,400 requests per bot (24 hours × 60 minutes × 60 seconds)
- **Recommended bots**: 2-5 bots for production use

### **Fallback Strategy**
If bots are unavailable:
1. Try public Steam APIs (rate limited)
2. Fall back to database items
3. Use intelligent mock data as last resort

## 🛠️ **Configuration Options**

### **Bot Pool Management**
```typescript
// Add more bots to the pool
const additionalBots = [
  {
    id: 'cs2db_bot_3',
    username: 'your_steam_bot_3_username',
    password: 'your_steam_bot_3_password',
    sharedSecret: 'your_steam_bot_3_shared_secret',
    identitySecret: 'your_steam_bot_3_identity_secret'
  }
]
```

### **Rate Limiting Configuration**
```typescript
// Adjust rate limits per bot
const maxRequestsPerDay = 86400 // 1 request per second
const maxRequestsPerSecond = 1
```

## 🔍 **Testing & Debugging**

### **Test Individual Bot**
```bash
# Test bot authentication
node -e "
const { steamBotManager } = require('./lib/steam-bots');
steamBotManager.authenticateBotManually('cs2db_bot_1')
  .then(success => console.log('Auth success:', success))
  .catch(error => console.error('Auth failed:', error));
"
```

### **Check Bot Status**
```bash
# Get bot status
node -e "
const { steamBotManager } = require('./lib/steam-bots');
console.log(steamBotManager.getBotStatus());
"
```

### **Test with Real Inspect Link**
```bash
# Test with your inspect link
node test-steam-bots.js
```

## ⚠️ **Important Security Notes**

### **Steam Account Security**
- **Never share bot credentials** in public repositories
- **Use dedicated Steam accounts** for bots (not your main account)
- **Enable Steam Guard** on all bot accounts
- **Monitor bot accounts** for suspicious activity

### **Environment Variables**
- **Keep `.env` file secure** and never commit to version control
- **Use strong passwords** for bot accounts
- **Rotate credentials** regularly

### **Rate Limiting**
- **Respect Steam's rate limits** to avoid account bans
- **Monitor bot usage** to stay within limits
- **Implement proper error handling** for rate limit errors

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Authentication Failed**
```
❌ Bot cs2db_bot_1 authentication failed: Invalid password
```
**Solution**: Check username/password in environment variables

#### **2. Steam Guard Required**
```
🔐 Bot cs2db_bot_1 Steam Guard required
```
**Solution**: Ensure shared secret is correct and Steam Guard is enabled

#### **3. Rate Limited**
```
⚠️ No available Steam bots - all bots are rate-limited
```
**Solution**: Wait for rate limits to reset or add more bots

#### **4. Session Expired**
```
❌ Bot cs2db_bot_1 not properly authenticated
```
**Solution**: Re-authenticate the bot or restart the application

### **Debug Mode**
Enable debug logging by setting:
```env
DEBUG=steam-user:*,steamcommunity:*
```

## 📈 **Production Deployment**

### **Recommended Setup**
- **2-5 Steam bot accounts** for redundancy
- **Load balancing** across multiple bots
- **Monitoring** for bot health and rate limits
- **Automatic re-authentication** when sessions expire

### **Scaling Considerations**
- **Add more bots** as traffic increases
- **Implement bot rotation** to distribute load
- **Monitor Steam's API changes** and update accordingly
- **Backup strategies** for when bots are unavailable

## 🎯 **Expected Results**

With proper Steam bot setup, you should get:

```json
{
  "name": "MAC-10 | BRONZER",
  "wear": "Factory New",
  "pattern": 673,
  "float": 0.00000000,
  "category": "weapon",
  "rarity": "Consumer Grade",
  "iconUrl": "https://community.cloudflare.steamstatic.com/economy/image/...",
  "inspectLink": "steam://rungame/730/76561202255233023/+csgo_econ_action_preview..."
}
```

## 🔗 **Next Steps**

1. **Set up Steam bot accounts** following this guide
2. **Configure environment variables** with bot credentials
3. **Test the system** with real inspect links
4. **Monitor performance** and adjust as needed
5. **Scale up** with additional bots if required

This Steam bot system will give you **real-time, accurate item data** just like the major CS2 trading sites! 