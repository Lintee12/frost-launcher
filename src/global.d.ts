import { Game } from '@types'

declare global {
  interface Window {
    api: {
      steamSearch: (query: string) => Promise<Game[]>
      steamDetails: (appId: number) => Promise<any>
      saveLibrary: (game: Game) => Promise<void>
      getLibrary: () => Promise<Game[]>
      isInLibrary: (appId: number) => Promise<boolean>
      launchGame: (gamePath: string) => Promise<void>
      closeGame: () => Promise<void>
      isGameRunning: () => Promise<boolean>
      on: (channel: string, listener: (...args: any[]) => void) => void
      off: (channel: string, listener: (...args: any[]) => void) => void
    }
    electron: typeof import('@electron-toolkit/preload').electronAPI
  }
}

export {}
