import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createAlbumSchema, type CreateAlbumInput } from "../../../../shared/schemas/album.schema"
import { useCreateAlbum } from "../../hooks/album/useCreateAlbum"
import InputImage from "../ui/InputImage"

interface CreateAlbumModalProps {
    onClose: () => void;
}

const CreateAlbumModal = ({ onClose }: CreateAlbumModalProps) => {

    const [cover, setCover] = useState<File | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm<CreateAlbumInput>({
        resolver: zodResolver(createAlbumSchema)
    })

    const { mutate: createAlbum, isPending, isError, error } = useCreateAlbum()

    const formSubmit = (data: CreateAlbumInput) => {
        createAlbum({ data, cover }, { onSuccess: onClose })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <form
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-album-title"
                onSubmit={handleSubmit(formSubmit)}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-lg flex-col overflow-y-auto rounded-3xl border-4 border-black bg-background shadow-hard-lg"
            >
                <div className="flex items-center justify-between gap-4 border-b-4 border-black bg-coral px-6 py-4 md:px-8">
                    <h2 id="create-album-title" className="text-lg font-bold uppercase md:text-2xl">Crear álbum</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-button shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="flex flex-col gap-5 p-6 md:p-8">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="title" className="text-xs font-bold tracking-wide uppercase">Título</label>
                        <input id="title" type="text" {...register("title")} className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
                        {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
                    </div>

                    <InputImage id="cover" name="cover" label="Portada (opcional)" onChange={setCover} />

                    {isError && <p className="text-center text-sm text-red-600">{error.message}</p>}

                    <div className="flex flex-col-reverse gap-3 md:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-full border-2 border-black bg-button px-6 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:flex-1 md:text-base"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="cursor-pointer rounded-full border-2 border-black bg-coral px-6 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 md:flex-1 md:text-base"
                        >
                            {isPending ? "Creando..." : "Crear álbum"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateAlbumModal
