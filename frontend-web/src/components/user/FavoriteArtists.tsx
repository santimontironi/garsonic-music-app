import { useState } from "react"
import { useFavArtists } from "../../hooks/user/useFavArtists"
import PublicProfile from "../profile/PublicProfile"
import UserResult from "../search/UserResult"
import EmptyState from "../ui/EmptyState"
import Loader from "../ui/Loader"

const FavoriteArtists = () => {
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)
  const { data: favArtists, isPending, isError, error } = useFavArtists()

  if (selectedArtistId) {
    return <PublicProfile userId={selectedArtistId} onBack={() => setSelectedArtistId(null)} />
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold uppercase md:text-3xl">Artistas favoritos</h2>

      {isPending && <div className="py-12"><Loader /></div>}
      {isError && <p role="alert" className="text-sm text-red-600">{error.message}</p>}

      {favArtists?.length === 0 && (
        <EmptyState
          icon="bi-star"
          title="Sin favoritos todavía"
          message="Marcá artistas como favoritos desde su perfil y van a aparecer acá."
        />
      )}

      {favArtists && favArtists.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
          {favArtists.map(artist => (
            <UserResult key={artist.id} user={artist} onClick={() => setSelectedArtistId(artist.id)} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default FavoriteArtists
