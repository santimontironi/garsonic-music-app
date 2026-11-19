import type { Playlist } from "../../types/playlist.types";

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: () => void;
}

const PlaylistCard = ({ playlist, onClick }: PlaylistCardProps) => {
  const songs = playlist._count?.songs ?? 0

  return (
    <button type="button" onClick={onClick} className="group flex w-full cursor-pointer flex-col overflow-hidden border-4 border-black bg-button text-left shadow-hard transition-[translate,box-shadow] duration-150 ease-out hover:-translate-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-1 active:shadow-none motion-reduce:transition-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black">
      <div className="aspect-square overflow-hidden border-b-4 border-black">
        {playlist.image ? (
          <img src={playlist.image} alt="" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" />
        ) : (
          <div className="flex size-full items-center justify-center bg-green text-5xl" aria-hidden="true">
            <i className="bi bi-music-note-list"></i>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 md:p-4">
        <h3 className="truncate text-sm font-bold md:text-base">{playlist.name}</h3>
        <p className="text-xs text-black/70">{songs} {songs === 1 ? "canción" : "canciones"}</p>
        <p className="mt-1 flex w-fit items-center gap-1 border-2 border-black bg-background px-2 py-0.5 text-xs font-bold uppercase">
          <i className={playlist.isPublic ? "bi bi-globe" : "bi bi-lock-fill"} aria-hidden="true"></i>
          {playlist.isPublic ? "Pública" : "Privada"}
        </p>
      </div>
    </button>
  )
}

export default PlaylistCard
