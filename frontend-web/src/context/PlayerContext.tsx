import { createContext, useContext, useRef, useState, type ReactNode } from "react"
import type { PlayerTrack } from "../types/player.types"

interface PlayerContextValue {
  track: PlayerTrack | null // canción actual (null si todavía no se reprodujo nada)
  isPlaying: boolean // true mientras el audio está sonando
  currentTime: number // segundos reproducidos de la canción actual
  duration: number // duración total en segundos (NaN hasta que carga la metadata)
  playQueue: (tracks: PlayerTrack[], start: number) => void // carga una lista y arranca desde la posición start
  toggle: () => void // alterna entre play y pausa
  next: () => void // pasa a la siguiente canción de la cola
  prev: () => void // reinicia la canción o vuelve a la anterior
  seek: (sec: number) => void // salta a un segundo puntual de la canción
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

// Hook para consumir el reproductor desde cualquier componente dentro del provider
// eslint-disable-next-line react-refresh/only-export-components
export const usePlayer = () => {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error("usePlayer debe usarse dentro de PlayerProvider")
  return ctx
}

const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [queue, setQueue] = useState<PlayerTrack[]>([])
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const track = queue[index] ?? null

  // Si el audio está pausado lo reproduce; si está sonando lo pausa
  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play()
    else audio.pause()
  }

  // Reemplaza la cola y arranca en la canción elegida.
  // Si se toca play sobre la canción que ya está cargada, solo alterna play/pausa
  const playQueue = (tracks: PlayerTrack[], start: number) => {
    if (tracks[start]?.id === track?.id) return toggle()
    setQueue(tracks)
    setIndex(start)
  }

  // Avanza a la siguiente canción; en la última se queda ahí
  const next = () => setIndex(i => Math.min(i + 1, queue.length - 1))

  // Si pasaron más de 3 segundos reinicia la canción; si no, va a la anterior
  const prev = () => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) audio.currentTime = 0
    else setIndex(i => Math.max(i - 1, 0))
  }

  // Mueve la reproducción al segundo indicado (lo usa la barra de progreso)
  const seek = (sec: number) => {
    if (audioRef.current) audioRef.current.currentTime = sec
  }

  return (
    <PlayerContext value={{ track, isPlaying, currentTime, duration, playQueue, toggle, next, prev, seek }}>
      {children}
      {/* Único <audio> de la app: autoPlay hace que arranque solo cada vez que cambia src */}
      <audio
        ref={audioRef}
        src={track?.audioUrl}
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={next}
      />
    </PlayerContext>
  )
}

export default PlayerProvider
