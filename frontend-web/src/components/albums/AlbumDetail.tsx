import { useAlbum } from "../../hooks/album/useAlbum"
import SongCard from "../songs/SongCard"
import Loader from "../ui/Loader"
import EmptyState from "../ui/EmptyState"
import { usePlayer } from "../../context/PlayerContext"
import { formatDuration } from "../../utils/formatDuration"
import { useState } from "react"
import { useMe } from "../../hooks/auth/useMe"
import { useDeleteAlbum } from "../../hooks/album/useDeleteAlbum"
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal"

interface AlbumDetailProps {
  albumId: string
  onBack: () => void
}

const AlbumDetail = ({ albumId, onBack }: AlbumDetailProps) => {
  const { data: album, isPending, isError, error } = useAlbum(albumId)
  const { playQueue } = usePlayer()
  const { data: me } = useMe()
  const deleteAlbum = useDeleteAlbum()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const artistName = album ? album.artist.username : ""
  const tracks = album?.songs.map(song => ({ ...song, cover: song.cover ?? album.cover, artistName })) ?? []

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit cursor-pointer items-center gap-2 border-2 border-black bg-button px-4 py-2 text-sm font-bold uppercase press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
          Volver
        </button>

        {album && me?.id === album.artist.id && (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="flex w-fit cursor-pointer items-center gap-2 border-2 border-black bg-button px-4 py-2 text-sm font-bold text-red-600 uppercase press hover:bg-red-600 hover:text-white focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <i className="bi bi-trash" aria-hidden="true"></i>
            Eliminar álbum
          </button>
        )}
      </div>

      {isPending && <div className="py-12"><Loader /></div>}
      {isError && <p role="alert" className="text-sm text-red-600">{error.message}</p>}

      {album && (
        <>
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            {album.cover ? (
              <img src={album.cover} alt="" className="size-40 border-4 border-black object-cover shadow-hard md:size-52" />
            ) : (
              <div className="flex size-40 items-center justify-center border-4 border-black bg-green text-6xl shadow-hard md:size-52" aria-hidden="true">
                <i className="bi bi-vinyl-fill"></i>
              </div>
            )}
            <div className="flex min-w-0 flex-col items-start gap-3">
              <span className="border-2 border-black bg-coral px-2 py-0.5 text-xs font-bold tracking-wide uppercase">Álbum</span>
              <h2 className="text-3xl leading-none font-bold uppercase wrap-break-word md:text-5xl 2xl:text-6xl">{album.title}</h2>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <li className="flex items-center gap-1.5 font-bold">
                  <i className="bi bi-person-fill" aria-hidden="true"></i>
                  {artistName}
                </li>
                <li className="flex items-center gap-1.5">
                  <i className="bi bi-music-note-list" aria-hidden="true"></i>
                  {album.songs.length} {album.songs.length === 1 ? "canción" : "canciones"}
                </li>
                {album.songs.length > 0 && (
                  <li className="flex items-center gap-1.5 tabular-nums">
                    <i className="bi bi-clock" aria-hidden="true"></i>
                    {formatDuration(album.songs.reduce((total, song) => total + song.durationSec, 0))}
                  </li>
                )}
              </ul>
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

      {album && confirmOpen && (
        <ConfirmDeleteModal
          title="Eliminar álbum"
          message={<>¿Eliminar <span className="font-bold break-words">{album.title}</span>? Sus canciones no se borran: quedan como singles. No se puede deshacer.</>}
          isPending={deleteAlbum.isPending}
          error={deleteAlbum.error}
          onConfirm={() => deleteAlbum.mutate(album.id, { onSuccess: onBack })}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </section>
  )
}

export default AlbumDetail
