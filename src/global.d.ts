import { api } from './ipcEvents'

declare global {
  interface Window {
    api: typeof api
    electron: typeof import('@electron-toolkit/preload').electronAPI
  }
}

export {}
