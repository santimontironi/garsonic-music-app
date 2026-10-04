import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Logo from "../components/ui/Logo.tsx"
import Loader from "../components/ui/Loader.tsx"
import { useConfirmAccount } from "../hooks/auth/useConfirmAccount.ts"

const ConfirmAccount = () => {

  const { token } = useParams()
  const { mutate: confirm, isPending, isError, isSuccess, error } = useConfirmAccount()

  useEffect(() => {
    if (token) confirm(token)
  }, [token, confirm])

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
        <div className="flex flex-col items-center gap-6 rounded-3xl border-4 border-black bg-background p-6 text-center shadow-hard-lg md:p-10">
          {(isPending || (!isError && !isSuccess)) && token && (
            <>
              <h1 className="text-2xl font-bold md:text-3xl">Confirmando tu cuenta</h1>
              <Loader />
            </>
          )}

          {isSuccess && (
            <>
              <h1 className="text-2xl font-bold md:text-3xl">¡Cuenta confirmada!</h1>
              <p className="text-sm">Ya podés ingresar a Garsonic.</p>
              <Link to="/ingreso" className="rounded-full border-2 border-black bg-coral px-6 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base">
                Ingresar
              </Link>
            </>
          )}

          {(isError || !token) && (
            <>
              <h1 className="text-2xl font-bold md:text-3xl">No pudimos confirmar tu cuenta</h1>
              <p role="alert" className="text-sm text-red-600">{error?.message ?? "El enlace no es válido"}</p>
              <Link to="/registro" className="text-sm font-bold underline underline-offset-2">
                Volver a registrarme
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default ConfirmAccount
