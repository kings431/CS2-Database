import { PrismaClient } from '@prisma/client'
import { SteamScraper } from './scrapers/steam-scraper'
import { ItemDiscovery } from './scrapers/item-discovery'
import { Logger } from './utils/logger'

const logger = new Logger('SteamScraper')
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:C:/Users/marc_/OneDrive/Desktop/CS2-Database/prisma/dev.db'
    }
  }
})

export class SteamScraperService {
  private scraper: SteamScraper
  private discovery: ItemDiscovery

  constructor() {
    this.scraper = new SteamScraper()
    this.discovery = new ItemDiscovery()
  }

  async start(): Promise<void> {
    logger.info('Starting Steam CS2 skin scraper...')
    
    try {
      await this.connectToDatabase()
      await this.scrapeSkins()
    } catch (error) {
      logger.error('Error in scraper service:', error)
    } finally {
      await prisma.$disconnect()
    }
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await prisma.$connect()
      logger.info('Database connected successfully')
    } catch (error) {
      logger.error('Failed to connect to database:', error)
      throw error
    }
  }

  private async scrapeSkins(): Promise<void> {
    logger.info('Starting skin scraping...')
    
    try {
      const itemsToScrape = await this.getItemsToScrape()
      
      if (itemsToScrape.length === 0) {
        logger.info('No items to scrape. All items are up to date.')
        return
      }

      logger.info(`Found ${itemsToScrape.length} items to scrape:`)
      logger.info(`  - ${itemsToScrape.filter(item => item.lastUpdated).length} items to update (older than 6 hours)`)
      logger.info(`  - ${itemsToScrape.filter(item => !item.lastUpdated).length} new items to create`)

      let successCount = 0
      let errorCount = 0

      for (const item of itemsToScrape) {
        try {
          const skinData = await this.scraper.scrapeSkin(item.marketHashName)
          
          if (skinData) {
            await this.saveSkinData(item, skinData)
            successCount++
            
            // Log progress every 10 items
            if (successCount % 10 === 0) {
              logger.info(`Progress: ${successCount}/${itemsToScrape.length} items processed`)
            }
          } else {
            errorCount++
            logger.warn(`No data returned for: ${item.marketHashName}`)
          }

          // Rate limiting - delay between requests
          await this.delay(1000) // 1 second delay
          
        } catch (error) {
          errorCount++
          logger.error(`Failed to scrape ${item.marketHashName}:`, error)
        }
      }

      logger.info(`Scraping completed. Success: ${successCount}, Errors: ${errorCount}`)
      
    } catch (error) {
      logger.error('Error during scraping:', error)
    }
  }

  private async getItemsToScrape(): Promise<any[]> {
    try {
      // Check if we have any existing items
      const existingItems = await prisma.item.findMany({
        take: 1
      })

      if (existingItems.length === 0) {
        logger.info('No existing items found. Starting dynamic item discovery...')
        const discoveredItems = await this.discovery.discoverAllItems()
        return discoveredItems
      }

      // Get items that need updating (older than 6 hours OR missing images/inspect links)
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000)
      
      const itemsToUpdate = await prisma.item.findMany({
        where: {
          OR: [
            { lastUpdated: { lt: sixHoursAgo } },
            { lastUpdated: undefined },
            { iconUrl: null },
            { inspectLink: null }
          ]
        },
        take: 100 // Limit to 100 items per run
      })

      // If no items need updating, force update some items to add images and inspect links
      if (itemsToUpdate.length === 0) {
        logger.info('No items need updating. Forcing update of existing items to add images and inspect links...')
        const forceUpdateItems = await prisma.item.findMany({
          take: 50 // Update 50 items
        })
        return forceUpdateItems
      }

      return itemsToUpdate
      
    } catch (error) {
      logger.error('Error getting items to scrape:', error)
      return []
    }
  }

  private async saveSkinData(item: any, skinData: any): Promise<void> {
    try {
      const existingItem = await prisma.item.findUnique({
        where: { marketHashName: item.marketHashName }
      })

      if (existingItem) {
        // Update existing item
        await prisma.item.update({
          where: { id: existingItem.id },
          data: {
            name: skinData.name,
            category: skinData.category,
            weapon: skinData.weapon,
            skin: skinData.skin,
            collection: skinData.collection,
            source: skinData.source,
            float: skinData.float,
            wear: skinData.wear,
            pattern: skinData.pattern,
            isStatTrak: skinData.isStatTrak,
            isSouvenir: skinData.isSouvenir,
            isNormal: skinData.isNormal,
            age: skinData.age,
            steamPrice: skinData.steamPrice,
            buffPrice: skinData.buffPrice,
            csMoneyPrice: skinData.csMoneyPrice,
            bitskinsPrice: skinData.bitskinsPrice,
            iconUrl: skinData.iconUrl,
            inspectLink: skinData.inspectLink,
            lastUpdated: new Date()
          }
        })
        logger.info(`Updated item: ${skinData.name}`)
      } else {
        // Create new item
        await prisma.item.create({
          data: {
            name: skinData.name,
            marketHashName: skinData.marketHashName,
            rarity: 'Classified', // Default rarity
            category: skinData.category,
            weapon: skinData.weapon,
            skin: skinData.skin,
            collection: skinData.collection,
            source: skinData.source,
            float: skinData.float,
            wear: skinData.wear,
            pattern: skinData.pattern,
            isStatTrak: skinData.isStatTrak,
            isSouvenir: skinData.isSouvenir,
            isNormal: skinData.isNormal,
            age: skinData.age,
            steamPrice: skinData.steamPrice,
            buffPrice: skinData.buffPrice,
            csMoneyPrice: skinData.csMoneyPrice,
            bitskinsPrice: skinData.bitskinsPrice,
            iconUrl: skinData.iconUrl,
            inspectLink: skinData.inspectLink,
            lastUpdated: new Date()
          }
        })
        logger.info(`Created new item: ${skinData.name}`)
      }
    } catch (error) {
      logger.error(`Error saving skin data for ${skinData.name}:`, error)
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Start the scraper service
const service = new SteamScraperService()
service.start().catch(error => {
  logger.error('Failed to start scraper service:', error)
  process.exit(1)
}) 
service.start().catch(console.error) 