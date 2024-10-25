import { HomeIcon, LayoutGrid, Library, Settings } from 'lucide-react'
import IconLink from './IconLink'

interface Props {}

function Nav(props: Props) {
  const {} = props

  return (
    <div className="h-full flex flex-col gap-3 p-4  border-r-[1px] border-zinc-700 min-w-[200px] min-h-screen">
      <h3 className="whitespace-nowrap mb-0">Frost Launcher</h3>
      <IconLink icon={<HomeIcon width={18} height={18}></HomeIcon>} text={'Home'} to={'/'} />
      <IconLink
        icon={<LayoutGrid width={18} height={18}></LayoutGrid>}
        text={'Browse'}
        to={'/browse'}
      />
      <IconLink
        icon={<Library width={18} height={18}></Library>}
        text={'Library'}
        to={'/library'}
      />
      <IconLink
        icon={<Settings width={18} height={18}></Settings>}
        text={'Settings'}
        to={'/settings'}
      />
      <div className="flex flex-col gap-2 pt-2">
        <span>Quick Launch</span>
        <span className="text-sm text-zinc-400">Empty...</span>
      </div>
    </div>
  )
}

export default Nav
