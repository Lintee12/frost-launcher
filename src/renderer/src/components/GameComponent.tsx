import { steamUrlBuilder } from '@shared'
import { Game } from '@types'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function GameComponent({ details }: { details: Game }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (imageError) {
    return null
  }

  return (
    <Link
      draggable="false"
      to={`/details/${details.steam_appid}`}
      className="border-[1px] border-zinc-700 rounded-md relative aspect-[92/43] overflow-hidden group"
    >
      <img
        src={steamUrlBuilder.library(details.steam_appid.toString())}
        alt={details.name}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          display: imageLoaded ? 'block' : 'none',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        className="will-change-transform duration-300 ease-in-out transform group-hover:scale-[1.08] brightness-100 group-hover:filter-[brightness(0.2)] transition-all group-hover:brightness-50 opacity-100"
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">Loading...</div>
      )}
      {imageLoaded && (
        <div className="absolute inset-0 p-2">
          <div className="bg-gradient-to-b from-transparent to-black h-[50%] bottom-0 absolute left-0 right-0"></div>
          <div className="absolute bottom-2 flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-steam"
              viewBox="0 0 16 16"
            >
              <path d="M.329 10.333A8.01 8.01 0 0 0 7.99 16C12.414 16 16 12.418 16 8s-3.586-8-8.009-8A8.006 8.006 0 0 0 0 7.468l.003.006 4.304 1.769A2.2 2.2 0 0 1 5.62 8.88l1.96-2.844-.001-.04a3.046 3.046 0 0 1 3.042-3.043 3.046 3.046 0 0 1 3.042 3.043 3.047 3.047 0 0 1-3.111 3.044l-2.804 2a2.223 2.223 0 0 1-3.075 2.11 2.22 2.22 0 0 1-1.312-1.568L.33 10.333Z" />
              <path d="M4.868 12.683a1.715 1.715 0 0 0 1.318-3.165 1.7 1.7 0 0 0-1.263-.02l1.023.424a1.261 1.261 0 1 1-.97 2.33l-.99-.41a1.7 1.7 0 0 0 .882.84Zm3.726-6.687a2.03 2.03 0 0 0 2.027 2.029 2.03 2.03 0 0 0 2.027-2.029 2.03 2.03 0 0 0-2.027-2.027 2.03 2.03 0 0 0-2.027 2.027m2.03-1.527a1.524 1.524 0 1 1-.002 3.048 1.524 1.524 0 0 1 .002-3.048" />
            </svg>
            <span className="line-clamp-1">{details.name}</span>
          </div>
        </div>
      )}
    </Link>
  )
}

export default GameComponent
