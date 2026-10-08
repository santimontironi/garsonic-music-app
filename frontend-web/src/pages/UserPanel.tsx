import HomeUser from "../components/user/HomeUser"
import ProfileUser from "../components/user/ProfileUser"
import MyPlaylists from "../components/user/MyPlaylists"
import Search from "../components/user/Search"
import FavoriteArtists from "../components/user/FavoriteArtists"
import FavoriteSongs from "../components/user/FavoriteSongs"
import SideNavUser from "../components/user/SideNavUser"
import type { SideNavUserSections } from "../types/general.types"
import HeaderPanel from "../components/ui/HeaderPanel"
import { useState } from "react"
import PlayerProvider from "../context/PlayerContext"
import PlayerBar from "../components/player/PlayerBar"

const UserPanel = () => {

  const [section, setSection] = useState<SideNavUserSections>("home")
  const [menuOpen, setMenuOpen] = useState(false)

  const selectSection = (s: SideNavUserSections) => {
    setSection(s)
    setMenuOpen(false)
  }

  return (
    <PlayerProvider>
      <div className="min-h-svh bg-background md:flex">
        <SideNavUser section={section} setSection={selectSection} open={menuOpen} />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b-4 border-black bg-button px-4 md:h-20 md:px-8 xl:px-10">
            <button
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-controls="side-nav-user"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center border-2 border-black bg-coral text-xl shadow-hard focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:hidden"
            >
              <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`} aria-hidden="true" />
            </button>

            <HeaderPanel title="Mi panel" icon="bi-headphones" />
          </div>

          <main className="flex-1 p-5 md:p-8 xl:p-10">
            {section === "home" && <HomeUser setSection={selectSection} />}
            {section === "profile" && <ProfileUser />}
            {section === "my-playlists" && <MyPlaylists />}
            {section === "search" && <Search />}
            {section === "favorite-artists" && <FavoriteArtists />}
            {section === "favorite-songs" && <FavoriteSongs />}
          </main>

          <PlayerBar />
        </div>
      </div>
    </PlayerProvider>
  )
}

export default UserPanel
