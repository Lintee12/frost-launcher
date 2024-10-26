import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { Game } from '@types'
import { getGameData, setGameData } from '../helpers/gameData'

const userDataPath = app.getPath('userData')
const libraryFilePath = path.join(userDataPath, 'library.json')

export function addToLibrary(item: Game) {
  const library = getLibrary()

  const exists = isInLibrary(item.steam_appid)

  if (exists) {
    const updatedLibrary = library.filter(
      (existingGame) => existingGame.steam_appid !== item.steam_appid
    )
    fs.writeFileSync(libraryFilePath, JSON.stringify(updatedLibrary, null, 2))
  } else {
    library.push(item)
    fs.writeFileSync(libraryFilePath, JSON.stringify(library, null, 2))
  }
}

export function getLibrary(): Game[] {
  if (!fs.existsSync(libraryFilePath)) {
    return []
  }
  const data = fs.readFileSync(libraryFilePath, 'utf-8')
  return JSON.parse(data) as Game[]
}

export function isInLibrary(appid: number): boolean {
  const library = getLibrary()
  return library.some((existingGame) => existingGame.steam_appid === appid)
}

//game data
export function getTimePlayed(appId: number): number {
  const gameData = getGameData(appId)
  return gameData ? gameData.seconds : 0
}

export function getGamePath(appId: number): string {
  const gameData = getGameData(appId)
  return gameData ? gameData.execPath : ''
}

export function setTimePlayed(appId: number, seconds: number): void {
  const gameData = getGameData(appId) || { appId, execPath: '', seconds: 0 }
  gameData.seconds = seconds
  setGameData(gameData)
}

export function setGamePath(appId: number, execPath: string): void {
  const gameData = getGameData(appId) || { appId, execPath: '', seconds: 0 }
  gameData.execPath = execPath
  setGameData(gameData)
}
