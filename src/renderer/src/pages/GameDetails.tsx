import { useEffect, useState } from 'react'
import { Pause, Play, Plus, X } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { SteamAppDetails } from '@types'
import { steamUrlBuilder } from '@shared'

function GameDetails() {
  const params = useParams()
  const [appId, setAppId] = useState<number>(0)
  const [details, setDetails] = useState<SteamAppDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [inLibrary, setInLibrary] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const startGame = async () => {
    try {
      await window.api.launchGame(
        'E:\\Evan\\Dev\\game-launcher-v4\\dist\\win-unpacked\\game-launcher-v.exe'
      )
      setIsPlaying(true)
    } catch (error) {
      console.error(error)
      setIsPlaying(false)
    }
  }

  const stopGame = async () => {
    await window.api.closeGame()
    setIsPlaying(false)
  }

  useEffect(() => {
    const handleGameStopped = () => setIsPlaying(false)
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
              <div className="w-full"></div>
              <button
                className={`font-semibold mr-2 min-w-[115px] h-fit whitespace-nowrap text-sm sm:text-base flex gap-1 items-center justify-center ${isPlaying ? 'bg-zinc-500 hover:bg-red-800' : 'bg-blue-600 hover:bg-blue-800'} text-white p-3 rounded-md active:scale-[0.98] duration-100 transition-all will-change-transform`}
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
                onClick={() => {
                  window.api.saveLibrary({ name: details.name, steam_appid: details.steam_appid })
                  setInLibrary(!inLibrary)
                }}
                className=" mr-8 min-w-[156px] h-fit whitespace-nowrap text-sm sm:text-base flex gap-1 items-center justify-center bg-zinc-900/50 p-3 rounded-md border-zinc-700 border-[1px] hover:border-zinc-400 active:scale-[0.98] duration-100 transition-all will-change-transform"
              >
                {!inLibrary ? (
                  <>
                    <Plus></Plus>Add To Library
                  </>
                ) : (
                  <>
                    <X></X>Remove
                  </>
                )}
              </button>
            </div>
          </div>
          {/* Details */}
          <div className="max-w-[1000px] mx-auto pt-4">
            <h3>Trailer</h3>
            {details.movies && (
              <video autoPlay={false} controls>
                <source src={details?.movies[0].mp4.max} type="video/mp4"></source>
              </video>
            )}
            {/* <p dangerouslySetInnerHTML={{ __html: details.detailed_description }}></p> */}
          </div>
        </>
      ) : (
        <div>No game details available.</div>
      )}
    </div>
  )
}

export default GameDetails
