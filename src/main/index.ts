import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import steamSearch, { getSteamGameInfo, getTrendingGames } from './integrations/steamApi'
import { Game } from '@types'
import {
  addToLibrary,
  getGamePath,
  getLibrary,
  getTimePlayed,
  isInLibrary,
  setGamePath
} from './save/saveData'
import { closeGame, isGameRunning, launchGame } from './helpers/process'

let mainWindow: BrowserWindow

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.on('minimize-window', () => {
    if (mainWindow) {
      mainWindow.minimize()
    }
  })

  ipcMain.on('maximize-window', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    }
  })

  ipcMain.on('close-window', () => {
    if (mainWindow) {
      mainWindow.close()
    }
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('steam-search', async (_event, query: string) => {
  return await steamSearch(query)
})

ipcMain.handle('steam-details', async (_event, appId: number) => {
  return await getSteamGameInfo(appId)
})

ipcMain.handle('save-library', (_event, game: Game) => {
  addToLibrary(game)
})

ipcMain.handle('get-library', (_event) => {
  return getLibrary()
})

ipcMain.handle('is-in-library', (_event, appId: number) => {
  return isInLibrary(appId)
})

ipcMain.handle('launch-game', async (_, gamePath: string, appId: number) => {
  launchGame(gamePath, mainWindow, appId)
})

ipcMain.handle('close-game', () => {
  closeGame()
})

ipcMain.handle('is-game-running', () => {
  return isGameRunning()
})

ipcMain.handle('get-time-played', (_event, appId: number) => {
  return getTimePlayed(appId)
})

ipcMain.handle('get-file-path', (_event, appId: number) => {
  return getGamePath(appId)
})

ipcMain.handle('set-file-path', (_event, appId: number, filePath: string) => {
  return setGamePath(appId, filePath)
})

ipcMain.handle('get-trending-games', () => {
  return getTrendingGames()
})
