import { usePlayer } from "../../context/PlayerContext"
import { formatDuration } from "../../utils/formatDuration"

const controlBtn = "flex size-10 cursor-pointer items-center justify-center rounded-full text-xl hover:bg-green focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"

const PlayerBar = () => {
  const { track, isPlaying, currentTime, duration, toggle, next, prev, seek } = usePlayer()

  if (!track) return null

  const total = Math.floor(duration || 0)

  return (
    <div className="sticky bottom-0 z-30 flex flex-col gap-2 border-t-4 border-black bg-button px-4 py-3 md:h-25 md:flex-row md:items-center md:gap-6 md:px-8 md:py-0 xl:px-10">
      {/* key cambia con cada canción: React remonta el bloque y la animación vuelve a correr */}
      <div key={track.id} className="flex min-w-0 items-center gap-3 motion-safe:animate-slide-in md:w-1/4">
        {track.cover ? (
          <img src={track.cover} alt="" className="size-12 shrink-0 rounded-lg border-2 border-black object-cover" />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-background" aria-hidden="true">
            <i className="bi bi-music-note-beamed"></i>
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-sm font-bold">{track.title}</p>
          <p className="truncate text-xs">{track.artistName}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <button type="button" onClick={prev} aria-label="Anterior" className={controlBtn}>
            <i className="bi bi-skip-start-fill" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
            className="flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-coral shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"} text-2xl`} aria-hidden="true"></i>
          </button>
          <button type="button" onClick={next} aria-label="Siguiente" className={controlBtn}>
            <i className="bi bi-skip-end-fill" aria-hidden="true"></i>
          </button>
        </div>

        <div className="flex w-full items-center gap-2 text-xs tabular-nums">
          <span className="hidden md:inline">{formatDuration(Math.floor(currentTime))}</span>
          <input
            type="range"
            min={0}
            max={total}
            value={Math.floor(currentTime)}
            onChange={e => seek(Number(e.target.value))}
            aria-label="Progreso de la canción"
            className="w-full cursor-pointer accent-black"
          />
          <span className="hidden md:inline">{formatDuration(total)}</span>
        </div>
      </div>

      <div className="hidden md:block md:w-1/4" />
    </div>
  )
}

export default PlayerBar
