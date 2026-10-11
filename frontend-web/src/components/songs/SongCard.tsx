import type { AlbumWithSongs } from "../../types/album.types"
import { genreLabels } from "shared/schemas/genre.schema"
import { formatDuration } from "../../utils/formatDuration"

interface SongCardProps {
  song: AlbumWithSongs["songs"][number]
  artistName: string
  fallbackCover?: string | null
  onPlay: () => void
}

const SongCard = ({ song, artistName, fallbackCover, onPlay }: SongCardProps) => {
  const cover = song.cover ?? fallbackCover

  return (
    <article className="group flex flex-col gap-3 border-4 border-black bg-button p-3 shadow-hard md:p-4">
      <div className="relative">
        {cover ? (
          <img src={cover} alt="" className="aspect-square w-full border-2 border-black object-cover" />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center border-2 border-black bg-background text-5xl" aria-hidden="true">
            <i className="bi bi-music-note-beamed"></i>
          </div>
        )}

        <button
          type="button"
          onClick={onPlay}
          aria-label={`Reproducir ${song.title}`}
          className="absolute right-2 bottom-2 flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-coral press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black md:opacity-0 md:transition-opacity md:group-focus-within:opacity-100 md:group-hover:opacity-100"
        >
          <i className="bi bi-play-fill text-2xl" aria-hidden="true"></i>
        </button>
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <h3 title={song.title} className="line-clamp-2 text-sm font-bold wrap-break-word md:text-base">{song.title}</h3>
        <p title={artistName} className="truncate text-xs">{artistName}</p>
        <p className="flex justify-between gap-2 text-xs">
          <span className="truncate">{genreLabels[song.genre.name]}</span>
          <span className="shrink-0 tabular-nums">{formatDuration(song.durationSec)}</span>
        </p>
      </div>
    </article>
  )
}

export default SongCard
