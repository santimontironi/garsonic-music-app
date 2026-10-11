import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPlaylistSchema, type CreatePlaylistInput } from "shared/schemas/playlist.schema"
import { useCreatePlaylist } from "../../hooks/playlist/useCreatePlaylist"
import InputImage from "../ui/InputImage"

interface CreatePlaylistModalProps {
    onClose: () => void;
}

const CreatePlaylistModal = ({ onClose }: CreatePlaylistModalProps) => {

    const [image, setImage] = useState<File | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(createPlaylistSchema),
        defaultValues: { isPublic: false }
    })

    const { mutate: createPlaylist, isPending, isError, error } = useCreatePlaylist()

    const formSubmit = (data: CreatePlaylistInput) => {
        createPlaylist({ data, image }, { onSuccess: onClose })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <form
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-playlist-title"
                onSubmit={handleSubmit(formSubmit)}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-lg flex-col overflow-y-auto border-4 border-black bg-background shadow-hard-lg"
            >
                <div className="flex items-center justify-between gap-4 border-b-4 border-black bg-coral px-6 py-4 md:px-8">
                    <h2 id="create-playlist-title" className="text-lg font-bold uppercase md:text-2xl">Crear playlist</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center border-2 border-black bg-button press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="flex flex-col gap-5 p-6 md:p-8">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-xs font-bold tracking-wide uppercase">Nombre</label>
                        <input id="name" type="text" {...register("name")} className="w-full border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
                        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                    </div>

                    <InputImage id="image" name="image" label="Imagen (opcional)" onChange={setImage} />

                    <label className="flex cursor-pointer items-center gap-3 border-2 border-black bg-button px-4 py-3 shadow-hard has-focus-visible:outline-4 has-focus-visible:outline-offset-2 has-focus-visible:outline-black">
                        <input type="checkbox" {...register("isPublic")} className="size-5 shrink-0 cursor-pointer accent-black" />
                        <span className="flex flex-col">
                            <span className="text-sm font-bold">Playlist pública</span>
                            <span className="text-xs">Cualquier usuario va a poder verla.</span>
                        </span>
                    </label>

                    {isError && <p className="text-center text-sm text-red-600">{error.message}</p>}

                    <div className="flex flex-col-reverse gap-3 md:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer border-2 border-black bg-button px-6 py-3 text-sm font-bold press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:flex-1 md:text-base"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="cursor-pointer border-2 border-black bg-coral px-6 py-3 text-sm font-bold press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 md:flex-1 md:text-base"
                        >
                            {isPending ? "Creando..." : "Crear playlist"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreatePlaylistModal
