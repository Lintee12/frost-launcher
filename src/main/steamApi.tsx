import { Game, SteamAppDetails } from '@types'
import * as cheerio from 'cheerio'

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

export async function getSteamGameInfo(appId: number): Promise<SteamAppDetails | null> {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`

  try {
    const response = await fetch(url)
    console.log(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const format = data[`${appId}`].data

    return format ? (format as SteamAppDetails) : null
  } catch (error) {
    console.error('Error fetching data from Steam:', error)
    return null
  }
}
