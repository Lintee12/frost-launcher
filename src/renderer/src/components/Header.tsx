import { ChevronLeft, Search } from 'lucide-react'
import { FormEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Header({ route = 'Home' }: { route: string }) {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState<string>('')
  const searchRef = useRef<HTMLInputElement>(null)
  const [searchFocus, setSearchFocus] = useState(false)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/search/${encodeURIComponent(searchValue)}`)
  }

  return (
    <header className="flex flex-row items-center gap-2 p-4 border-b-[1px] border-zinc-700">
      <div className="flex flex-row gap-2 items-center">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft></ChevronLeft>
        </button>
        <h1 className="whitespace-nowrap select-none text-lg mb-0">{route}</h1>
      </div>
      <div className="w-full"></div>
      <div
        className={`flex flex-row items-center gap-1 bg-zinc-800 outline-none border-[1px] rounded-md p-2 py-2 font-normal text-sm transition-colors duration-200 border-zinc-700 ${searchFocus ? 'border-zinc-200' : 'hover:border-zinc-600'}`}
      >
        <Search width={16} height={16}></Search>
        <form onSubmit={(e) => handleSearch(e)}>
          <input
            ref={searchRef}
            onSubmit={handleSearch}
            onFocus={() => {
              searchRef.current?.select()
              setSearchFocus(true)
            }}
            onBlur={() => setSearchFocus(false)}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            value={searchValue}
            className="bg-transparent outline-0 border-0 group"
          ></input>
        </form>
      </div>
    </header>
  )
}

export default Header
