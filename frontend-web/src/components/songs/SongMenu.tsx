import { useState } from "react"
import type { Song } from "../../types/song.types"
import { useUpdateSongAlbum } from "../../hooks/song/useUpdateSongAlbum"
import AddToAlbumModal from "./AddToAlbumModal"

interface SongMenuProps {
  song: Song
}

const itemClass = "flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-xs font-bold uppercase hover:bg-green focus-visible:bg-green focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"

const SongMenu = ({ song }: SongMenuProps) => {

  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { mutate: updateAlbum, isPending } = useUpdateSongAlbum()

  const openModal = () => {
    setMenuOpen(false)
    setModalOpen(true)
  }

  const removeFromAlbum = () => {
    updateAlbum({ songId: song.id, albumId: null }, { onSuccess: () => setMenuOpen(false) })
  }

  return (
    <div className="relative shrink-0" onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}>
      <button
        type="button"
        onClick={() => setMenuOpen(o => !o)}
        aria-label={`Opciones de ${song.title}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="flex size-9 cursor-pointer items-center justify-center rounded-full border-2 border-transparent hover:border-black hover:bg-button focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        <i className="bi bi-three-dots-vertical" aria-hidden="true"></i>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <div role="menu" className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border-2 border-black bg-button shadow-hard">
            <button type="button" role="menuitem" onClick={openModal} className={itemClass}>
              <i className="bi bi-plus-lg" aria-hidden="true"></i>
              {song.albumId ? "Mover a otro álbum" : "Agregar a álbum"}
            </button>
            {song.albumId && (
              <button type="button" role="menuitem" onClick={removeFromAlbum} disabled={isPending} className={`${itemClass} border-t-2 border-black`}>
                <i className="bi bi-dash-lg" aria-hidden="true"></i>
                {isPending ? "Quitando..." : "Quitar del álbum"}
              </button>
            )}
          </div>
        </>
      )}

      {modalOpen && <AddToAlbumModal song={song} onClose={() => setModalOpen(false)} />}
    </div>
  )
}

export default SongMenu
