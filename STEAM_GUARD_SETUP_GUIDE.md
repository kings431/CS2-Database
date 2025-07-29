# Steam Guard Secrets Setup Guide

## 🎯 **Method 1: Steam Desktop Authenticator (Easiest)**

### **Step 1: Download Steam Desktop Authenticator**
1. Go to: https://github.com/Jessecar96/SteamDesktopAuthenticator/releases
2. Download the latest release for Windows
3. Extract the ZIP file to a folder

### **Step 2: Set Up Steam Guard**
1. **Run Steam Desktop Authenticator** as Administrator
2. **Click "Add Account"**
3. **Enter your Steam credentials**:
   - Username: `hellcase69699`
   - Password: `your_password`
4. **Follow the setup process** - it will handle Steam Guard automatically
5. **Save the account data** when prompted

### **Step 3: Export the Secrets**
1. **Right-click on your account** in the Steam Desktop Authenticator
2. **Select "Export Account"**
3. **Save the file** - it will contain your secrets in JSON format
4. **Open the exported file** - it will look like this:
   ```json
   {
     "account_name": "hellcase69699",
     "shared_secret": "YOUR_SHARED_SECRET_HERE",
     "identity_secret": "YOUR_IDENTITY_SECRET_HERE",
     "device_id": "YOUR_DEVICE_ID"
   }
   ```

### **Step 4: Add to Your Environment**
Add these to your `.env` file:
```env
STEAM_BOT_1_USERNAME=hellcase69699
STEAM_BOT_1_PASSWORD=your_password
STEAM_BOT_1_SHARED_SECRET=YOUR_SHARED_SECRET_HERE
STEAM_BOT_1_IDENTITY_SECRET=YOUR_IDENTITY_SECRET_HERE
```

## 🔧 **Method 2: Manual Steam Guard Setup**

### **Step 1: Create a New Steam Account**
1. **Create a new Steam account** specifically for your bot
2. **Don't enable Steam Guard yet**

### **Step 2: Install Steam Desktop Authenticator**
1. **Download and install** Steam Desktop Authenticator
2. **Add the new account** to the desktop authenticator
3. **The app will automatically set up Steam Guard** and give you the secrets

### **Step 3: Get the Secrets**
1. **Export the account data** from Steam Desktop Authenticator
2. **Copy the shared_secret and identity_secret** from the exported file

## 🚀 **Method 3: Use Steam Mobile App (Advanced)**

### **Step 1: Root Your Android Device**
1. **Root your Android device** (required to access app data)
2. **Install Steam Mobile App** and set up Steam Guard

### **Step 2: Extract the Data**
1. **Navigate to**: `/data/data/com.valvesoftware.android.steam.community/files/`
2. **Find the `maFiles` folder**
3. **Look for files named**: `[steamid].maFile`
4. **Open the .maFile** - it's a JSON file with your secrets

## ⚠️ **Important Security Notes**

- **Never share your secrets** - they give full access to your Steam account
- **Use dedicated accounts** for bots, not your main account
- **Keep the secrets secure** - store them in environment variables
- **Backup the secrets** - you'll need them to recover access

## 🧪 **Testing Your Setup**

Once you have the secrets, test them:

```bash
# Add your secrets to .env file
STEAM_BOT_1_USERNAME=your_username
STEAM_BOT_1_PASSWORD=your_password
STEAM_BOT_1_SHARED_SECRET=your_shared_secret
STEAM_BOT_1_IDENTITY_SECRET=your_identity_secret

# Test the Steam bot system
node test-steam-bots.js
```

## 🎯 **Expected Results**

With proper Steam Guard secrets, you should see:
```
✅ Bot cs2db_bot_1 authenticated successfully
✅ Bot cs2db_bot_1 web session established
🤖 Steam bot system initialized
📊 Bot Status: { totalBots: 2, availableBots: 1, totalRequestsToday: 0 }
```

## 🔗 **Next Steps**

1. **Use Steam Desktop Authenticator** to get your secrets
2. **Add the secrets to your .env file**
3. **Test the Steam bot system**
4. **Get real item data** from your inspect links!

The Steam Desktop Authenticator method is the most reliable and doesn't require rooting your device. 