import { useAlbum } from "../../hooks/album/useAlbum"
import SongCard from "../songs/SongCard"
import Loader from "../ui/Loader"
import EmptyState from "../ui/EmptyState"
import { usePlayer } from "../../context/PlayerContext"

interface AlbumDetailProps {
  albumId: string
  onBack: () => void
}

const AlbumDetail = ({ albumId, onBack }: AlbumDetailProps) => {
  const { data: album, isPending, isError, error } = useAlbum(albumId)
  const { playQueue } = usePlayer()

  const artistName = album ? album.artist.username : ""
  const tracks = album?.songs.map(song => ({ ...song, cover: song.cover ?? album.cover, artistName })) ?? []

  return (
    <section className="flex flex-col gap-6">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit cursor-pointer items-center gap-2 rounded-full border-2 border-black bg-button px-4 py-2 text-sm font-bold uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        <i className="bi bi-arrow-left" aria-hidden="true"></i>
        Volver
      </button>

      {isPending && <div className="py-12"><Loader /></div>}
      {isError && <p role="alert" className="text-sm text-red-600">{error.message}</p>}

      {album && (
        <>
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            {album.cover ? (
              <img src={album.cover} alt="" className="size-40 rounded-2xl border-4 border-black object-cover shadow-hard md:size-52" />
            ) : (
              <div className="flex size-40 items-center justify-center rounded-2xl border-4 border-black bg-green text-6xl shadow-hard md:size-52" aria-hidden="true">
                <i className="bi bi-vinyl-fill"></i>
              </div>
            )}
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-xs font-bold uppercase">Álbum</p>
              <h2 className="text-2xl font-bold uppercase wrap-break-words md:text-4xl">{album.title}</h2>
              <p className="text-sm">
                {album.artist.name} {album.artist.surname} · {album.songs.length} {album.songs.length === 1 ? "canción" : "canciones"}
              </p>
            </div>
          </header>

          {album.songs.length === 0 ? (
            <EmptyState
              icon="bi-music-note-beamed"
              title="Álbum vacío"
              message="Todavía no hay canciones en este álbum."
            />
          ) : (
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
              {album.songs.map((song, i) => (
                <li key={song.id}>
                  <SongCard song={song} artistName={artistName} fallbackCover={album.cover} onPlay={() => playQueue(tracks, i)} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

export default AlbumDetail
