# CS2 Database - CS:GO/CS2 Skin Tracker

A comprehensive CS:GO/CS2 skin tracking and management system with real-time data fetching, inventory management, and screenshot generation capabilities.

## Features

### 🎯 Core Features
- **Real-time Skin Data**: Fetches live data from Steam using authenticated bots
- **Inventory Management**: Track and manage your CS:GO/CS2 inventory
- **Screenshot Tool**: Generate high-quality screenshots of any skin with inspect links
- **Database Analytics**: Comprehensive analytics and price tracking
- **Steam Integration**: Direct integration with Steam APIs using authenticated bots

### 🔧 Technical Features
- **Next.js 14**: Modern React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Database management with SQLite
- **Steam Bot System**: Authenticated Steam bots for real data fetching
- **Tailwind CSS**: Modern, responsive UI design
- **NextAuth.js**: Authentication system

## Screenshot Tool

The screenshot tool is the highlight feature that allows you to:
- Paste any CS:GO/CS2 inspect link
- Generate high-quality screenshots with real item data
- Get accurate float values, patterns, and wear conditions
- Uses the same approach as CSFloat for reliable data

### Example Usage
```
steam://rungame/730/76561202255233023/+csgo_econ_action_preview S76561198320430286A44803380965D4631504492215634113
```

## Steam Bot System

The application uses authenticated Steam bots to fetch real item data:
- **Real-time Data**: Gets actual float values, patterns, and wear conditions
- **CSFloat Approach**: Uses the same methodology as CSFloat for reliable data
- **Multiple Bots**: Load balancing across multiple Steam accounts
- **Fallback System**: Database lookup and intelligent fallback if bots are unavailable

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kings431/CS2-Database.git
   cd CS2-Database
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="file:./prisma/dev.db"
   
   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   
   # Steam API
   STEAM_API_KEY="your-steam-api-key"
   
   # Steam Bot Configuration (for real item data fetching)
   STEAM_BOT_1_USERNAME=your_bot_username
   STEAM_BOT_1_PASSWORD=your_bot_password
   STEAM_BOT_1_SHARED_SECRET=your_bot_shared_secret
   STEAM_BOT_1_IDENTITY_SECRET=your_bot_identity_secret
   
   STEAM_BOT_2_USERNAME=your_bot_username_2
   STEAM_BOT_2_PASSWORD=your_bot_password_2
   STEAM_BOT_2_SHARED_SECRET=your_bot_shared_secret_2
   STEAM_BOT_2_IDENTITY_SECRET=your_bot_identity_secret_2
   
   # Environment
   NODE_ENV=development
   PORT=3000
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Steam Bot Setup

To use the real data fetching feature, you need to set up Steam bots:

1. **Create Steam Accounts**: Create dedicated Steam accounts for the bots
2. **Enable Steam Guard**: Set up Steam Guard with shared secrets
3. **Configure Environment**: Add bot credentials to your `.env` file
4. **Test Authentication**: The system will automatically authenticate bots on startup

### Bot Requirements
- Steam accounts with CS:GO/CS2
- Steam Guard enabled with shared secrets
- Valid credentials in environment variables

## API Endpoints

### Screenshot API
- **POST** `/api/screenshot`
- **Body**: `{ "inspectLink": "steam://..." }`
- **Response**: Item data with screenshot URL

### Inventory API
- **GET** `/api/inventory/steam`
- **Response**: User's Steam inventory

### Database API
- **GET** `/api/database/skins`
- **Response**: Available skins in database

## Project Structure

```
CS2-Database/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── database/          # Database management
│   ├── inventory/         # Inventory tracking
│   └── screenshot/        # Screenshot tool
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── steam-bots.ts     # Steam bot management
│   ├── prisma.ts         # Database client
│   └── auth.ts           # Authentication
├── prisma/               # Database schema
└── scrapers/             # Data scraping tools
```

## Key Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Steam Integration**: steam-user, steam-totp, steamcommunity
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS, Lucide React icons

## Development

### Running in Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Open database browser
npx prisma studio
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by CSFloat's inspect link API approach
- Uses Steam's official APIs and community tools
- Built with modern web technologies for reliability and performance

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Note**: This project requires Steam bot accounts for full functionality. Make sure to follow Steam's terms of service when setting up bots. 