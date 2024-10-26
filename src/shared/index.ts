export const steamUrlBuilder = {
  library: (appId: string) => `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/header.jpg`,
  libraryHero: (appId: string) =>
    `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_hero.jpg`,
  logo: (appId: string) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/logo.png`,
  cover: (appId: string) =>
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`,
  icon: (appId: string, clientIcon: string) =>
    `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${appId}/${clientIcon}.ico`
}

export function formatPlaytime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  }

  const minutes = seconds / 60

  if (minutes < 60) {
    return `${minutes.toFixed(1)} minute${minutes !== 1 ? 's' : ''}`
  }

  const hours = minutes / 60
  return `${hours.toFixed(1)} hour${hours !== 1 ? 's' : ''}`
}
