import { Link } from "react-router-dom"
import Logo from "../ui/Logo.tsx"

const Footer = () => {
  return (
    <footer className="flex flex-wrap border-t-4 border-black bg-button">
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

      <p className="order-last flex w-full items-center justify-center border-t-4 border-black px-3 py-3 text-center text-[10px] md:order-0 md:w-auto md:flex-1 md:border-t-0 md:text-xs">
        © {new Date().getFullYear()} Garsonic. Todos los derechos reservados.
      </p>

      <a
        href="#inicio"
        className="ml-auto flex items-center gap-2 border-l-4 border-black bg-coral px-3 text-[10px] uppercase hover:bg-background focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-black md:ml-0 md:px-5 md:text-xs"
      >
        Volver arriba
        <i className="bi bi-arrow-up" aria-hidden="true" />
      </a>
    </footer>
  )
}

export default Footer
