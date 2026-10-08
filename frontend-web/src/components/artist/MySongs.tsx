import CreateSongModal from "../songs/CreateSongModal"
import SongList from "../songs/SongList"
import EmptyState from "../ui/EmptyState"
import Loader from "../ui/Loader"
import { useMySongs } from "../../hooks/song/useMySongs"
import { useState } from "react"
import { useMe } from "../../hooks/auth/useMe"
import { usePlayer } from "../../context/PlayerContext"

const MySongs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: songs, isPending, isError, error } = useMySongs()
  const { data: me } = useMe()
  const { playQueue } = usePlayer()

  const artistName = me ? `${me.name} ${me.surname}` : ""
  const tracks = songs?.map(song => ({ ...song, artistName })) ?? []

  const uploadButton = (
    <button
      type="button"
      onClick={() => setIsModalOpen(true)}
      className="flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-black bg-coral px-6 py-3 text-sm font-bold uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base"
    >
      <i className="bi bi-plus-lg" aria-hidden="true"></i>
      Subir canción
    </button>
  )

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold uppercase md:text-3xl">Mis canciones</h2>
        {songs && songs.length > 0 && uploadButton}
      </div>

      {isPending && <div className="py-12"><Loader /></div>}
      {isError && <p role="alert" className="text-sm text-red-600">{error.message}</p>}

      {songs?.length === 0 && (
        <EmptyState
          icon="bi-music-note-beamed"
          title="Tu estudio está en silencio"
          message="Todavía no subiste canciones. Subí la primera y empezá a sonar en Garsonic."
          actionLabel="Subir canción"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {songs && songs.length > 0 && <SongList songs={songs} onPlay={i => playQueue(tracks, i)} />}

      {isModalOpen && <CreateSongModal closeModal={() => setIsModalOpen(false)} />}
    </section>
  )
}

export default MySongs
