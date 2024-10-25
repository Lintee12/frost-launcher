import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

function IconLink({ icon, text, to }: { icon: ReactNode; text: ReactNode; to: string }) {
  return (
    <Link
      draggable="false"
      to={to}
      className="flex flex-row gap-2 items-center justify-start text-sm font-normal p-2 py-1.5 hover:bg-zinc-800 rounded-md w-full"
    >
      {icon}
      <span>{text}</span>
    </Link>
  )
}

export default IconLink
