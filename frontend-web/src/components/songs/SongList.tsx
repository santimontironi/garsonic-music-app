import type { Song } from "../../types/song.types"
import { formatDuration } from "../../utils/formatDuration"
import SongMenu from "./SongMenu"

interface SongListProps {
  songs: Song[]
}

const cell = "border-b-2 border-black px-2 py-2.5 group-last:border-b-0 md:px-4 md:py-3"

const SongList = ({ songs }: SongListProps) => {
  return (
    <div className="rounded-2xl border-4 border-black bg-button shadow-hard">
      <table className="w-full table-fixed border-separate border-spacing-0 text-left">
        <thead>
          <tr className="text-xs uppercase">
            <th scope="col" className="w-14 rounded-tl-xl border-b-4 border-black bg-coral px-2 py-3 md:w-20 md:px-4"><span className="sr-only">Reproducir</span></th>
            <th scope="col" className="border-b-4 border-black bg-coral px-2 py-3 md:px-4">Título</th>
            <th scope="col" className="hidden w-1/4 border-b-4 border-black bg-coral px-4 py-3 md:table-cell">Álbum</th>
            <th scope="col" className="w-16 border-b-4 border-black bg-coral px-2 py-3 text-right md:w-24 md:px-4">
              <i className="bi bi-clock" aria-hidden="true"></i>
              <span className="sr-only">Duración</span>
            </th>
            <th scope="col" className="w-12 rounded-tr-xl border-b-4 border-black bg-coral px-2 py-3 md:w-16"><span className="sr-only">Opciones</span></th>
          </tr>
        </thead>

        <tbody>
          {songs.map(song => (
            <tr key={song.id} className="group hover:bg-green">
              <td className={`${cell} group-last:rounded-bl-xl`}>
                <button
                  type="button"
                  aria-label={`Reproducir ${song.title}`}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-coral shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black md:size-10"
                >
                  <i className="bi bi-play-fill text-lg" aria-hidden="true"></i>
                </button>
              </td>

              <td className={cell}>
                <div className="flex items-center gap-3">
                  {song.cover ? (
                    <img src={song.cover} alt="" className="size-10 shrink-0 rounded-lg border-2 border-black object-cover md:size-12" />
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-background md:size-12" aria-hidden="true">
                      <i className="bi bi-music-note-beamed"></i>
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate text-sm font-bold md:text-base">{song.title}</p>
                    <p className="truncate text-xs md:hidden">{song.album?.title ?? "Single"}</p>
                  </div>
                </div>
              </td>

              <td className={`${cell} hidden truncate text-sm md:table-cell`}>{song.album?.title ?? "Single"}</td>

              <td className={`${cell} text-right text-xs tabular-nums md:text-sm`}>{formatDuration(song.durationSec)}</td>

              <td className={`${cell} group-last:rounded-br-xl`}>
                <SongMenu song={song} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SongList
