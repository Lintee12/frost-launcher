import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { Game } from '@types'

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
