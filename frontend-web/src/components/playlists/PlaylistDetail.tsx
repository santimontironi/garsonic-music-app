import { usePlaylist } from "../../hooks/playlist/usePlaylist"
import SongCard from "../songs/SongCard"
import Loader from "../ui/Loader"
import EmptyState from "../ui/EmptyState"
import { usePlayer } from "../../context/PlayerContext"
import { formatDuration } from "../../utils/formatDuration"
import { useState } from "react"
import { useMe } from "../../hooks/auth/useMe"
import { useDeletePlaylist } from "../../hooks/playlist/useDeletePlaylist"
import { useUpdatePlaylist } from "../../hooks/playlist/useUpdatePlaylist"
import { useRemoveSongFromPlaylist } from "../../hooks/playlist/useRemoveSongFromPlaylist"
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal"

interface PlaylistDetailProps {
  playlistId: string
  onBack: () => void
}

const PlaylistDetail = ({ playlistId, onBack }: PlaylistDetailProps) => {
  const { data: playlist, isPending, isError, error } = usePlaylist(playlistId)
  const { playQueue } = usePlayer()
  const { data: me } = useMe()
  const deletePlaylist = useDeletePlaylist()
  const removeSong = useRemoveSongFromPlaylist()
  const updatePlaylist = useUpdatePlaylist()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [songToRemove, setSongToRemove] = useState<{ id: string; title: string } | null>(null)

  const isOwner = !!playlist && me?.id === playlist.owner.id
  const songs = playlist?.songs.map(({ song }) => song) ?? []
  const tracks = songs.map(song => ({ ...song, artistName: song.artist.username }))

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

        {isOwner && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updatePlaylist.mutate({ playlistId: playlist.id, isPublic: !playlist.isPublic })}
              disabled={updatePlaylist.isPending}
              className="flex w-fit cursor-pointer items-center gap-2 border-2 border-black bg-button px-4 py-2 text-sm font-bold uppercase press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60"
            >
              <i className={playlist.isPublic ? "bi bi-lock-fill" : "bi bi-globe"} aria-hidden="true"></i>
              {playlist.isPublic ? "Hacer privada" : "Hacer pública"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex w-fit cursor-pointer items-center gap-2 border-2 border-black bg-button px-4 py-2 text-sm font-bold text-red-600 uppercase press hover:bg-red-600 hover:text-white focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              <i className="bi bi-trash" aria-hidden="true"></i>
              Eliminar playlist
            </button>
          </div>
        )}
      </div>

      {updatePlaylist.isError && <p role="alert" className="text-sm text-red-600">{updatePlaylist.error.message}</p>}

      {isPending && <div className="py-12"><Loader /></div>}
      {isError && <p role="alert" className="text-sm text-red-600">{error.message}</p>}

      {playlist && (
        <>
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            {playlist.image ? (
              <img src={playlist.image} alt="" className="size-40 border-4 border-black object-cover shadow-hard md:size-52" />
            ) : (
              <div className="flex size-40 items-center justify-center border-4 border-black bg-green text-6xl shadow-hard md:size-52" aria-hidden="true">
                <i className="bi bi-music-note-list"></i>
              </div>
            )}
            <div className="flex min-w-0 flex-col items-start gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="border-2 border-black bg-coral px-2 py-0.5 text-xs font-bold tracking-wide uppercase">Playlist</span>
                <span className="flex items-center gap-1 border-2 border-black bg-button px-2 py-0.5 text-xs font-bold uppercase">
                  <i className={playlist.isPublic ? "bi bi-globe" : "bi bi-lock-fill"} aria-hidden="true"></i>
                  {playlist.isPublic ? "Pública" : "Privada"}
                </span>
              </div>
              <h2 className="text-3xl leading-none font-bold uppercase wrap-break-word md:text-5xl 2xl:text-6xl">{playlist.name}</h2>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <li className="flex items-center gap-1.5 font-bold">
                  <i className="bi bi-person-fill" aria-hidden="true"></i>
                  {playlist.owner.username}
                </li>
                <li className="flex items-center gap-1.5">
                  <i className="bi bi-music-note-list" aria-hidden="true"></i>
                  {songs.length} {songs.length === 1 ? "canción" : "canciones"}
                </li>
                {songs.length > 0 && (
                  <li className="flex items-center gap-1.5 tabular-nums">
                    <i className="bi bi-clock" aria-hidden="true"></i>
                    {formatDuration(songs.reduce((total, song) => total + song.durationSec, 0))}
                  </li>
                )}
              </ul>
            </div>
          </header>

          {songs.length === 0 ? (
            <EmptyState
              icon="bi-music-note-beamed"
              title="Playlist vacía"
              message="Todavía no agregaste canciones a esta playlist."
            />
          ) : (
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
              {songs.map((song, i) => (
                <li key={song.id}>
                  <SongCard
                    song={song}
                    artistName={song.artist.username}
                    onPlay={() => playQueue(tracks, i)}
                    onRemove={isOwner ? () => setSongToRemove(song) : undefined}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {playlist && songToRemove && (
        <ConfirmDeleteModal
          title="Quitar canción"
          message={<>¿Quitar <span className="font-bold wrap-break-words">{songToRemove.title}</span> de la playlist?</>}
          isPending={removeSong.isPending}
          error={removeSong.error}
          onConfirm={() => removeSong.mutate({ playlistId: playlist.id, songId: songToRemove.id }, { onSuccess: () => setSongToRemove(null) })}
          onClose={() => { setSongToRemove(null); removeSong.reset() }}
        />
      )}

      {playlist && confirmOpen && (
        <ConfirmDeleteModal
          title="Eliminar playlist"
          message={<>¿Eliminar <span className="font-bold wrap-break-words">{playlist.name}</span>? No se puede deshacer.</>}
          isPending={deletePlaylist.isPending}
          error={deletePlaylist.error}
          onConfirm={() => deletePlaylist.mutate(playlist.id, { onSuccess: onBack })}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </section>
  )
}

export default PlaylistDetail
