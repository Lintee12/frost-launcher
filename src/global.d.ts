import { Game, SteamAppDetails } from '@types'

declare global {
  interface Window {
    api: {
      steamSearch: (query: string) => Promise<Game[]>
      steamDetails: (appId: number) => Promise<SteamAppDetails>
      getLibrary: () => Game[]
      saveLibrary: (game: Game) => {}
      isInLibrary: (appId: number) => Promise<boolean>
    }
    electron: {
      ipcRenderer: {
        send: (channel: string, data?: any) => void
      }
    }
  }
}

export {}
