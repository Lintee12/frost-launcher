import Library from '@renderer/components/full/Library'
import TrendingGames from '@renderer/components/full/TrendingGames'

function Index() {
  return (
    <div className="flex flex-col gap-8">
      <TrendingGames></TrendingGames>
      <Library></Library>
    </div>
  )
}

export default Index
