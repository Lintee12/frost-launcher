import { ReactNode } from 'react'

function GameGrid({ children }: { children: ReactNode[] }) {
  return <div className="gameGrid">{children}</div>
}

export default GameGrid
