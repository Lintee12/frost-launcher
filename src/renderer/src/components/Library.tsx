import GameComponent from '@renderer/components/GameComponent'
import GameGrid from '@renderer/components/GameGrid'
import { Game } from '@types'
import { useEffect, useState } from 'react'

function Library() {
  const [library, setLibrary] = useState<Game[]>([])

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const games = await window.api.getLibrary()
        setLibrary(games || [])
      } catch (error) {
        console.error('Error fetching library:', error)
      }
    }

    fetchLibrary()
  }, [])

  return (
    <div className="flex flex-col">
      <h3>Your Library</h3>
      {library.length > 0 ? (
        <GameGrid>
          {library.map((result, index) => (
            <GameComponent details={result} key={index} />
          ))}
        </GameGrid>
      ) : (
        <span className="text-zinc-400">Empty...</span>
      )}
    </div>
  )
}

export default Library
