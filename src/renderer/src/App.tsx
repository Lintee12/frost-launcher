import { Route, Routes, useLocation } from 'react-router-dom'
import Index from './pages/Index'
import Nav from './components/Nav'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import Search from './pages/Search'
import AppBar from './components/AppBar'
import GameDetails from './pages/GameDetails'

const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function App(): JSX.Element {
  const [currentRoute, setCurrentRoute] = useState<string>('Home')
  const location = useLocation()

  useEffect(() => {
    console.log(location.pathname)
    if (location.pathname.includes('/search')) {
      setCurrentRoute('Search Results')
    } else if (location.pathname === '/') {
      setCurrentRoute('Home')
    } else if (location.pathname.includes('/details')) {
      const appId = location.pathname.split('/')[2]
      async function get() {
        const details = await window.api.steamDetails(parseInt(appId))
        setCurrentRoute(details.name)
      }
      get()
    } else {
      setCurrentRoute(capitalize(location.pathname.substring(1)))
    }
  }, [location])

  return (
    <>
      <AppBar></AppBar>
      <div className="flex flex-row">
        <Nav></Nav>
        <div className="flex flex-col w-full">
          <Header route={currentRoute}></Header>
          <main className="flex flex-col gap-4 p-4 max-h-[calc(100vh-108px)] overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search/:query" element={<Search />} />
              <Route path="/details/:id" element={<GameDetails />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  )
}

export default App
