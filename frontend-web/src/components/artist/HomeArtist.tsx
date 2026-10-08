import { useMe } from "../../hooks/auth/useMe"
import { useMySongs } from "../../hooks/song/useMySongs"
import { useMyAlbums } from "../../hooks/album/useMyAlbums"
import type { SideNavArtistSections } from "../../types/general.types"
import Logo from "../ui/Logo"
import SongList from "../songs/SongList"
import QuickAccessArtist from "./QuickAccessArtist"
import HomeArtistStats from "./HomeArtistStats"
import { usePlayer } from "../../context/PlayerContext"

type Props = {
  setSection: (section: SideNavArtistSections) => void
}

const HomeArtist = ({ setSection }: Props) => {
  const { data: user } = useMe()
  const { data: songs } = useMySongs()
  const { data: albums } = useMyAlbums()
  const { playQueue } = usePlayer()

  const artistName = user ? `${user.name} ${user.surname}` : ""
  const recentTracks = songs?.slice(0, 5).map(song => ({ ...song, artistName })) ?? []

  const totalMinutes = Math.round((songs?.reduce((acc, song) => acc + song.durationSec, 0) ?? 0) / 60)

  return (
    <section className="flex flex-col gap-8 md:gap-12">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl leading-[1.05] font-bold wrap-break-word uppercase text-shadow-[4px_4px_0_#FC7B5E] md:text-5xl md:text-shadow-[6px_6px_0_#FC7B5E] xl:text-6xl">
          Hola, {user?.name}
        </h1>
      </header>

      <div className="grid border-4 border-black shadow-hard-lg lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4 border-b-4 border-black bg-green bg-[linear-gradient(to_right,#00000026_1px,transparent_1px),linear-gradient(to_bottom,#00000026_1px,transparent_1px)] bg-size-[36px_36px] p-6 md:p-10 lg:border-r-4 lg:border-b-0">
          <h2 className="text-xl leading-tight uppercase md:text-3xl">¿Qué vas a lanzar hoy?</h2>
          <p className="max-w-xl text-sm leading-relaxed md:text-base">
            Subí tus canciones, agrupalas en álbumes y hacé que tu música llegue a nuevos oyentes.
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setSection("my-songs")}
              className="flex w-fit cursor-pointer items-center gap-3 border-2 border-black bg-coral px-6 py-3 text-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              <i className="bi bi-upload" aria-hidden="true" />
              Subir canción
            </button>
            <button
              type="button"
              onClick={() => setSection("my-albums")}
              className="flex w-fit cursor-pointer items-center gap-3 border-2 border-black bg-button px-6 py-3 text-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              <i className="bi bi-vinyl" aria-hidden="true" />
              Ver álbumes
            </button>
          </div>
        </div>

        <div aria-hidden="true" className="hidden items-center justify-center bg-coral p-10 lg:flex xl:p-14">
          <div className="w-32 xl:w-40">
            <Logo />
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <HomeArtistStats label="Canciones" value={songs?.length ?? 0} icon="bi-music-note-beamed" bg="bg-coral" />
        <HomeArtistStats label="Álbumes" value={albums?.length ?? 0} icon="bi-vinyl-fill" bg="bg-green" />
        <HomeArtistStats label="Minutos de música" value={totalMinutes} icon="bi-clock-fill" bg="bg-button" />
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-sm uppercase md:text-base">Accesos rápidos</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAccessArtist title="Mis canciones" text="Subí y organizá tus temas" icon="bi-music-note-beamed" onClick={() => setSection("my-songs")} />
          <QuickAccessArtist title="Mis álbumes" text="Agrupá tus canciones" icon="bi-vinyl-fill" onClick={() => setSection("my-albums")} />
          <QuickAccessArtist title="Estadísticas" text="Cómo suena tu música" icon="bi-bar-chart-fill" onClick={() => setSection("stats")} />
          <QuickAccessArtist title="Mi perfil" text="Tus datos y tu cuenta" icon="bi-person-fill" onClick={() => setSection("profile")} />
        </div>
      </div>

      {songs && songs.length > 0 && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm uppercase md:text-base">Últimas canciones</h2>
            <button
              type="button"
              onClick={() => setSection("my-songs")}
              className="group flex cursor-pointer items-center gap-2 text-xs uppercase underline-offset-4 hover:underline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-sm"
            >
              Ver todas
              <i className="bi bi-arrow-right transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>
          <SongList songs={songs.slice(0, 5)} onPlay={i => playQueue(recentTracks, i)} />
        </div>
      )}
    </section>
  )
}

export default HomeArtist
