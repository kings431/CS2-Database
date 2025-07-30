declare module 'globaloffensive' {
  import { EventEmitter } from 'events'
  export default class GlobalOffensive extends EventEmitter {
    constructor(client: any)
    launch(): void
    inspectItem(steamId: string, assetId: string, d: string, callback: (err: any, item: any) => void): void
  }
}

declare module 'steam-user' {
  import { EventEmitter } from 'events'
  export default class SteamUser extends EventEmitter {
    logOn(options: any): void
  }
}

declare module 'steam-totp' {
  export function generateAuthCode(sharedSecret: string): string
}

declare module 'steamcommunity' {
  import { EventEmitter } from 'events'
  export default class SteamCommunity extends EventEmitter {
    constructor(options?: any)
    login(credentials: any, callback: (err: any, sessionID: string, cookies: string[]) => void): void
    getUserInventory(steamID: string, appID: number, contextID: number, options: any, callback: (err: any, inventory: any) => void): void
  }
} 