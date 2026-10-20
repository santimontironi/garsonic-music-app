import CreatePlaylistModal from "../playlists/CreatePlaylistModal"
import PlaylistCard from "../playlists/PlaylistCard"
import PlaylistDetail from "../playlists/PlaylistDetail"
import Loader from "../ui/Loader"
import EmptyState from "../ui/EmptyState"
import { useMyPlaylists } from "../../hooks/playlist/useMyPlaylists"
import { useState } from "react"

const MyPlaylists = () => {

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const { data: playlists, isPending, isError, error } = useMyPlaylists()

  if (selectedPlaylistId) {
    return <PlaylistDetail playlistId={selectedPlaylistId} onBack={() => setSelectedPlaylistId(null)} />
  }

  const createButton = (
    <button
      type="button"
      onClick={() => setModalOpen(true)}
      className="flex cursor-pointer items-center justify-center gap-2 border-2 border-black bg-coral px-6 py-3 text-sm font-bold uppercase press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base"
    >
      <i className="bi bi-plus-lg" aria-hidden="true"></i>
      Crear playlist
    </button>
  )

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold uppercase md:text-3xl">Mis playlists</h2>
        {playlists && playlists.length > 0 && createButton}
      </div>

      {isPending && <div className="py-12"><Loader /></div>}
      {isError && <p role="alert" className="text-sm text-red-600">{error.message}</p>}

      {playlists?.length === 0 && (
        <EmptyState
          icon="bi-music-note-list"
          title="Sin playlists todavía"
          message="Juntá tus canciones favoritas en una playlist para escucharlas cuando quieras. ¿Querés crear la primera?"
          actionLabel="Crear playlist"
          onAction={() => setModalOpen(true)}
        />
      )}

      {playlists && playlists.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
          {playlists.map(playlist => (
            <li key={playlist.id}>
              <PlaylistCard playlist={playlist} onClick={() => setSelectedPlaylistId(playlist.id)} />
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <CreatePlaylistModal onClose={() => setModalOpen(false)} />
      )}
    </section>
  )
}

export default MyPlaylists
