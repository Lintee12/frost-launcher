import GameComponent from '@renderer/components/full/GameComponent'
import GameGrid from '@renderer/components/full/GameGrid'
import { Game } from '@types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function Search() {
  const params = useParams()
  const [searchResults, setSearchResults] = useState<Game[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSearchResults([])
    const fetchData = async () => {
      if (params.query) {
        setLoading(true)
        setError(null)
        try {
          const results = await window.api.steamSearch(params.query)
          setSearchResults(results)
        } catch (err) {
          console.error('Search error:', err)
          setError('Failed to fetch search results.')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [params.query])

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {searchResults.length > 0 ? (
        <GameGrid>
          {searchResults.map((result, index) => (
            <GameComponent details={result} key={index} />
          ))}
        </GameGrid>
      ) : (
        !loading && <p>No results found.</p>
      )}
    </>
  )
}

export default Search
