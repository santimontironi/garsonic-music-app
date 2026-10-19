import { useState } from "react"
import Loader from "../ui/Loader"
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal"
import PlaylistList from "./PlaylistList"
import type { Song } from "../../types/song.types"
import type { MyPlaylist } from "../../types/playlist.types"
import { useMyPlaylists } from "../../hooks/playlist/useMyPlaylists"
import { useAddSongToPlaylist } from "../../hooks/playlist/useAddSongToPlaylist"
import { useRemoveSongFromPlaylist } from "../../hooks/playlist/useRemoveSongFromPlaylist"

interface AddToPlaylistModalProps {
    song: Pick<Song, "id" | "title">
    onClose: () => void
}

const AddToPlaylistModal = ({ song, onClose }: AddToPlaylistModalProps) => {

    const { data: playlists, isPending: loadingPlaylists } = useMyPlaylists()
    const { mutate: addSong, isPending, isError, error } = useAddSongToPlaylist()
    const removeSong = useRemoveSongFromPlaylist()
    const [playlistToRemove, setPlaylistToRemove] = useState<MyPlaylist | null>(null)

    return (
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-to-playlist-title"
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-md flex-col overflow-hidden border-4 border-black bg-background shadow-hard-lg"
            >
                <div className="flex items-center justify-between gap-4 border-b-4 border-black bg-coral px-6 py-4">
                    <h2 id="add-to-playlist-title" className="truncate text-lg font-bold uppercase">Agregar a playlist</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center border-2 border-black bg-button press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto p-6">
                    <p className="truncate text-xs">Canción: <span className="font-bold">{song.title}</span></p>

                    {loadingPlaylists && <div className="py-6"><Loader /></div>}

                    {playlists?.length === 0 && (
                        <p className="text-sm">No tenés playlists. Creá una desde "Mis playlists".</p>
                    )}

                    {playlists && playlists.length > 0 && (
                        <PlaylistList
                            playlists={playlists}
                            songId={song.id}
                            disabled={isPending}
                            onSelect={playlist => addSong({ playlistId: playlist.id, songId: song.id }, { onSuccess: onClose })}
                            onRemove={setPlaylistToRemove}
                        />
                    )}

                    {isError && <p role="alert" className="text-center text-sm text-red-600">{error.message}</p>}
                </div>
            </div>
        </div>

        {playlistToRemove && (
            <ConfirmDeleteModal
                title="Quitar canción"
                message={<>¿Quitar <span className="font-bold wrap-break-words">{song.title}</span> de <span className="font-bold wrap-break-words">{playlistToRemove.name}</span>?</>}
                isPending={removeSong.isPending}
                error={removeSong.error}
                onConfirm={() => removeSong.mutate({ playlistId: playlistToRemove.id, songId: song.id }, { onSuccess: () => setPlaylistToRemove(null) })}
                onClose={() => { setPlaylistToRemove(null); removeSong.reset() }}
            />
        )}
        </>
    )
}

export default AddToPlaylistModal
