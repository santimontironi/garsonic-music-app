import { useMe } from "../../hooks/auth/useMe"
import type { SideNavUserSections } from "../../types/general.types"

type Props = {
  setSection: (section: SideNavUserSections) => void
}

const HomeUser = ({ setSection }: Props) => {
  const { data: user } = useMe()

  return (
    <section className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-3 border-b-2 border-dashed border-black pb-6">
        <h1 className="text-2xl leading-tight wrap-break-word uppercase md:text-4xl xl:text-5xl">
          Hola, {user?.name}
        </h1>
        <p className="w-fit bg-coral px-2 py-1 text-[10px] uppercase md:text-xs">
          Bienvenido de vuelta
        </p>
      </div>

      <div className="flex flex-col gap-6 border-4 border-black bg-green p-6 shadow-hard-lg md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex flex-col gap-3">
          <span className="flex size-12 items-center justify-center bg-black text-xl text-button">
            <i className="bi bi-music-note-beamed" aria-hidden="true" />
          </span>
          <h2 className="text-lg uppercase md:text-2xl">¿Qué querés escuchar hoy?</h2>
          <p className="max-w-xl text-xs leading-relaxed md:text-sm">
            Descubrí artistas nuevos, armá tus playlists y guardá las canciones que no podés dejar de escuchar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSection("search")}
          className="flex w-fit shrink-0 cursor-pointer items-center gap-3 border-2 border-black bg-button px-6 py-3 text-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <i className="bi bi-search" aria-hidden="true" />
          Buscar música
        </button>
      </div>
    </section>
  )
}

export default HomeUser
