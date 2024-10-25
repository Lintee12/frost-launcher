import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Game } from '@types'

// Custom APIs for renderer
const api = {
  steamSearch: async (query: string) => {
    return await ipcRenderer.invoke('steam-search', query)
  },
  steamDetails: async (appId: number) => {
    return await ipcRenderer.invoke('steam-details', appId)
  },
  saveLibrary: (game: Game) => {
    return ipcRenderer.invoke('save-library', game)
  },
  getLibrary: () => {
    return ipcRenderer.invoke('get-library')
  },
  isInLibrary: (appId: number) => {
    return ipcRenderer.invoke('is-in-library', appId)
  },
  launchGame: (gamePath: string) => ipcRenderer.invoke('launch-game', gamePath),
  closeGame: () => ipcRenderer.invoke('close-game'),
  isGameRunning: () => ipcRenderer.invoke('is-game-running'),

  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, listener)
  },
  off: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, listener)
  }
}

// Use `contextBridge` to expose APIs
if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
