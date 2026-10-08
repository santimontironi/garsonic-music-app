import Loader from "../ui/Loader"
import type { Song } from "../../types/song.types"
import { useMyAlbums } from "../../hooks/album/useMyAlbums"
import { useUpdateSongAlbum } from "../../hooks/song/useUpdateSongAlbum"

interface AddToAlbumModalProps {
    song: Song
    onClose: () => void
}

const AddToAlbumModal = ({ song, onClose }: AddToAlbumModalProps) => {

    const { data: albums, isPending: loadingAlbums } = useMyAlbums()
    const { mutate: updateAlbum, isPending, isError, error } = useUpdateSongAlbum()

    const options = albums?.filter(album => album.id !== song.albumId)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-to-album-title"
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-3xl border-4 border-black bg-background shadow-hard-lg"
            >
                <div className="flex items-center justify-between gap-4 border-b-4 border-black bg-coral px-6 py-4">
                    <h2 id="add-to-album-title" className="truncate text-lg font-bold uppercase">Agregar a álbum</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-button shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto p-6">
                    <p className="truncate text-xs">Canción: <span className="font-bold">{song.title}</span></p>

                    {loadingAlbums && <div className="py-6"><Loader /></div>}

                    {options?.length === 0 && (
                        <p className="text-sm">No tenés otros álbumes. Creá uno desde "Mis álbumes".</p>
                    )}

                    {options && options.length > 0 && (
                        <ul className="flex flex-col gap-3">
                            {options.map(album => (
                                <li key={album.id}>
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => updateAlbum({ songId: song.id, albumId: album.id }, { onSuccess: onClose })}
                                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 border-black bg-button p-2 text-left shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-green hover:shadow-[2px_2px_0_0_#000] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60"
                                    >
                                        {album.cover ? (
                                            <img src={album.cover} alt="" className="size-11 shrink-0 rounded-lg border-2 border-black object-cover" />
                                        ) : (
                                            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-green" aria-hidden="true">
                                                <i className="bi bi-vinyl-fill"></i>
                                            </span>
                                        )}
                                        <span className="truncate text-sm font-bold">{album.title}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {isError && <p role="alert" className="text-center text-sm text-red-600">{error.message}</p>}
                </div>
            </div>
        </div>
    )
}

export default AddToAlbumModal
