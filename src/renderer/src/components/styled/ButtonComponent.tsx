import { forwardRef, MouseEventHandler, ReactNode, useRef, useState } from 'react'

interface Props {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
}

const ButtonComponent = forwardRef<HTMLInputElement, Props>(({ children, onClick, className }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputFocus, setInputFocus] = useState<boolean>(false)

  return (
    <div
      className={`${className} flex flex-row items-center gap-1 bg-zinc-950 outline-none border-[1px] rounded-md p-2 py-2 font-normal text-sm transition-colors duration-200 border-zinc-700 ${
        inputFocus ? 'border-zinc-200' : 'hover:border-zinc-600'
      } focus-within:border-zinc-200`}
    >
      <button
        onFocus={() => {
          inputRef.current?.select()
          setInputFocus(true)
        }}
        onBlur={() => setInputFocus(false)}
        onClick={onClick}
        className="bg-transparent outline-0 border-0 group"
      >
        {children}
      </button>
    </div>
  )
})

export default ButtonComponent
