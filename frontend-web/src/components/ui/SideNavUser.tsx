import type { SideNavUserSections } from "../../types/general.types"

type Props = {
  section: SideNavUserSections
  setSection: (section: SideNavUserSections) => void
}

const items: { id: SideNavUserSections; label: string; icon: string }[] = [
  { id: "home", label: "Inicio", icon: "bi-house-fill" },
  { id: "search", label: "Buscar", icon: "bi-search" },
  { id: "my-playlists", label: "Mis playlists", icon: "bi-music-note-list" },
  { id: "favorite-songs", label: "Canciones favoritas", icon: "bi-heart-fill" },
  { id: "favorite-artists", label: "Artistas favoritos", icon: "bi-star-fill" },
  { id: "profile", label: "Perfil", icon: "bi-person-fill" },
]

const SideNavUser = ({ section, setSection }: Props) => {
  return (
    <nav
      aria-label="Secciones del usuario"
      className="flex gap-2 overflow-x-auto p-1 md:w-64 md:shrink-0 md:flex-col md:overflow-visible md:p-0"
    >
      {items.map(({ id, label, icon }) => {
        const active = section === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id)}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-full border-2 border-black px-4 py-2 text-left text-xs whitespace-nowrap md:text-sm ${
              active
                ? "translate-x-1 translate-y-1 bg-coral shadow-none"
                : "bg-button shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000]"
            } focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black`}
          >
            <i className={`bi ${icon}`} aria-hidden="true" />
            {label}
          </button>
        )
      })}
    </nav>
  )
}

export default SideNavUser
