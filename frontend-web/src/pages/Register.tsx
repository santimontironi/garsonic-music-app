import { Link } from "react-router-dom"
import Logo from "../components/ui/Logo.tsx"

const Register = () => {
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

      <main className="mx-auto w-full max-w-2xl flex-1">
        <form className="flex flex-col gap-6 rounded-3xl border-4 border-black bg-background p-6 shadow-hard-lg md:p-10">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-2xl font-bold md:text-3xl">Creá tu cuenta</h1>
            <p className="text-sm">Sumate a Garsonic para escuchar y publicar música</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold tracking-wide uppercase">Nombre</label>
              <input id="name" name="name" type="text" autoComplete="given-name" required className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="surname" className="text-xs font-bold tracking-wide uppercase">Apellido</label>
              <input id="surname" name="surname" type="text" autoComplete="family-name" required className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="email" className="text-xs font-bold tracking-wide uppercase">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="password" className="text-xs font-bold tracking-wide uppercase">Contraseña</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
            </div>

            <fieldset className="flex flex-col gap-1.5">
              <legend className="text-xs font-bold tracking-wide uppercase">Quiero ser</legend>
              <div className="flex overflow-hidden rounded-xl border-2 border-black bg-button shadow-hard">
                <label className="flex-1 cursor-pointer px-3 py-2.5 text-center text-sm has-checked:bg-coral">
                  <input type="radio" name="role" value="USER" defaultChecked className="sr-only" />
                  Oyente
                </label>
                <label className="flex-1 cursor-pointer border-l-2 border-black px-3 py-2.5 text-center text-sm has-checked:bg-coral">
                  <input type="radio" name="role" value="ARTIST" className="sr-only" />
                  Artista
                </label>
              </div>
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="photo" className="text-xs font-bold tracking-wide uppercase">Foto de perfil</label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-xs shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black file:mr-3 file:rounded-full file:border-2 file:border-black file:bg-green file:px-3 file:py-1 file:text-xs file:font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="bio" className="text-xs font-bold tracking-wide uppercase">Bio</label>
              <textarea id="bio" name="bio" rows={3} className="w-full resize-none rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full border-2 cursor-pointer border-black bg-coral px-6 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base"
          >
            Crear cuenta
          </button>

          <p className="text-center text-sm">
            ¿Ya tenés cuenta?{" "}
            <Link to="/ingreso" className="font-bold cursor-pointer underline underline-offset-2">
              Ingresá
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}

export default Register
