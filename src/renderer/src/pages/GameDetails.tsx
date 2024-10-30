import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { SteamAppDetails } from '@types'
import { formatPlaytime, steamUrlBuilder } from '@shared'
import Portal from '@renderer/components/Portal/Portal'
import GameConfig from '@renderer/components/full/GameConfig'

function GameDetails() {
  const params = useParams()
  const [appId, setAppId] = useState<number>(0)
  const [details, setDetails] = useState<SteamAppDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [inLibrary, setInLibrary] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timePlayed, setTimePlayed] = useState<number>(0)
  const [showGameConfig, setShowGameConfig] = useState<boolean>(false)

  const startGame = async () => {
    try {
      const gameExec = await window.api.getFilePath(appId)
      console.log(`launching ${gameExec}`)
      await window.api.launchGame(gameExec, appId)
      setIsPlaying(true)
    } catch (error) {
      console.error(error)
      setIsPlaying(false)
    }
  }

  const stopGame = async () => {
    await window.api.closeGame()
  }

  useEffect(() => {
    async function doStuff() {
      const totalTimePlayed = await window.api.getTimePlayed(appId)
      console.log(appId, totalTimePlayed)
      setTimePlayed(totalTimePlayed)
    }
    doStuff()
  }, [isPlaying])

  useEffect(() => {
    async function doStuff() {
      const totalTimePlayed = await window.api.getTimePlayed(appId)
      console.log(appId, totalTimePlayed)
      setTimePlayed(totalTimePlayed)
    }
    doStuff()
  })

  useEffect(() => {
    const handleGameStopped = async () => {
      setIsPlaying(false)
    }
    window.api.isGameRunning().then(setIsPlaying)

    window.api.on('game-stopped', handleGameStopped)
    return () => window.api.off('game-stopped', handleGameStopped)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (params.id) {
        setAppId(parseInt(params.id))
        setLoading(true)
        setError(null)
        try {
          const result = await window.api.steamDetails(parseInt(params.id))
          const isInLibrary = await window.api.isInLibrary(parseInt(params.id))
          setInLibrary(isInLibrary)
          if (result) {
            setDetails(result)
          } else {
            setError('Game not found.')
          }
        } catch (err) {
          console.error('Fetch error:', err)
          setError('Failed to fetch game details.')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [params.id])

  const handleShowConfig = async () => {
    setShowGameConfig(!showGameConfig)
    const isInLibrary = await window.api.isInLibrary(appId)
    setInLibrary(isInLibrary)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {details ? (
        <>
          {/* Banner */}
          <div className="-mx-4 -mt-4 relative flex flex-col">
            <img
              draggable="false"
              className="select-none"
              src={steamUrlBuilder.libraryHero(appId.toString())}
            ></img>
            <div className="bg-gradient-to-b from-transparent to-black h-[75%] bottom-0 absolute left-0 right-0"></div>
            <div className="absolute left-0 flex flex-row gap-2 m-4 bottom-0 items-end w-full">
              <img
                draggable="false"
                className="select-none w-25% max-w-[25%]"
                alt={details.name}
                src={steamUrlBuilder.logo(appId.toString())}
              ></img>
            </div>
          </div>
          <div className="flex flex-row gap-2 p-2 -mx-4 border-b-[1px] bg-zinc-800 border-zinc-700 items-center sticky top-[-16px] z-10">
            {inLibrary && (
              <>
                <button
                  className={`font-semibold min-w-[115px] min-h-[44px] max-h-[44px] text-sm flex gap-1 items-center justify-center ${isPlaying ? 'bg-zinc-500 hover:bg-red-800' : 'bg-blue-600 hover:bg-blue-800'} text-white p-3 rounded-md active:scale-[0.98] duration-100 transition-all will-change-transform`}
                  onClick={() => {
                    if (isPlaying) {
                      stopGame()
                    } else {
                      startGame()
                    }
                  }}
                >
                  {!isPlaying ? (
                    <>Launch Game</>
                  ) : (
                    <>
                      <X></X>Running
                    </>
                  )}
                </button>
                <button
                  onClick={handleShowConfig}
                  className={`min-w-fit min-h-[44px] max-h-[44px] text-sm flex gap-1 items-center justify-center bg-zinc-900 p-3 rounded-md border-zinc-700 border-[1px] hover:border-zinc-400 active:scale-[0.98] duration-100 transition-all will-change-transform`}
                >
                  Configure
                </button>
                {showGameConfig && (
                  <Portal>
                    <GameConfig
                      gameInfo={{ name: details.name, steam_appid: details.steam_appid }}
                      onClose={handleShowConfig}
                    ></GameConfig>
                  </Portal>
                )}
              </>
            )}
            <span className="text-sm">
              {timePlayed <= 0
                ? 'You have not played this game.'
                : `Time Played: ${formatPlaytime(timePlayed)}`}
            </span>
            {!inLibrary && (
              <button
                onClick={() => {
                  window.api.saveLibrary({ name: details.name, steam_appid: details.steam_appid })
                  setInLibrary(!inLibrary)
                }}
                className="ml-auto min-w-fit whitespace-nowrap min-h-[44px] max-h-[44px] text-sm flex gap-1 items-center bg-zinc-900/50 p-3 rounded-md border-zinc-700 border-[1px] hover:border-zinc-400 active:scale-[0.98] duration-100 transition-all will-change-transform"
              >
                <Plus></Plus>Add To Library
              </button>
            )}
          </div>
          {/* Details */}
          <div className="flex flex-row w-full -mb-4">
            <div className="max-w-[720px] mx-auto pt-6 pr-4 pb-4">
              {details.movies && (
                <video autoPlay={false} controls>
                  <source src={details?.movies[0].mp4.max} type="video/mp4"></source>
                </video>
              )}
              <p
                className="mt-4 details_game"
                dangerouslySetInnerHTML={{ __html: details.detailed_description }}
              ></p>
            </div>
            <div className="flex flex-col gap-2 -mr-4 border-l-zinc-700 border-l-[1px] w-full max-w-[278px] min-w-[256px] p-2">
              <div className="flex flex-col border-b-[1px] border-b-zinc-700">
                <h3 className="text-xl">Published By</h3>
                <p className="text-sm text-zinc-400">{details.publishers}</p>
              </div>
              <div className="flex flex-col border-b-[1px] border-b-zinc-700">
                <h3 className="text-xl">Release Date</h3>
                <p className="text-sm text-zinc-400">{details.release_date.date}</p>
              </div>
              <div className="flex flex-col border-b-[1px] border-b-zinc-700">
                <h3 className="text-xl">Description</h3>
                <p className="text-sm text-zinc-400">{details.short_description}</p>
              </div>
              <div className="flex flex-col border-b-[1px] border-b-zinc-700">
                <h3 className="text-xl">System Requirements</h3>
                <p
                  className="text-sm font-normal sys_req"
                  dangerouslySetInnerHTML={{ __html: details.pc_requirements.minimum }}
                ></p>
                <p
                  className="text-sm font-normal sys_req"
                  dangerouslySetInnerHTML={{ __html: details.pc_requirements.recommended }}
                ></p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>No game details available.</div>
      )}
    </div>
  )
}

export default GameDetails
