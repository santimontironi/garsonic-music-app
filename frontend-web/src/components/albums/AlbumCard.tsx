import type { Album } from "../../types/album.types";

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
}

const AlbumCard = ({ album, onClick }: AlbumCardProps) => {
  const songs = album._count?.songs ?? 0

  return (
    <button type="button" onClick={onClick} className="group flex w-full cursor-pointer flex-col overflow-hidden border-4 border-black bg-button text-left shadow-hard transition-[translate,box-shadow] duration-150 ease-out hover:-translate-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-1 active:shadow-none motion-reduce:transition-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black">
      <div className="aspect-square overflow-hidden border-b-4 border-black">
        {album.cover ? (
          <img src={album.cover} alt="" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" />
        ) : (
          <div className="flex size-full items-center justify-center bg-green text-5xl" aria-hidden="true">
            <i className="bi bi-vinyl-fill"></i>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3 md:p-4">
        <h3 className="truncate text-sm font-bold md:text-base">{album.title}</h3>
        <p className="text-xs text-black/70">{songs} {songs === 1 ? "canción" : "canciones"}</p>
      </div>
    </button>
  )
}

export default AlbumCard
