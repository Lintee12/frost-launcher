import { ipcRenderer } from 'electron'
import { Game } from '@types'

type ApiFunction = (...args: any[]) => Promise<any>
type ApiListenerFunction = (channel: string, callback: (...args: any[]) => void) => void

type ApiFunctions = {
  steamSearch: ApiFunction
  steamDetails: ApiFunction
  saveLibrary: ApiFunction
  getLibrary: ApiFunction
  isInLibrary: ApiFunction
  launchGame: ApiFunction
  closeGame: ApiFunction
  isGameRunning: ApiFunction
  getTimePlayed: ApiFunction
  getFilePath: ApiFunction
  setFilePath: ApiFunction
  getTrendingGames: ApiFunction
  on: ApiListenerFunction
  off: ApiListenerFunction
}

export const api: ApiFunctions = {
  steamSearch: (query: string) => ipcRenderer.invoke('steam-search', query),
  steamDetails: (appId: number) => ipcRenderer.invoke('steam-details', appId),
  saveLibrary: (game: Game) => ipcRenderer.invoke('save-library', game),
  getLibrary: () => ipcRenderer.invoke('get-library'),
  isInLibrary: (appId: number) => ipcRenderer.invoke('is-in-library', appId),
  launchGame: (gamePath: string, appId: number) =>
    ipcRenderer.invoke('launch-game', gamePath, appId),
  closeGame: () => ipcRenderer.invoke('close-game'),
  isGameRunning: () => ipcRenderer.invoke('is-game-running'),
  getTimePlayed: (appId: number) => ipcRenderer.invoke('get-time-played', appId),
  getFilePath: (appId: number) => ipcRenderer.invoke('get-file-path', appId),
  setFilePath: (appId: number, filePath: string) =>
    ipcRenderer.invoke('set-file-path', appId, filePath),
  getTrendingGames: () => ipcRenderer.invoke('get-trending-games'),
  on: (channel: string, callback: (...args: any[]) => void) => ipcRenderer.on(channel, callback),
  off: (channel: string, callback: (...args: any[]) => void) =>
    ipcRenderer.removeListener(channel, callback)
}
