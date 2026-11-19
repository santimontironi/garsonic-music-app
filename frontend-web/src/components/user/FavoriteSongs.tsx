import { useFavSongs } from "../../hooks/song/useFavSongs"
import { usePlayer } from "../../context/PlayerContext"
import SongCard from "../songs/SongCard"
import EmptyState from "../ui/EmptyState"
import Loader from "../ui/Loader"

const FavoriteSongs = () => {
  const { data: favSongs, isPending, isError, error } = useFavSongs()
  const { playQueue } = usePlayer()

  const tracks = favSongs?.map(song => ({ ...song, cover: song.cover ?? song.album?.cover, artistName: song.artist.username })) ?? []

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold uppercase md:text-3xl">Canciones favoritas</h2>

      {isPending && <div className="py-12"><Loader /></div>}
      {isError && <p role="alert" className="w-fit border-2 border-black bg-coral px-2 py-0.5 text-sm">{error.message}</p>}

      {favSongs?.length === 0 && (
        <EmptyState
          icon="bi-heart"
          title="Sin favoritas todavía"
          message="Tocá el corazón de una canción y va a aparecer acá."
        />
      )}

      {favSongs && favSongs.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4 2xl:grid-cols-5">
          {favSongs.map((song, i) => (
            <li key={song.id}>
              <SongCard
                song={song}
                artistName={song.artist.username}
                fallbackCover={song.album?.cover}
                onPlay={() => playQueue(tracks, i)}
                showFav
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default FavoriteSongs
