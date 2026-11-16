import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordInput } from "shared/schemas/auth.schema"
import { useForgotPassword } from "../../hooks/auth/useForgotPassword"

interface ForgotPasswordModalProps {
    onClose: () => void
}

const ForgotPasswordModal = ({ onClose }: ForgotPasswordModalProps) => {

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const { mutate: sendInstructions, isPending, isError, isSuccess, error, data: message } = useForgotPassword()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        className="flex w-full max-w-lg flex-col gap-6 border-4 border-black bg-background p-6 shadow-hard-lg md:p-10"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit((data) => sendInstructions(data))}
      >
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">¿Olvidaste tu contraseña?</h2>
          <p className="text-sm">Ingresá tu email y te mandamos un enlace para elegir una nueva</p>
        </div>

        {isSuccess ? (
          <p role="status" className="text-center text-sm">{message}</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="forgot-email" className="text-xs font-bold tracking-wide uppercase">Email</label>
            <input id="forgot-email" type="email" autoComplete="email" {...register('email')} className="w-full border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
        )}

        {isError && <p role="alert" className="text-center text-sm text-red-600">{error.message}</p>}

        <div className="flex flex-col gap-3">
          {!isSuccess && (
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer border-2 border-black bg-coral px-6 py-3 text-sm font-bold press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 md:text-base"
            >
              {isPending ? 'Enviando...' : 'Enviar instrucciones'}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-2 border-black bg-button px-6 py-3 text-sm font-bold press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base"
          >
            {isSuccess ? 'Cerrar' : 'Cancelar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordModal
