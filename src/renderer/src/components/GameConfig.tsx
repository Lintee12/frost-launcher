import { Game } from '@types'
import { motion } from 'framer-motion'
import { File, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import InputComponent from './InputComponent'
import ButtonComponent from './ButtonComponent'

function GameConfig({ onClose, gameInfo }: { onClose: () => void; gameInfo: Game }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [filePath, setFilePath] = useState<string>('')

  useEffect(() => {
    async function setData() {
      const gamePath = await window.api.getFilePath(gameInfo.steam_appid)
      setFilePath(gamePath)
    }
    setData()
  }, [])

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileName = file.name
      if (fileName.endsWith('.exe')) {
        console.log(file)
        setFilePath(file.path)
        await window.api.setFilePath(gameInfo.steam_appid, file.path)
      } else {
        console.error('Selected file is not an executable.')
      }
    }
  }

  return (
    <>
      <div onClick={() => onClose()} className="fixed inset-0 bg-black/50"></div>

      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.0 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 0.2, ease: 'anticipate' }}
          style={{ transformOrigin: 'center' }}
          className="w-full max-w-[720px]"
        >
          <div className="pointer-events-auto rounded-md flex flex-col bg-zinc-900 text-zinc-300">
            <div className="flex justify-between items-center p-3 border-b-zinc-700 border-b-[1px]">
              <h3 className="mb-0 text-xl">{gameInfo.name}</h3>
              <button onClick={onClose}>
                <X></X>
              </button>
            </div>
            <div className="flex flex-col w-full p-3 gap-1">
              <span>Game Executable</span>
              <div className="flex gap-2 items-center">
                <div className="w-full">
                  <InputComponent
                    className="min-h-[42px] max-h-[42px]"
                    disabled={true}
                    value={filePath}
                  ></InputComponent>
                </div>
                <input
                  type="file"
                  accept=".exe"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <ButtonComponent onClick={handleButtonClick} className="min-h-[42px] max-h-[42px]">
                  <span className="whitespace-nowrap flex flex-row gap-2 min-w-fit items-center">
                    <File width={16} height={16} />
                    Select
                  </span>
                </ButtonComponent>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default GameConfig
