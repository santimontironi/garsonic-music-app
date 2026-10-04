import { Link } from "react-router-dom"
import type { SideNavUserSections } from "../../types/general.types"
import Logo from "./Logo"
import LogoutButton from "./LogoutButton"

type Props = {
  section: SideNavUserSections
  setSection: (section: SideNavUserSections) => void
  open: boolean
}

const items: { id: SideNavUserSections; label: string; icon: string; group: string }[] = [
  { id: "home", label: "Inicio", icon: "bi-house-fill", group: "General" },
  { id: "search", label: "Buscar", icon: "bi-search", group: "General" },
  { id: "my-playlists", label: "Mis playlists", icon: "bi-music-note-list", group: "Biblioteca" },
  { id: "favorite-songs", label: "Canciones favoritas", icon: "bi-heart-fill", group: "Biblioteca" },
  { id: "favorite-artists", label: "Artistas favoritos", icon: "bi-star-fill", group: "Biblioteca" },
  { id: "profile", label: "Perfil", icon: "bi-person-fill", group: "Cuenta" },
]

const SideNavUser = ({ section, setSection, open }: Props) => {
  const groups = [...new Set(items.map(item => item.group))]

  return (
    <nav
      id="side-nav-user"
      aria-label="Secciones del usuario"
      className={`fixed top-16 bottom-0 left-0 z-40 flex w-72 flex-col overflow-y-auto border-r-4 border-black bg-button transition-[translate,visibility] duration-300 md:sticky md:top-0 md:h-svh md:shrink-0 md:translate-x-0 xl:w-80 ${open ? "translate-x-0" : "invisible -translate-x-full"} md:visible`}
    >
      <Link
        to="/"
        aria-label="Garsonic, ir al inicio"
        className="flex h-16 shrink-0 items-center gap-3 border-b-4 border-black bg-coral px-5 focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-black md:h-20"
      >
        <span className="size-9 shrink-0 md:size-10">
          <Logo />
        </span>
        <span className="text-base uppercase md:text-lg">Garsonic</span>
      </Link>

      <div className="flex flex-col gap-6 p-5">
        {groups.map(group => (
          <div key={group} className="flex flex-col gap-3">
            <p className="text-[10px] uppercase md:text-xs">{group}</p>

            {items.filter(item => item.group === group).map(({ id, label, icon }) => {
              const active = section === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSection(id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex cursor-pointer items-center gap-3 border-2 border-black px-3 py-3 text-left text-xs leading-tight uppercase transition-transform md:text-[13px] ${
                    active
                      ? "bg-black text-button shadow-hard"
                      : "bg-button shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  } focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black`}
                >
                  <i className={`bi ${icon} text-base`} aria-hidden="true" />
                  {label}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-auto border-t-4 border-black p-5">
        <LogoutButton />
      </div>
    </nav>
  )
}

export default SideNavUser
