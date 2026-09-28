import HomeUser from "../components/user/HomeUser"
import ProfileUser from "../components/user/ProfileUser"
import MyPlaylists from "../components/user/MyPlaylists"
import Search from "../components/user/Search"
import FavoriteArtists from "../components/user/FavoriteArtists"
import FavoriteSongs from "../components/user/FavoriteSongs"
import Header from "../components/ui/Header"
import SideNavUser from "../components/ui/SideNavUser"
import type { SideNavUserSections } from "../types/general.types"
import { useState } from "react"

const UserPanel = () => {

  const [section, setSection] = useState<SideNavUserSections>("home")

  return (
    <div className="flex min-h-svh flex-col gap-6 bg-green p-4 md:gap-8 md:p-8 xl:px-16 xl:py-10">
      <Header />

      <div className="flex flex-1 flex-col gap-6 md:flex-row md:gap-8">
        <SideNavUser section={section} setSection={setSection} />

        <main className="flex-1 rounded-3xl border-4 border-black bg-background p-6 shadow-hard-lg md:p-10">
          {section === "home" && <HomeUser />}
          {section === "profile" && <ProfileUser />}
          {section === "my-playlists" && <MyPlaylists />}
          {section === "search" && <Search />}
          {section === "favorite-artists" && <FavoriteArtists />}
          {section === "favorite-songs" && <FavoriteSongs />}
        </main>
      </div>
    </div>
  )
}

export default UserPanel