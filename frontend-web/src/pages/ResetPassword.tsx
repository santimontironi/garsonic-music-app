import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordFormSchema, type ResetPasswordFormInput } from "shared/schemas/auth.schema"
import Logo from "../components/ui/Logo.tsx"
import { useResetPassword } from "../hooks/auth/useResetPassword"

const ResetPassword = () => {

  const { token } = useParams()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
  })

  const { mutate: resetPassword, isPending, isError, error } = useResetPassword()

  function formSubmit({ password }: ResetPasswordFormInput) {
    if (token) resetPassword({ token, password }, { onSuccess: () => navigate('/ingreso') })
  }

  return (
    <div className="flex min-h-svh flex-col gap-8 bg-green p-4 md:gap-12 md:p-8 xl:px-16 xl:py-10">
      <header className="flex items-center justify-center">
        <Link
          to="/"
          aria-label="Garsonic, ir al inicio"
          className="block size-10 rounded-full focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:size-12"
        >
          <Logo />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-md flex-1">
        <form className="flex flex-col gap-6 border-4 border-black bg-background p-6 shadow-hard-lg md:p-10" onSubmit={handleSubmit(formSubmit)}>
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-2xl font-bold md:text-3xl">Elegí una nueva contraseña</h1>
            <p className="text-sm">Después vas a poder ingresar con ella</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold tracking-wide uppercase">Nueva contraseña</label>
              <input id="password" type="password" autoComplete="new-password" {...register('password')} className="w-full border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
              {errors.password && <p className="w-fit border-2 border-black bg-coral px-2 py-0.5 text-xs">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-bold tracking-wide uppercase">Repetir contraseña</label>
              <input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} className="w-full border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
              {errors.confirmPassword && <p className="w-fit border-2 border-black bg-coral px-2 py-0.5 text-xs">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {isError && <p role="alert" className="w-fit border-2 border-black bg-coral px-2 py-0.5 text-sm self-center">{error.message}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer border-2 border-black bg-coral px-6 py-3 text-sm font-bold press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 md:text-base"
          >
            {isPending ? 'Guardando...' : 'Guardar contraseña'}
          </button>

          <p className="text-center text-sm">
            <Link to="/ingreso" className="font-bold underline underline-offset-2">
              Volver al ingreso
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}

export default ResetPassword
