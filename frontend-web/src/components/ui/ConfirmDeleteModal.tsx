import type { ReactNode } from "react"

interface ConfirmDeleteModalProps {
    title: string
    message: ReactNode
    isPending: boolean
    error: Error | null
    onConfirm: () => void
    onClose: () => void
}

const ConfirmDeleteModal = ({ title, message, isPending, error, onConfirm, onClose }: ConfirmDeleteModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-delete-title"
                aria-describedby="confirm-delete-description"
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-md flex-col overflow-hidden border-4 border-black bg-background shadow-hard-lg"
            >
                <div className="border-b-4 border-black bg-coral px-6 py-4">
                    <h2 id="confirm-delete-title" className="text-lg font-bold uppercase">{title}</h2>
                </div>

                <div className="flex flex-col gap-6 p-6">
                    <p id="confirm-delete-description" className="text-sm">{message}</p>

                    {error && <p role="alert" className="text-center text-sm text-red-600">{error.message}</p>}

                    <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            autoFocus
                            className="cursor-pointer border-2 border-black bg-button px-5 py-2.5 text-sm font-bold uppercase press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={onConfirm}
                            className="cursor-pointer border-2 border-black bg-red-600 px-5 py-2.5 text-sm font-bold text-white uppercase press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60"
                        >
                            {isPending ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal
