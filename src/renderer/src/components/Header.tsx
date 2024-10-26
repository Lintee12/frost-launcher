import { ChevronLeft, Search } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InputComponent from './InputComponent'

function Header({ route = 'Home' }: { route: string }) {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState<string>('')

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
      <form onSubmit={(e) => handleSearch(e)}>
        <InputComponent
          placeholder="Search..."
          before={<Search width={16} height={16} />}
          onChange={(e) => setSearchValue(e.target.value)}
        ></InputComponent>
      </form>
    </header>
  )
}

export default Header
