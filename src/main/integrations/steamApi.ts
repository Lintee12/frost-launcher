import { Game, SteamAppDetails } from '@types'
import * as cheerio from 'cheerio'

const ONE_HOUR = 60 * 60 * 1000

export default async function steamSearch(query: string): Promise<Game[]> {
  const url = `https://store.steampowered.com/search/?term=${encodeURIComponent(query)}&supportedlang=english&category1=998`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()
    const $ = cheerio.load(data)
    const games = $('div#search_resultsRows a')
    const results: Game[] = []

    games.each((_index, el) => {
      const name = $(el)
        .find('div.responsive_search_name_combined div.search_name span.title')
        .text()
        .trim()
      const steam_appid = $(el).attr('data-ds-appid')

      if (name.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          name,
          steam_appid: steam_appid ? parseInt(steam_appid, 10) : 0
        })
      }
    })

    return results
  } catch (error) {
    console.error('Error fetching data from Steam:', error)
    return []
  }
}

const gameInfoCache: { [key: number]: { data: SteamAppDetails | null; timestamp: number } } = {}

export async function getSteamGameInfo(appId: number): Promise<SteamAppDetails | null> {
  const currentTime = Date.now()

  if (gameInfoCache[appId] && currentTime - gameInfoCache[appId].timestamp < ONE_HOUR) {
    return gameInfoCache[appId].data
  }

  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`

  try {
    const response = await fetch(url)
    console.log(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const format = data[`${appId}`].data

    gameInfoCache[appId] = {
      data: format ? (format as SteamAppDetails) : null,
      timestamp: currentTime
    }

    return format ? (format as SteamAppDetails) : null
  } catch (error) {
    console.error('Error fetching data from Steam:', error)
    return null
  }
}

let trendingCache: Game[] | null = null
let trendingCacheTimestamp: number | null = null

export async function getTrendingGames(): Promise<Game[]> {
  const currentTime = Date.now()

  if (trendingCache && trendingCacheTimestamp && currentTime - trendingCacheTimestamp < ONE_HOUR) {
    return trendingCache
  }

  const url = `https://store.steampowered.com/search/?category1=998&os=win&supportedlang=english&hidef2p=1&filter=globaltopsellers&ndl=1`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()
    const $ = cheerio.load(data)
    const games = $('div#search_resultsRows a')
    const results: Game[] = []

    games.each((_index, el) => {
      const name = $(el)
        .find('div.responsive_search_name_combined div.search_name span.title')
        .text()
        .trim()
      const steam_appid = $(el).attr('data-ds-appid')

      results.push({
        name,
        steam_appid: steam_appid ? parseInt(steam_appid, 10) : 0
      })
    })

    trendingCache = results
    trendingCacheTimestamp = currentTime
    return results
  } catch (error) {
    console.error('Error fetching data from Steam:', error)
    return []
  }
}
