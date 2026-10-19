import type { MyPlaylist } from "../../types/playlist.types"

interface PlaylistListProps {
    playlists: MyPlaylist[]
    songId: string
    disabled: boolean
    onSelect: (playlist: MyPlaylist) => void
    onRemove: (playlist: MyPlaylist) => void
}

const PlaylistList = ({ playlists, songId, disabled, onSelect, onRemove }: PlaylistListProps) => {
    return (
        <ul className="flex flex-col gap-3">
            {playlists.map(playlist => {
                const isAdded = playlist.songs.some(song => song.songId === songId)

                return (
                    <li key={playlist.id} className="flex items-stretch gap-2">
                        <button
                            type="button"
                            disabled={disabled || isAdded}
                            onClick={() => onSelect(playlist)}
                            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 border-2 border-black bg-button p-2 text-left press hover:bg-green focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60"
                        >
                            {playlist.image ? (
                                <img src={playlist.image} alt="" className="size-11 shrink-0 border-2 border-black object-cover" />
                            ) : (
                                <span className="flex size-11 shrink-0 items-center justify-center border-2 border-black bg-green" aria-hidden="true">
                                    <i className="bi bi-music-note-list"></i>
                                </span>
                            )}
                            <span className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-bold">{playlist.name}</span>
                                {isAdded && <span className="text-xs">Ya está en esta playlist</span>}
                            </span>
                        </button>

                        {isAdded && (
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => onRemove(playlist)}
                                aria-label={`Quitar de ${playlist.name}`}
                                className="flex w-12 shrink-0 cursor-pointer items-center justify-center border-2 border-black bg-coral press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}

export default PlaylistList
