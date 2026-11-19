import { useArtistStats } from "../../hooks/user/useArtistStats"
import EmptyState from "../ui/EmptyState"
import Loader from "../ui/Loader"
import StatCard from "./StatCard"

const cell = "border-b-2 border-black px-2 py-2.5 group-last:border-b-0 md:px-4 md:py-3"
const headCell = "border-b-4 border-black bg-coral px-2 py-3 md:px-4"

const Stats = () => {
  const { data: stats, isPending, isError, error } = useArtistStats()

  return (
    <section className="flex flex-col gap-6 md:gap-8">
      <h2 className="text-xl font-bold uppercase md:text-3xl">Estadísticas</h2>

      {isPending && <div className="py-12"><Loader /></div>}
      {isError && <p role="alert" className="w-fit border-2 border-black bg-coral px-2 py-0.5 text-sm">{error.message}</p>}

      {stats && (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Seguidores" value={stats.fans} icon="bi-people-fill" bg="bg-coral" />
            <StatCard label="Canciones" value={stats.songs} icon="bi-music-note-beamed" bg="bg-green" />
            <StatCard label="Álbumes" value={stats.albums} icon="bi-vinyl-fill" bg="bg-coral" />
            <StatCard label="Singles" value={stats.singles} icon="bi-disc-fill" bg="bg-green" />
            <StatCard label="Minutos de música" value={stats.minutes} icon="bi-clock-fill" bg="bg-coral" />
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-sm uppercase md:text-base">Canciones más guardadas</h3>

            {stats.songStats.length === 0 ? (
              <EmptyState
                icon="bi-bar-chart-fill"
                title="Todavía no hay datos"
                message="Cuando alguien guarde tus canciones en favoritos o en una playlist, las vas a ver acá."
              />
            ) : (
              <div className="border-4 border-black bg-button shadow-hard">
                <table className="w-full table-fixed border-separate border-spacing-0 text-left">
                  <thead>
                    <tr className="text-xs uppercase">
                      <th scope="col" className={`${headCell} w-10 md:w-16`}>#</th>
                      <th scope="col" className={headCell}>Canción</th>
                      <th scope="col" className={`${headCell} w-16 text-right md:w-32`}>
                        <i className="bi bi-heart-fill md:hidden" aria-hidden="true"></i>
                        <span className="sr-only md:not-sr-only">Favoritos</span>
                      </th>
                      <th scope="col" className={`${headCell} w-16 text-right md:w-32`}>
                        <i className="bi bi-music-note-list md:hidden" aria-hidden="true"></i>
                        <span className="sr-only md:not-sr-only">Playlists</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats.songStats.map((song, i) => (
                      <tr key={song.id} className="group hover:bg-green">
                        <td className={`${cell} text-sm font-bold tabular-nums`}>{i + 1}</td>
                        <td className={cell}>
                          <div className="flex items-center gap-3">
                            {song.cover ? (
                              <img src={song.cover} alt="" className="size-10 shrink-0 border-2 border-black object-cover md:size-12" />
                            ) : (
                              <div className="flex size-10 shrink-0 items-center justify-center border-2 border-black bg-background md:size-12" aria-hidden="true">
                                <i className="bi bi-music-note-beamed"></i>
                              </div>
                            )}
                            <p className="truncate text-sm font-bold md:text-base">{song.title}</p>
                          </div>
                        </td>
                        <td className={`${cell} text-right text-sm tabular-nums md:text-base`}>{song.favs}</td>
                        <td className={`${cell} text-right text-sm tabular-nums md:text-base`}>{song.playlists}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default Stats
