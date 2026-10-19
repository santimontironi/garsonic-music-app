import type { Playlist } from "../../types/playlist.types";

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: () => void;
}

const PlaylistCard = ({ playlist, onClick }: PlaylistCardProps) => {
  const songs = playlist._count?.songs ?? 0

  return (
    <button type="button" onClick={onClick} className="flex w-full cursor-pointer flex-col overflow-hidden border-4 border-black bg-button text-left press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black">
      {playlist.image ? (
        <img src={playlist.image} alt="" className="aspect-square w-full border-b-4 border-black object-cover" />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center border-b-4 border-black bg-green text-5xl" aria-hidden="true">
          <i className="bi bi-music-note-list"></i>
        </div>
      )}
      <div className="flex flex-col gap-1 p-3 md:p-4">
        <h3 className="truncate text-sm font-bold md:text-base">{playlist.name}</h3>
        <p className="text-xs">{songs} {songs === 1 ? "canción" : "canciones"}</p>
        <p className="mt-1 flex w-fit items-center gap-1 border-2 border-black bg-background px-2 py-0.5 text-xs font-bold uppercase">
          <i className={playlist.isPublic ? "bi bi-globe" : "bi bi-lock-fill"} aria-hidden="true"></i>
          {playlist.isPublic ? "Pública" : "Privada"}
        </p>
      </div>
    </button>
  )
}

export default PlaylistCard
