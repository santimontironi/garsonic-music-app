import CreateAlbumModal from "../albums/CreateAlbumModal"
import AlbumCard from "../albums/AlbumCard"
import EmptyState from "../ui/EmptyState"
import { useMyAlbums } from "../../hooks/album/useMyAlbums"
import { useState } from "react"

const MyAlbums = () => {

  const [modalOpen, setModalOpen] = useState(false)
  const { data: albums, isPending, isError, error } = useMyAlbums()

  const createButton = (
    <button
      type="button"
      onClick={() => setModalOpen(true)}
      className="flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-black bg-coral px-6 py-3 text-sm font-bold uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base"
    >
      <i className="bi bi-plus-lg" aria-hidden="true"></i>
      Crear álbum
    </button>
  )

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold uppercase md:text-3xl">Mis álbumes</h2>
        {albums && albums.length > 0 && createButton}
      </div>

      {isPending && <p className="text-sm">Cargando álbumes...</p>}
      {isError && <p role="alert" className="text-sm text-red-600">{error.message}</p>}

      {albums?.length === 0 && (
        <EmptyState
          icon="bi-vinyl-fill"
          title="Sin álbumes todavía"
          message="Agrupá tus canciones en un álbum para que tus oyentes las escuchen juntas. ¿Querés crear el primero?"
          actionLabel="Crear álbum"
          onAction={() => setModalOpen(true)}
        />
      )}

      {albums && albums.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
          {albums.map(album => (
            <li key={album.id}>
              <AlbumCard album={album} />
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <CreateAlbumModal onClose={() => setModalOpen(false)} />
      )}
    </section>
  )
}

export default MyAlbums
