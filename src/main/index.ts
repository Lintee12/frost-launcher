import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import steamSearch, { getSteamGameInfo } from './steamApi'
import { Game } from '@types'
import {
  addToLibrary,
  getGamePath,
  getLibrary,
  getTimePlayed,
  isInLibrary,
  setGamePath
} from './save/saveData'
import { closeGame, isGameRunning, launchGame } from './process'

let mainWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

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
