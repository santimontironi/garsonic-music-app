import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <div className="flex flex-col md:min-h-[80svh]">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 border-b-4 border-black bg-button bg-[linear-gradient(to_right,#00000026_1px,transparent_1px),linear-gradient(to_bottom,#00000026_1px,transparent_1px)] bg-size-[36px_36px] px-6 py-16 text-center md:gap-8 md:px-10 md:py-20 xl:px-16">
        <h1 className="max-w-5xl text-3xl leading-[1.05] font-bold uppercase text-shadow-[4px_4px_0_#FC7B5E] md:text-5xl md:text-shadow-[6px_6px_0_#FC7B5E] xl:text-7xl 2xl:text-8xl">
          Escuchá lo que te mueve y{" "}
          <span className="inline-block -rotate-1 bg-black px-2 text-green text-shadow-none">publicá</span>{" "}
          lo tuyo
        </h1>

        <p className="max-w-xl text-xs leading-relaxed md:text-sm xl:max-w-2xl xl:text-base">
          Armá tus playlists, marcá tus favoritos y, si sos artista, publicá tus álbumes y canciones en un solo lugar.
        </p>

        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:justify-center">
          <Link
            to="/ingreso"
            className="group flex items-center justify-center gap-2 border-2 border-black bg-green px-6 py-4 text-xs uppercase press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-sm"
          >
            Empezá a escuchar
            <i className="bi bi-arrow-up-right transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
          <a
            href="#sobre-garsonic"
            className="group flex items-center justify-center gap-2 border-2 border-black bg-button px-6 py-4 text-xs uppercase press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-sm"
          >
            Conocé más
            <i className="bi bi-arrow-down transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 bg-black px-6 py-4 text-xs text-green uppercase md:gap-x-10 md:text-sm xl:text-base">
        <li>Escuchá</li>
        <li aria-hidden="true" className="text-coral"><i className="bi bi-asterisk"></i></li>
        <li>Guardá</li>
        <li aria-hidden="true" className="text-coral"><i className="bi bi-asterisk"></i></li>
        <li>Armá playlists</li>
        <li aria-hidden="true" className="text-coral"><i className="bi bi-asterisk"></i></li>
        <li>Publicá</li>
      </ul>
    </div>
  )
}

export default Hero
