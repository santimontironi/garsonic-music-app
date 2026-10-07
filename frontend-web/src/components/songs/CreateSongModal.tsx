import { useState, type ChangeEvent } from "react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSongSchema, type CreateSongInput } from "shared/schemas/song.schema"
import { useCreateSong } from "../../hooks/song/useCreateSong"
import { useMyAlbums } from "../../hooks/album/useMyAlbums"
import InputImage from "../ui/InputImage"

type CreateSongModalProps = {
    closeModal: () => void
}

const CreateSongModal = ({ closeModal }: CreateSongModalProps) => {

    const [audio, setAudio] = useState<File | null>(null)
    const [cover, setCover] = useState<File | null>(null)
    const [audioError, setAudioError] = useState("")

    const { register, handleSubmit, formState: { errors } } = useForm<CreateSongInput>({
        resolver: zodResolver(createSongSchema)
    })

    const { mutate: createSong, isPending, isError, error } = useCreateSong()
    const { data: albums } = useMyAlbums()

    const handleAudio = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null

        if (file && !file.type.startsWith("audio/")) {
            setAudio(null)
            return setAudioError("El archivo tiene que ser un audio")
        }
        if (file && file.size > 20 * 1024 * 1024) {
            setAudio(null)
            return setAudioError("El audio no puede pesar más de 20 MB")
        }
        setAudioError("")
        setAudio(file)
    }

    const formSubmit = (data: CreateSongInput) => {
        if (!audio) return setAudioError("Elegí el archivo de audio")
        createSong({ data, audio, cover }, { onSuccess: closeModal })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
            <form
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-song-title"
                onSubmit={handleSubmit(formSubmit)}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-lg flex-col overflow-y-auto rounded-3xl border-4 border-black bg-background shadow-hard-lg"
            >
                <div className="flex items-center justify-between gap-4 border-b-4 border-black bg-coral px-6 py-4 md:px-8">
                    <h2 id="create-song-title" className="text-lg font-bold uppercase md:text-2xl">Subir canción</h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Cerrar"
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-button shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="flex flex-col gap-5 p-6 md:p-8">
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="audio"
                            className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-4 border-dashed border-black bg-green px-4 py-8 text-center has-focus-visible:outline-4 has-focus-visible:outline-offset-2 has-focus-visible:outline-black md:py-10"
                        >
                            <input id="audio" type="file" accept="audio/*" onChange={handleAudio} className="sr-only" />
                            <span className="flex size-16 items-center justify-center rounded-full border-2 border-black bg-button text-3xl shadow-hard md:size-20 md:text-4xl">
                                <i className={audio ? "bi bi-check-lg" : "bi bi-music-note-beamed"}></i>
                            </span>
                            <span className="max-w-full truncate text-sm font-bold md:text-base">
                                {audio ? audio.name : "Elegí el audio"}
                            </span>
                            <span className="text-xs">{audio ? "Tocá para cambiarlo" : "MP3, WAV u OGG · hasta 20 MB"}</span>
                        </label>
                        {audioError && <p role="alert" className="text-xs text-red-600">{audioError}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="title" className="text-xs font-bold tracking-wide uppercase">Título</label>
                        <input id="title" type="text" {...register("title")} className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
                        {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="albumId" className="text-xs font-bold tracking-wide uppercase">Álbum</label>
                        <div className="relative">
                            <select id="albumId" {...register("albumId", { setValueAs: (v) => v || undefined })} className="w-full cursor-pointer appearance-none rounded-xl border-2 border-black bg-button py-2.5 pr-10 pl-4 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black">
                                <option value="">Sin álbum (single)</option>
                                {albums?.map(album => (
                                    <option key={album.id} value={album.id}>{album.title}</option>
                                ))}
                            </select>
                            <i className="bi bi-chevron-down pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm" aria-hidden="true"></i>
                        </div>
                    </div>

                    <InputImage id="cover" name="cover" label="Portada (opcional)" onChange={setCover} />

                    {isError && <p className="text-center text-sm text-red-600">{error.message}</p>}

                    <div className="flex flex-col-reverse gap-3 md:flex-row">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="cursor-pointer rounded-full border-2 border-black bg-button px-6 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:flex-1 md:text-base"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="cursor-pointer rounded-full border-2 border-black bg-coral px-6 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 md:flex-1 md:text-base"
                        >
                            {isPending ? "Subiendo..." : "Subir canción"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateSongModal
