import { Minimize, Minus, Square, X } from 'lucide-react'
import { useEffect, useState } from 'react'

function AppBar() {
  const [isMax, setIsMax] = useState<boolean>(false)

  const checkIfMaximized = () => {
    if (typeof window !== 'undefined') {
      const { outerWidth, outerHeight } = window

      setIsMax(outerWidth >= window.screen.availWidth && outerHeight >= window.screen.availHeight)
    }
  }

  useEffect(() => {
    checkIfMaximized()

    const handleResize = () => checkIfMaximized()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleMinimize = () => {
    window.electron.ipcRenderer.send('minimize-window')
  }

  const handleMaximize = () => {
    window.electron.ipcRenderer.send('maximize-window')
  }

  const handleClose = () => {
    window.electron.ipcRenderer.send('close-window')
  }

  return (
    <div className="w-full border-b-[1px] border-zinc-700 flex">
      <span className="p-2 px-4 text-sm">Frost</span>
      <div className="w-full appBar"></div>
      <button className="p-2 px-3 transition-colors hover:bg-zinc-800" onClick={handleMinimize}>
        <Minus className="aspect-square max-w-[16px] max-h-[16px]" />
      </button>
      <button className="p-2 px-3 transition-colors hover:bg-zinc-800" onClick={handleMaximize}>
        {isMax ? (
          <Minimize className="aspect-square max-w-[16px] max-h-[12px]" />
        ) : (
          <Square className="aspect-square max-w-[16px] max-h-[12px]" />
        )}
      </button>
      <button className="p-2 px-3 transition-colors hover:bg-red-700" onClick={handleClose}>
        <X className="aspect-square max-w-[16px] max-h-[16px]" />
      </button>
    </div>
  )
}

export default AppBar
