// Scraper interface for different marketplaces
export interface SaleData {
  itemName: string
  price: number
  currency: string
  timestamp: Date
  marketplace: string
  condition?: string
  float?: number
  stickers?: string[]
  pattern?: number
}

export interface ScraperConfig {
  enabled: boolean
  rateLimit: number // requests per minute
  apiKey?: string
  baseUrl: string
}

export abstract class BaseScraper {
  protected config: ScraperConfig

  constructor(config: ScraperConfig) {
    this.config = config
  }

  abstract getHistoricalSales(itemName: string, days?: number): Promise<SaleData[]>
  abstract getLiveSales(): Promise<SaleData[]>
  abstract getItemPrice(itemName: string): Promise<number | null>
  
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  protected async makeRequest(url: string, options?: RequestInit): Promise<Response> {
    // Add rate limiting
    await this.delay(60000 / this.config.rateLimit)
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'User-Agent': 'CS2Tracker/1.0',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
  }
}

// Steam Market Scraper
export class SteamScraper extends BaseScraper {
  constructor(apiKey: string) {
    super({
      enabled: true,
      rateLimit: 10, // Steam has strict rate limits
      apiKey,
      baseUrl: 'https://api.steampowered.com',
    })
  }

  async getHistoricalSales(itemName: string, days: number = 30): Promise<SaleData[]> {
    // Implementation for Steam Market historical data
    // This would use Steam's API to get price history
    return []
  }

  async getLiveSales(): Promise<SaleData[]> {
    // Implementation for live Steam Market sales
    return []
  }

  async getItemPrice(itemName: string): Promise<number | null> {
    // Implementation for current Steam Market price
    return null
  }
}

// Buff163 Scraper
export class BuffScraper extends BaseScraper {
  constructor() {
    super({
      enabled: true,
      rateLimit: 30,
      baseUrl: 'https://buff.163.com',
    })
  }

  async getHistoricalSales(itemName: string, days: number = 30): Promise<SaleData[]> {
    // Implementation for Buff163 historical data
    return []
  }

  async getLiveSales(): Promise<SaleData[]> {
    // Implementation for live Buff163 sales
    return []
  }

  async getItemPrice(itemName: string): Promise<number | null> {
    // Implementation for current Buff163 price
    return null
  }
}

// CS.Money Scraper
export class CSMoneyScraper extends BaseScraper {
  constructor() {
    super({
      enabled: true,
      rateLimit: 20,
      baseUrl: 'https://cs.money',
    })
  }

  async getHistoricalSales(itemName: string, days: number = 30): Promise<SaleData[]> {
    // Implementation for CS.Money historical data
    return []
  }

  async getLiveSales(): Promise<SaleData[]> {
    // Implementation for live CS.Money sales
    return []
  }

  async getItemPrice(itemName: string): Promise<number | null> {
    // Implementation for current CS.Money price
    return null
  }
}

// Bitskins Scraper
export class BitskinsScraper extends BaseScraper {
  constructor(apiKey: string) {
    super({
      enabled: true,
      rateLimit: 25,
      apiKey,
      baseUrl: 'https://bitskins.com',
    })
  }

  async getHistoricalSales(itemName: string, days: number = 30): Promise<SaleData[]> {
    // Implementation for Bitskins historical data
    return []
  }

  async getLiveSales(): Promise<SaleData[]> {
    // Implementation for live Bitskins sales
    return []
  }

  async getItemPrice(itemName: string): Promise<number | null> {
    // Implementation for current Bitskins price
    return null
  }
}

// Scraper Manager
export class ScraperManager {
  private scrapers: Map<string, BaseScraper> = new Map()

  constructor() {
    // Initialize scrapers based on environment variables
    if (process.env.STEAM_API_KEY) {
      this.scrapers.set('steam', new SteamScraper(process.env.STEAM_API_KEY))
    }
    
    this.scrapers.set('buff', new BuffScraper())
    this.scrapers.set('csmoney', new CSMoneyScraper())
    
    if (process.env.BITSKINS_API_KEY) {
      this.scrapers.set('bitskins', new BitskinsScraper(process.env.BITSKINS_API_KEY))
    }
  }

  async getAllPrices(itemName: string): Promise<Record<string, number | null>> {
    const prices: Record<string, number | null> = {}
    
    for (const [marketplace, scraper] of Array.from(this.scrapers.entries())) {
      try {
        prices[marketplace] = await scraper.getItemPrice(itemName)
      } catch (error) {
        console.error(`Error getting price from ${marketplace}:`, error)
        prices[marketplace] = null
      }
    }
    
    return prices
  }

  async getHistoricalSales(itemName: string, days: number = 30): Promise<SaleData[]> {
    const allSales: SaleData[] = []
    
    for (const [marketplace, scraper] of Array.from(this.scrapers.entries())) {
      try {
        const sales = await scraper.getHistoricalSales(itemName, days)
        allSales.push(...sales)
      } catch (error) {
        console.error(`Error getting historical sales from ${marketplace}:`, error)
      }
    }
    
    return allSales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  async getLiveSales(): Promise<SaleData[]> {
    const allSales: SaleData[] = []
    
    for (const [marketplace, scraper] of Array.from(this.scrapers.entries())) {
      try {
        const sales = await scraper.getLiveSales()
        allSales.push(...sales)
      } catch (error) {
        console.error(`Error getting live sales from ${marketplace}:`, error)
      }
    }
    
    return allSales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }
}

// Export singleton instance
export const scraperManager = new ScraperManager() 