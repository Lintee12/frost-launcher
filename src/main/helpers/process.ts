import { spawn, ChildProcess } from 'child_process'
import { BrowserWindow } from 'electron'
import { getTimePlayed, setTimePlayed } from '../save/saveData'
import path from 'path'

let gameProcess: ChildProcess | null = null
let timer: number = 0
let currentAppId: number = 0

export function launchGame(gamePath: string, mainWindow: BrowserWindow, appId: number) {
  if (gameProcess) {
    console.log('Game is already running')
    return
  }

  gameProcess = spawn(gamePath, [], { cwd: path.dirname(gamePath) })
  currentAppId = appId
  timer = getTimePlayed(appId)

  const interval = setInterval(() => {
    if (gameProcess) {
      timer++
      console.log(`Timer for appId ${appId}: ${timer} seconds`)
    } else {
      clearInterval(interval)
    }
  }, 1000)

  gameProcess.on('close', () => {
    clearInterval(interval)
    setTimePlayed(currentAppId, timer)
    mainWindow.webContents.send('game-stopped')
    gameProcess = null
  })
}

export function closeGame() {
  if (gameProcess) {
    setTimePlayed(currentAppId, timer)
    gameProcess.kill()
    gameProcess = null
  }
}

export function isGameRunning(): boolean {
  return gameProcess !== null
}
