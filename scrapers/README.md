# CS2 Skin Scrapers

This directory contains separate scraper services for collecting CS2 skin data from various sources and uploading it to the main database.

## 🏗️ Architecture

```
CS2-Database/
├── scrapers/                    # Scraper services
│   ├── steam-scraper/          # Steam Market scraper
│   ├── buff-scraper/           # Buff.163 scraper (future)
│   ├── csmoney-scraper/        # CSMoney scraper (future)
│   └── bitskins-scraper/       # BitSkins scraper (future)
└── shared/                     # Shared utilities (future)
```

## 🎯 Why Separate Scrapers?

### ✅ Advantages:
- **Scalability**: Run scrapers independently on different servers
- **Reliability**: One scraper failure doesn't affect the web app
- **Rate Limiting**: Each service can handle different rate limits
- **Maintenance**: Update scrapers without deploying the main app
- **Resource Management**: Scrapers can run on cheaper infrastructure
- **Legal Compliance**: Easier to respect each site's ToS

### 📊 Data Flow:
```
Scraper Service → Database → Web Application
```

## 🚀 Getting Started

### 1. Steam Scraper

The Steam scraper collects data from Steam Community Market.

```bash
cd scrapers/steam-scraper

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your database URL
# DATABASE_URL="file:../../prisma/dev.db"

# Build the scraper
npm run build

# Run the scraper
npm start
```

### 2. Environment Variables

```env
# Database connection (points to main app database)
DATABASE_URL="file:../../prisma/dev.db"

# Scraping settings
REQUEST_DELAY=1000      # Delay between requests (ms)
MAX_RETRIES=3          # Max retries per request
TIMEOUT=10000          # Request timeout (ms)

# Steam API (optional)
STEAM_API_KEY="your_steam_api_key_here"

# Environment
NODE_ENV=development
```

## 📋 Scraper Features

### Steam Scraper
- ✅ Fetches skin data from Steam Community Market
- ✅ Extracts prices, rarity, wear conditions
- ✅ Handles StatTrak™ and Souvenir items
- ✅ Rate limiting and error handling
- ✅ Automatic retry logic

### Planned Scrapers
- 🔄 **Buff.163 Scraper**: Chinese market prices
- 🔄 **CSMoney Scraper**: CSMoney marketplace data
- 🔄 **BitSkins Scraper**: BitSkins marketplace data

## 🛠️ Development

### Adding a New Scraper

1. Create a new directory: `scrapers/new-scraper/`
2. Copy the structure from `steam-scraper/`
3. Implement the scraper logic
4. Add to the main deployment pipeline

### Scraper Structure
```
scraper-name/
├── src/
│   ├── index.ts           # Main service entry point
│   ├── scrapers/          # Scraper implementations
│   ├── config.ts          # Configuration
│   └── utils/             # Utilities
├── prisma/
│   └── schema.prisma      # Database schema reference
├── package.json
├── tsconfig.json
└── env.example
```

## 🔄 Scheduling

### Manual Execution
```bash
# Run once
npm run scrape

# Run in development mode
npm run dev
```

### Automated Scheduling (Future)
- **Cron Jobs**: Run scrapers every 6-12 hours
- **Docker**: Containerized deployment
- **Cloud Functions**: Serverless execution
- **Message Queues**: Distributed processing

## 📊 Data Sources

### Steam Community Market
- **URL**: https://steamcommunity.com/market
- **Rate Limit**: ~1 request/second
- **Data**: Prices, descriptions, wear conditions

### Buff.163 (Planned)
- **URL**: https://buff.163.com
- **Rate Limit**: TBD
- **Data**: Chinese market prices

### CSMoney (Planned)
- **URL**: https://csmoney.com
- **Rate Limit**: TBD
- **Data**: Marketplace prices

### BitSkins (Planned)
- **URL**: https://bitskins.com
- **Rate Limit**: TBD
- **Data**: Marketplace prices

## 🚨 Legal Considerations

### Rate Limiting
- Respect each site's rate limits
- Use appropriate delays between requests
- Implement exponential backoff

### Terms of Service
- Review each site's ToS before scraping
- Consider using official APIs when available
- Implement proper user agents

### Data Usage
- Only collect publicly available data
- Don't overload servers
- Respect robots.txt files

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Ensure DATABASE_URL points to the main app database
   DATABASE_URL="file:../../prisma/dev.db"
   ```

2. **Rate Limiting**
   ```bash
   # Increase delay between requests
   REQUEST_DELAY=2000
   ```

3. **Timeout Errors**
   ```bash
   # Increase timeout
   TIMEOUT=15000
   ```

### Logs
- Check console output for detailed logs
- Use `NODE_ENV=development` for debug logs
- Monitor success/error counts

## 📈 Monitoring

### Metrics to Track
- Success rate per scraper
- Data freshness (last updated timestamps)
- Error rates and types
- Response times
- Rate limit hits

### Health Checks
- Database connectivity
- Scraper availability
- Data quality checks
- Price anomaly detection

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket connections
- **Machine Learning**: Price prediction models
- **Data Validation**: Automated quality checks
- **API Endpoints**: REST APIs for external access
- **Dashboard**: Monitoring and management UI 