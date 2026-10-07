import { useMe } from "../../hooks/auth/useMe"
import type { SideNavUserSections } from "../../types/general.types"
import Logo from "../ui/Logo"
import QuickAccessUser from "./QuickAccessUser"

type Props = {
  setSection: (section: SideNavUserSections) => void
}

const HomeUser = ({ setSection }: Props) => {
  const { data: user } = useMe()

  return (
    <section className="flex flex-col gap-8 md:gap-12">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl leading-[1.05] font-bold wrap-break-word uppercase text-shadow-[4px_4px_0_#FC7B5E] md:text-5xl md:text-shadow-[6px_6px_0_#FC7B5E] xl:text-6xl">
          Hola, {user?.name}
        </h1>
      </header>

      <div className="grid border-4 border-black shadow-hard-lg lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4 border-b-4 border-black bg-green bg-[linear-gradient(to_right,#00000026_1px,transparent_1px),linear-gradient(to_bottom,#00000026_1px,transparent_1px)] bg-size-[36px_36px] p-6 md:p-10 lg:border-r-4 lg:border-b-0">
          <h2 className="text-xl leading-tight uppercase md:text-3xl">¿Qué querés escuchar hoy?</h2>
          <p className="max-w-xl text-sm leading-relaxed md:text-base">
            Descubrí artistas nuevos, armá tus playlists y guardá las canciones que no podés dejar de escuchar.
          </p>
          <button
            type="button"
            onClick={() => setSection("search")}
            className="mt-2 flex w-fit cursor-pointer items-center gap-3 border-2 border-black bg-button px-6 py-3 text-sm uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <i className="bi bi-search" aria-hidden="true" />
            Buscar música
          </button>
        </div>

        <div aria-hidden="true" className="hidden items-center justify-center bg-coral p-10 lg:flex xl:p-14">
          <div className="w-32 xl:w-40">
            <Logo />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-sm uppercase md:text-base">Accesos rápidos</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAccessUser title="Mis playlists" text="Armá y ordená tus listas" icon="bi-collection-play-fill" onClick={() => setSection("my-playlists")} />
          <QuickAccessUser title="Canciones favoritas" text="Lo que no podés dejar de escuchar" icon="bi-heart-fill" onClick={() => setSection("favorite-songs")} />
          <QuickAccessUser title="Artistas favoritos" text="Los artistas que seguís" icon="bi-mic-fill" onClick={() => setSection("favorite-artists")} />
          <QuickAccessUser title="Mi perfil" text="Tus datos y tu cuenta" icon="bi-person-fill" onClick={() => setSection("profile")} />
        </div>
      </div>
    </section>
  )
}

export default HomeUser
