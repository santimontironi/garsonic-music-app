import { useState } from "react"
import HeaderPanel from "../components/ui/HeaderPanel"
import SideNavArtist from "../components/ui/SideNavArtist"
import HomeArtist from "../components/artist/HomeArtist"
import SearchArtist from "../components/artist/SearchArtist"
import MySongs from "../components/artist/MySongs"
import UploadSong from "../components/artist/UploadSong"
import Stats from "../components/artist/Stats"
import ProfileArtist from "../components/artist/ProfileArtist"
import type { SideNavArtistSections } from "../types/general.types"

const ArtistPanel = () => {

  const [section, setSection] = useState<SideNavArtistSections>("home")
  const [menuOpen, setMenuOpen] = useState(false)

  const selectSection = (s: SideNavArtistSections) => {
    setSection(s)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-svh bg-background md:flex">
      <SideNavArtist section={section} setSection={selectSection} open={menuOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b-4 border-black bg-button px-4 md:h-20 md:px-8 xl:px-10">
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="side-nav-artist"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center border-2 border-black bg-green text-xl shadow-hard focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:hidden"
          >
            <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`} aria-hidden="true" />
          </button>

          <HeaderPanel title="Estudio" />
        </div>

        <main className="flex-1 p-5 md:p-8 xl:p-10">
          {section === "home" && <HomeArtist />}
          {section === "search" && <SearchArtist />}
          {section === "my-songs" && <MySongs />}
          {section === "upload" && <UploadSong />}
          {section === "stats" && <Stats />}
          {section === "profile" && <ProfileArtist />}
        </main>
      </div>
    </div>
  )
}

export default ArtistPanel
