import type { Album } from "../../types/album.types";

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
}

const AlbumCard = ({ album, onClick }: AlbumCardProps) => {
  const songs = album._count?.songs ?? 0

  return (
    <button type="button" onClick={onClick} className="flex w-full cursor-pointer flex-col overflow-hidden text-left focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black rounded-2xl border-4 border-black bg-button shadow-hard transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-lg">
      {album.cover ? (
        <img src={album.cover} alt="" className="aspect-square w-full border-b-4 border-black object-cover" />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center border-b-4 border-black bg-green text-5xl" aria-hidden="true">
          <i className="bi bi-vinyl-fill"></i>
        </div>
      )}
      <div className="flex flex-col gap-1 p-3 md:p-4">
        <h3 className="truncate text-sm font-bold md:text-base">{album.title}</h3>
        <p className="text-xs">{songs} {songs === 1 ? "canción" : "canciones"}</p>
      </div>
    </button>
  )
}

export default AlbumCard
