import { spawn, ChildProcess } from 'child_process'
import { BrowserWindow } from 'electron'

let gameProcess: ChildProcess | null = null

export function launchGame(gamePath: string, mainWindow: BrowserWindow) {
  if (gameProcess) {
    console.log('Game is already running')
    return
  }

  gameProcess = spawn(gamePath)

  gameProcess.on('close', () => {
    mainWindow.webContents.send('game-stopped')
    gameProcess = null
  })
}

export function closeGame() {
  if (gameProcess) {
    gameProcess.kill()
    gameProcess = null
  }
}

export function isGameRunning(): boolean {
  return gameProcess !== null
}
