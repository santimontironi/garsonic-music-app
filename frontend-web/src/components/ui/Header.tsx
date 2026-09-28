import { Link } from "react-router-dom"
import Logo from "./Logo.tsx"
import { useMe } from "../../hooks/auth/useMe.ts"
import { useLogout } from "../../hooks/auth/useLogout.ts"

const buttonClass =
  "rounded-full border-2 border-black px-3 py-1.5 text-xs shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:px-5 md:py-2 md:text-sm"

const Header = () => {
  const { data: user } = useMe()
  const logout = useLogout()

  return (
    <header className="flex items-center justify-between">
      <Link
        to="/"
        aria-label="Garsonic, ir al inicio"
        className="block size-10 rounded-full focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:size-12"
      >
        <Logo />
      </Link>
      <nav className="flex gap-2 md:gap-3">
        {user ? (
          <>
            <Link
              to={user.role === "ARTIST" ? "/panel-artista" : "/panel-usuario"}
              className={`${buttonClass} bg-button`}
            >
              Ingresar
            </Link>
            <button
              type="button"
              onClick={() => logout.mutate()}
              className={`${buttonClass} bg-coral`}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/ingreso" className={`${buttonClass} bg-button`}>
              Iniciar sesión
            </Link>
            <Link to="/registro" className={`${buttonClass} bg-coral`}>
              Registrarse
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
