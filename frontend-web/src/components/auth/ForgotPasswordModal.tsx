interface ForgotPasswordModalProps {
    onClose: () => void
}

const ForgotPasswordModal = ({ onClose }: ForgotPasswordModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex w-full max-w-lg flex-col gap-6 rounded-3xl border-4 border-black bg-background p-6 shadow-hard-lg md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">¿Olvidaste tu contraseña?</h2>
          <p className="text-sm">Ingresá tu email para confirmar tu cuenta</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="forgot-email" className="text-xs font-bold tracking-wide uppercase">Email</label>
          <input id="forgot-email" type="email" autoComplete="email" className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="rounded-full cursor-pointer border-2 border-black bg-coral px-6 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base"
          >
            Enviar instrucciones
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full cursor-pointer border-2 border-black bg-button px-6 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordModal