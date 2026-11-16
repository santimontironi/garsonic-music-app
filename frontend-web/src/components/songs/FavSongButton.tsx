import { useFavSongs } from "../../hooks/song/useFavSongs"
import { useToggleFavSong } from "../../hooks/song/useToggleFavSong"

interface FavSongButtonProps {
  songId: string
  title: string
}

const FavSongButton = ({ songId, title }: FavSongButtonProps) => {
  const { data: favSongs } = useFavSongs()
  const { mutate: toggleFav, isPending } = useToggleFavSong()
  const isFav = favSongs?.some(song => song.id === songId) ?? false

  return (
    <button
      type="button"
      onClick={() => toggleFav(songId)}
      disabled={isPending}
      aria-pressed={isFav}
      aria-label={isFav ? `Quitar ${title} de favoritas` : `Agregar ${title} a favoritas`}
      title={isFav ? "Quitar de favoritas" : "Agregar a favoritas"}
      className={`absolute top-2 left-2 flex size-9 cursor-pointer items-center justify-center border-2 border-black press hover:bg-green focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 ${isFav ? "bg-coral" : "bg-button"}`}
    >
      <i className={isFav ? "bi bi-heart-fill" : "bi bi-heart"} aria-hidden="true"></i>
    </button>
  )
}

export default FavSongButton
