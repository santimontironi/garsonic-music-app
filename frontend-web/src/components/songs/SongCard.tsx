import type { AlbumWithSongs } from "../../types/album.types"
import { genreLabels } from "shared/schemas/genre.schema"
import { formatDuration } from "../../utils/formatDuration"
import FavSongButton from "./FavSongButton"

interface SongCardProps {
  song: AlbumWithSongs["songs"][number]
  artistName: string
  fallbackCover?: string | null
  showFav?: boolean
  onPlay: () => void
  onRemove?: () => void
  onAddToPlaylist?: () => void
}

const SongCard = ({ song, artistName, fallbackCover, showFav, onPlay, onRemove, onAddToPlaylist }: SongCardProps) => {
  const cover = song.cover ?? fallbackCover

  return (
    <article className="group flex h-full flex-col gap-3 border-4 border-black bg-button p-3 shadow-hard md:p-4 xl:p-5">
      <div className="relative">
        <div className="aspect-square overflow-hidden border-2 border-black">
          {cover ? (
            <img src={cover} alt="" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" />
          ) : (
            <div className="flex size-full items-center justify-center bg-background text-5xl" aria-hidden="true">
              <i className="bi bi-music-note-beamed"></i>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onPlay}
          aria-label={`Reproducir ${song.title}`}
          className="absolute right-2 bottom-2 flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-coral press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black md:opacity-0 md:transition-opacity md:group-focus-within:opacity-100 md:group-hover:opacity-100"
        >
          <i className="bi bi-play-fill text-2xl" aria-hidden="true"></i>
        </button>

        {showFav && <FavSongButton songId={song.id} title={song.title} />}

        {onAddToPlaylist && (
          <button
            type="button"
            onClick={onAddToPlaylist}
            aria-label={`Agregar ${song.title} a una playlist`}
            title="Agregar a playlist"
            className="absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center border-2 border-black bg-button press hover:bg-green focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <i className="bi bi-plus-lg" aria-hidden="true"></i>
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Quitar ${song.title} de la playlist`}
            title="Quitar de la playlist"
            className="absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center border-2 border-black bg-button text-red-600 press hover:bg-red-600 hover:text-white focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black md:opacity-0 md:transition-opacity md:group-focus-within:opacity-100 md:group-hover:opacity-100"
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="text-sm font-bold wrap-break-word md:text-base xl:text-lg">{song.title}</h3>
        <p title={artistName} className="truncate text-xs xl:text-sm">{artistName}</p>
        <p className="flex justify-between gap-2 text-xs xl:text-sm">
          <span className="truncate">{genreLabels[song.genre.name]}</span>
          <span className="shrink-0 tabular-nums">{formatDuration(song.durationSec)}</span>
        </p>
      </div>
    </article>
  )
}

export default SongCard
