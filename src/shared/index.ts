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
