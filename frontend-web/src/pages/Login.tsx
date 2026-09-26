import { Link } from "react-router-dom"
import Logo from "../components/ui/Logo.tsx"

const Login = () => {
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
        <form className="flex flex-col gap-6 rounded-3xl border-4 border-black bg-background p-6 shadow-hard-lg md:p-10">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-2xl font-bold md:text-3xl">Ingresá a tu cuenta</h1>
            <p className="text-sm">Escuchá y publicá tu música en Garsonic</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold tracking-wide uppercase">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold tracking-wide uppercase">Contraseña</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full border-2 border-black bg-coral px-6 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base"
          >
            Ingresar
          </button>

          <p className="text-center text-sm">
            ¿No tenés cuenta?{" "}
            <Link to="/registro" className="font-bold cursor-pointer underline underline-offset-2">
              Registrate
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}

export default Login
