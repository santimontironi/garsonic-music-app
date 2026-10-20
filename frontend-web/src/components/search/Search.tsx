import { useState } from "react"
import { useSearch } from "../../hooks/search/useSearch"
import { useMe } from "../../hooks/auth/useMe"
import { usePlayer } from "../../context/PlayerContext"
import AlbumCard from "../albums/AlbumCard"
import AlbumDetail from "../albums/AlbumDetail"
import AddToPlaylistModal from "../playlists/AddToPlaylistModal"
import PlaylistCard from "../playlists/PlaylistCard"
import PlaylistDetail from "../playlists/PlaylistDetail"
import PublicProfile from "../profile/PublicProfile"
import SongCard from "../songs/SongCard"
import SearchChip from "./SearchChip"
import SearchGroup from "./SearchGroup"
import type { Song } from "../../types/song.types"
import UserResult from "./UserResult"

const Search = () => {
  const [term, setTerm] = useState("")
  const [selected, setSelected] = useState<{ type: "album" | "playlist" | "user"; id: string } | null>(null)
  const { data, isFetching, isError, error } = useSearch(term)
  const { playQueue } = usePlayer()
  const { data: me } = useMe()
  const [songToAdd, setSongToAdd] = useState<Song | null>(null)

  if (selected?.type === "album") return <AlbumDetail albumId={selected.id} onBack={() => setSelected(null)} />
  if (selected?.type === "user") return <PublicProfile userId={selected.id} onBack={() => setSelected(null)} />
  if (selected?.type === "playlist") return <PlaylistDetail playlistId={selected.id} onBack={() => setSelected(null)} />

  const isEmpty = term.trim().length === 0
  const hasResults = !!data && Object.values(data).some(list => list.length > 0)
  const tracks = data?.songs.map(song => ({ ...song, cover: song.cover ?? song.album?.cover, artistName: song.artist.username })) ?? []

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold uppercase md:text-3xl">Buscar</h2>

      <label className="flex items-center gap-3 border-4 border-black bg-button px-4 py-3 shadow-hard focus-within:outline-4 focus-within:outline-offset-4 focus-within:outline-black">
        <i className="bi bi-search text-xl" aria-hidden="true"></i>
        <span className="sr-only">Buscar artistas, canciones, álbumes, playlists o usuarios</span>
        <input
          type="search"
          value={term}
          onChange={e => setTerm(e.target.value)}
          maxLength={50}
          autoFocus
          placeholder="Artistas, canciones, álbumes, playlists..."
          className="w-full bg-transparent text-sm outline-none md:text-base"
        />
        {isFetching && <i className="bi bi-arrow-repeat shrink-0 animate-spin text-xl" aria-hidden="true"></i>}
      </label>

      <div aria-live="polite" className="flex flex-col gap-8">
        {isEmpty && (
          <div className="flex flex-col items-center gap-6 border-4 border-black bg-green px-6 py-10 text-center shadow-hard-lg md:gap-8 md:px-12 md:py-14">
            <span className="flex size-20 -rotate-6 items-center justify-center border-4 border-black bg-coral text-4xl shadow-hard md:size-24 md:text-5xl" aria-hidden="true">
              <i className="bi bi-search"></i>
            </span>

            <div className="flex max-w-md flex-col gap-2">
              <p className="text-lg font-bold uppercase md:text-2xl">¿Qué querés escuchar?</p>
              <p className="text-xs md:text-sm">Escribí y te mostramos todo lo que coincida.</p>
            </div>

            <ul className="flex flex-wrap justify-center gap-2 md:gap-3">
              <SearchChip icon="bi-mic-fill" label="Artistas" />
              <SearchChip icon="bi-music-note-beamed" label="Canciones" />
              <SearchChip icon="bi-vinyl-fill" label="Álbumes" />
              <SearchChip icon="bi-music-note-list" label="Playlists" />
              <SearchChip icon="bi-people-fill" label="Usuarios" />
            </ul>
          </div>
        )}
        {!isEmpty && isError && <p role="alert" className="text-sm text-red-600">{error.message}</p>}
        {!isEmpty && data && !hasResults && <p className="text-sm">No encontramos resultados para "{term.trim()}".</p>}

        {!isEmpty && data && (
          <>
            {data.artists.length > 0 && (
              <SearchGroup title="Artistas" icon="bi-mic-fill">
                {data.artists.map(artist => (
                  <UserResult key={artist.id} user={artist} onClick={() => setSelected({ type: "user", id: artist.id })} />
                ))}
              </SearchGroup>
            )}

            {data.songs.length > 0 && (
              <SearchGroup title="Canciones" icon="bi-music-note-beamed">
                {data.songs.map((song, i) => (
                  <li key={song.id}>
                    <SongCard
                      song={song}
                      artistName={song.artist.username}
                      fallbackCover={song.album?.cover}
                      onPlay={() => playQueue(tracks, i)}
                      onAddToPlaylist={me?.role === "USER" ? () => setSongToAdd(song) : undefined}
                    />
                  </li>
                ))}
              </SearchGroup>
            )}

            {data.albums.length > 0 && (
              <SearchGroup title="Álbumes" icon="bi-vinyl-fill">
                {data.albums.map(album => (
                  <li key={album.id}>
                    <AlbumCard album={album} onClick={() => setSelected({ type: "album", id: album.id })} />
                  </li>
                ))}
              </SearchGroup>
            )}

            {data.playlists.length > 0 && (
              <SearchGroup title="Playlists" icon="bi-music-note-list">
                {data.playlists.map(playlist => (
                  <li key={playlist.id}>
                    <PlaylistCard playlist={playlist} onClick={() => setSelected({ type: "playlist", id: playlist.id })} />
                  </li>
                ))}
              </SearchGroup>
            )}

            {data.users.length > 0 && (
              <SearchGroup title="Usuarios" icon="bi-people-fill">
                {data.users.map(user => (
                  <UserResult key={user.id} user={user} onClick={() => setSelected({ type: "user", id: user.id })} />
                ))}
              </SearchGroup>
            )}
          </>
        )}
      </div>

      {songToAdd && <AddToPlaylistModal song={songToAdd} onClose={() => setSongToAdd(null)} />}
    </section>
  )
}

export default Search
