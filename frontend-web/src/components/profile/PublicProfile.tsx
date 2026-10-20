import { useState } from "react"
import { useUser } from "../../hooks/user/useUser"
import { useMe } from "../../hooks/auth/useMe"
import { useToggleFavArtist } from "../../hooks/user/useToggleFavArtist"
import { usePlayer } from "../../context/PlayerContext"
import AlbumCard from "../albums/AlbumCard"
import AlbumDetail from "../albums/AlbumDetail"
import AddToPlaylistModal from "../playlists/AddToPlaylistModal"
import PlaylistCard from "../playlists/PlaylistCard"
import PlaylistDetail from "../playlists/PlaylistDetail"
import SongCard from "../songs/SongCard"
import ProfileHeader from "./ProfileHeader"
import EmptyState from "../ui/EmptyState"
import Loader from "../ui/Loader"
import type { Song } from "../../types/song.types"

interface PublicProfileProps {
  userId: string
  onBack: () => void
}

const PublicProfile = ({ userId, onBack }: PublicProfileProps) => {
  const { data: user, isPending, isError, error } = useUser(userId)
  const { playQueue } = usePlayer()
  const { data: me } = useMe()
  const { mutate: toggleFav, isPending: isTogglingFav } = useToggleFavArtist()
  const [songToAdd, setSongToAdd] = useState<Pick<Song, "id" | "title"> | null>(null)
  const [selected, setSelected] = useState<{ type: "album" | "playlist"; id: string } | null>(null)

  if (selected?.type === "album") return <AlbumDetail albumId={selected.id} onBack={() => setSelected(null)} />
  if (selected?.type === "playlist") return <PlaylistDetail playlistId={selected.id} onBack={() => setSelected(null)} />

  const tracks = user?.songs.map(song => ({ ...song, cover: song.cover ?? song.album?.cover, artistName: user.username })) ?? []
  const isEmpty = !!user && user.albums.length + user.songs.length + user.playlists.length === 0

  return (
    <section className="flex flex-col gap-6">
      <button type="button" onClick={onBack} className="flex w-fit cursor-pointer items-center gap-2 border-2 border-black bg-button px-4 py-2 text-sm font-bold uppercase press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black">
        <i className="bi bi-arrow-left" aria-hidden="true"></i>
        Volver
      </button>

      {isPending && <div className="py-12"><Loader /></div>}
      {isError && <p role="alert" className="text-sm text-red-600">{error.message}</p>}

      {user && (
        <>
          <ProfileHeader user={user} />

          {user.role === "ARTIST" && me?.role === "USER" && (
            <button
              type="button"
              onClick={() => toggleFav(user.id)}
              disabled={isTogglingFav}
              aria-pressed={user.isFav}
              className="flex w-fit cursor-pointer items-center gap-2 border-2 border-black bg-button px-4 py-2 text-sm font-bold uppercase press disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              <i className={`bi ${user.isFav ? "bi-heart-fill text-red-600" : "bi-heart"}`} aria-hidden="true"></i>
              {user.isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
            </button>
          )}

          {user.albums.length > 0 && (
            <section className="flex flex-col gap-4">
              <h3 className="text-lg font-bold uppercase md:text-xl">Álbumes</h3>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
                {user.albums.map(album => (
                  <li key={album.id}><AlbumCard album={album} onClick={() => setSelected({ type: "album", id: album.id })} /></li>
                ))}
              </ul>
            </section>
          )}

          {user.songs.length > 0 && (
            <section className="flex flex-col gap-4">
              <h3 className="text-lg font-bold uppercase md:text-xl">Canciones</h3>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
                {user.songs.map((song, i) => (
                  <li key={song.id}>
                    <SongCard
                      song={song}
                      artistName={user.username}
                      fallbackCover={song.album?.cover}
                      onPlay={() => playQueue(tracks, i)}
                      onAddToPlaylist={me?.role === "USER" ? () => setSongToAdd(song) : undefined}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {user.playlists.length > 0 && (
            <section className="flex flex-col gap-4">
              <h3 className="text-lg font-bold uppercase md:text-xl">Playlists públicas</h3>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
                {user.playlists.map(playlist => (
                  <li key={playlist.id}><PlaylistCard playlist={playlist} onClick={() => setSelected({ type: "playlist", id: playlist.id })} /></li>
                ))}
              </ul>
            </section>
          )}

          {isEmpty && (
            <EmptyState
              icon={user.role === "ARTIST" ? "bi-vinyl-fill" : "bi-music-note-list"}
              title="Nada por acá todavía"
              message={user.role === "ARTIST" ? "Este artista todavía no publicó música." : "Este usuario no tiene playlists públicas."}
            />
          )}
        </>
      )}

      {songToAdd && <AddToPlaylistModal song={songToAdd} onClose={() => setSongToAdd(null)} />}
    </section>
  )
}

export default PublicProfile
