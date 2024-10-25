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

  if (library.length > 0) {
    return (
      <GameGrid>
        {library.map((result, index) => (
          <GameComponent details={result} key={index} />
        ))}
      </GameGrid>
    )
  } else {
    return <span className="text-zinc-400">Empty...</span>
  }
}

export default Library
