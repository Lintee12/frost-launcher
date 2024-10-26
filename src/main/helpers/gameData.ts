import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const userDataPath = app.getPath('userData')
const gameDataFilePath = path.join(userDataPath, 'gameData.json')

interface GameData {
  appId: number
  seconds: number
  execPath: string
}

export function getGameData(appId: number): GameData | null {
  if (!fs.existsSync(gameDataFilePath)) {
    return null
  }

  const data = fs.readFileSync(gameDataFilePath, 'utf-8')
  const games: GameData[] = JSON.parse(data)

  return games.find((game) => game.appId === appId) || null
}

export function setGameData(gameData: GameData): void {
  let games: GameData[] = []

  if (fs.existsSync(gameDataFilePath)) {
    const data = fs.readFileSync(gameDataFilePath, 'utf-8')
    games = JSON.parse(data) as GameData[]
  }

  const gameIndex = games.findIndex((game) => game.appId === gameData.appId)

  if (gameIndex !== -1) {
    games[gameIndex] = gameData
  } else {
    games.push(gameData)
  }

  console.log(games)

  fs.writeFileSync(gameDataFilePath, JSON.stringify(games, null, 2), 'utf-8')
}
