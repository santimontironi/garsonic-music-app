import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordFormSchema, type ChangePasswordFormInput } from "shared/schemas/auth.schema"
import { useChangePassword } from "../../hooks/auth/useChangePassword"

interface ChangePasswordModalProps {
  onClose: () => void
  onSuccess: (message: string) => void
}

const ChangePasswordModal = ({ onClose, onSuccess }: ChangePasswordModalProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordFormSchema),
  })

  const { mutate: changePassword, isPending, isError, error } = useChangePassword()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        className="flex w-full max-w-lg flex-col gap-6 border-4 border-black bg-background p-6 shadow-hard-lg md:p-10"
        onClick={(e) => e.stopPropagation()}
        // la confirmación no viaja a la API
        onSubmit={handleSubmit(({ currentPassword, newPassword }) => changePassword({ currentPassword, newPassword }, { onSuccess }))}
      >
        <h2 className="text-center text-2xl font-bold md:text-3xl">Cambiar contraseña</h2>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="currentPassword" className="text-xs font-bold tracking-wide uppercase">Contraseña actual</label>
          <input id="currentPassword" type="password" autoComplete="current-password" {...register('currentPassword')} className="w-full border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
          {errors.currentPassword && <p className="w-fit border-2 border-black bg-coral px-2 py-0.5 text-xs">{errors.currentPassword.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="newPassword" className="text-xs font-bold tracking-wide uppercase">Nueva contraseña</label>
          <input id="newPassword" type="password" autoComplete="new-password" {...register('newPassword')} className="w-full border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
          {errors.newPassword && <p className="w-fit border-2 border-black bg-coral px-2 py-0.5 text-xs">{errors.newPassword.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-bold tracking-wide uppercase">Repetir nueva contraseña</label>
          <input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} className="w-full border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
          {errors.confirmPassword && <p className="w-fit border-2 border-black bg-coral px-2 py-0.5 text-xs">{errors.confirmPassword.message}</p>}
        </div>

        {isError && <p role="alert" className="w-fit border-2 border-black bg-coral px-2 py-0.5 text-sm self-center">{error.message}</p>}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer border-2 border-black bg-coral px-6 py-3 text-sm font-bold press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 md:text-base"
          >
            {isPending ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-2 border-black bg-button px-6 py-3 text-sm font-bold press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChangePasswordModal
