import { useState } from "react"
import { Link } from "react-router-dom"
import Logo from "./Logo.tsx"
import { useMe } from "../../hooks/auth/useMe.ts"
import { useLogout } from "../../hooks/auth/useLogout.ts"

const Header = () => {
  const { data: user } = useMe()
  const logout = useLogout()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="flex flex-wrap border-b-4 border-black bg-button">
      <Link
        to="/"
        aria-label="Garsonic, ir al inicio"
        className="flex items-center gap-2 border-r-4 border-black bg-green px-3 py-3 text-xs uppercase focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-black md:gap-3 md:px-5 md:text-sm"
      >
        <span className="size-7 shrink-0 md:size-8">
          <Logo />
        </span>
        Garsonic
      </Link>

      <button
        type="button"
        onClick={() => setMenuOpen(o => !o)}
        aria-expanded={menuOpen}
        aria-controls="header-menu"
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        className="ml-auto flex w-14 cursor-pointer items-center justify-center border-l-4 border-black bg-coral text-xl focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-black md:hidden"
      >
        <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`} aria-hidden="true" />
      </button>

      <div
        id="header-menu"
        className={`grid w-full transition-[grid-template-rows,visibility] duration-300 md:visible md:flex md:w-auto md:flex-1 ${menuOpen ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}
      >
        <div className="flex min-h-0 flex-col overflow-hidden md:flex-1 md:flex-row md:overflow-visible">
          <nav
            aria-label="Secciones"
            className="flex flex-col border-t-4 border-black text-xs uppercase md:flex-1 md:flex-row md:items-center md:justify-center md:gap-8 md:border-t-0"
          >
            <a href="#inicio" onClick={() => setMenuOpen(false)} className="border-b-2 border-black px-4 py-3 underline-offset-4 hover:underline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-black md:border-0 md:p-0">Inicio</a>
            <a href="#sobre-garsonic" onClick={() => setMenuOpen(false)} className="border-b-2 border-black px-4 py-3 underline-offset-4 hover:underline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-black md:border-0 md:p-0">Sobre Garsonic</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)} className="px-4 py-3 underline-offset-4 hover:underline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-black md:p-0">Contacto</a>
          </nav>

          <div className="flex flex-col md:flex-row">
            {user ? (
              <>
                <Link
                  to={user.role === "ARTIST" ? "/panel-artista" : "/panel-usuario"}
                  className="flex items-center border-t-4 border-black px-4 py-3 text-xs uppercase hover:bg-green focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-black md:border-t-0 md:border-l-4 md:px-5 md:py-0"
                >
                  Ingresar
                </Link>
                <button
                  type="button"
                  onClick={() => logout.mutate()}
                  className="flex cursor-pointer items-center gap-2 border-t-4 border-black bg-coral px-4 py-3 text-xs uppercase hover:bg-background focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-black md:border-t-0 md:border-l-4 md:px-5 md:py-0"
                >
                  Cerrar sesión
                  <i className="bi bi-box-arrow-right" aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/ingreso"
                  className="flex items-center border-t-4 border-black px-4 py-3 text-xs uppercase hover:bg-green focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-black md:border-t-0 md:border-l-4 md:px-5 md:py-0"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="flex items-center gap-2 border-t-4 border-black bg-coral px-4 py-3 text-xs uppercase hover:bg-background focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-black md:border-t-0 md:border-l-4 md:px-5 md:py-0"
                >
                  Registrarse
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
