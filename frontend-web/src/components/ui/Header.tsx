import { Link } from "react-router-dom"
import Logo from "./Logo.tsx"

const Header = () => {
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
        <Link
          to="/ingreso"
          className="rounded-full border-2 border-black bg-button px-3 py-1.5 text-xs shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:px-5 md:py-2 md:text-sm"
        >
          Ingresar
        </Link>
        <Link
          to="/registro"
          className="rounded-full border-2 border-black bg-coral px-3 py-1.5 text-xs shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:px-5 md:py-2 md:text-sm"
        >
          Registrarse
        </Link>
      </nav>
    </header>
  )
}

export default Header
