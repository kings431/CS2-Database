import dotenv from 'dotenv'

dotenv.config()

export class Config {
  // Database
  readonly databaseUrl: string

  // Scraping settings
  readonly requestDelay: number
  readonly maxRetries: number
  readonly timeout: number

  // Steam API
  readonly steamApiKey?: string

  constructor() {
    this.databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'
    this.requestDelay = parseInt(process.env.REQUEST_DELAY || '1000')
    this.maxRetries = parseInt(process.env.MAX_RETRIES || '3')
    this.timeout = parseInt(process.env.TIMEOUT || '10000')
    this.steamApiKey = process.env.STEAM_API_KEY
  }

  validate(): void {
    if (!this.databaseUrl) {
      throw new Error('DATABASE_URL is required')
    }
  }
} 