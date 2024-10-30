import { ChangeEventHandler, forwardRef, ReactNode, useRef, useState } from 'react'

interface Props {
  before?: ReactNode
  onChange?: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  disabled?: boolean
  className?: string
  value?: string
}

const InputComponent = forwardRef<HTMLInputElement, Props>(
  ({ before, onChange, placeholder, disabled = false, className, value }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [inputFocus, setInputFocus] = useState<boolean>(false)

    return (
      <div
        className={`${className} flex flex-row items-center gap-1 bg-zinc-950 outline-none border-[1px] rounded-md p-2 py-2 font-normal text-sm transition-colors duration-200 border-zinc-700 ${
          inputFocus ? 'border-zinc-200' : 'hover:border-zinc-600'
        } focus-within:border-zinc-200`}
      >
        {before && before}
        <input
          ref={inputRef}
          onFocus={() => {
            inputRef.current?.select()
            setInputFocus(true)
          }}
          onBlur={() => setInputFocus(false)}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-transparent outline-0 border-0 group w-full "
          disabled={disabled}
          value={value}
        />
      </div>
    )
  }
)

export default InputComponent
