export class Logger {
  private prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  info(message: string, ...args: any[]): void {
    console.log(`[${new Date().toISOString()}] [${this.prefix}] [INFO] ${message}`, ...args)
  }

  error(message: string, ...args: any[]): void {
    console.error(`[${new Date().toISOString()}] [${this.prefix}] [ERROR] ${message}`, ...args)
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[${new Date().toISOString()}] [${this.prefix}] [WARN] ${message}`, ...args)
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${new Date().toISOString()}] [${this.prefix}] [DEBUG] ${message}`, ...args)
    }
  }
} 