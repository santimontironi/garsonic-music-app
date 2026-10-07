import { Link } from "react-router-dom"
import Vinyl from "../ui/Logo.tsx"

const Hero = () => {
  return (
    <div className="grid md:grid-cols-2 2xl:min-h-[70svh]">
      <div className="flex flex-col items-start justify-center gap-5 border-b-4 border-black bg-button bg-[linear-gradient(to_right,#00000026_1px,transparent_1px),linear-gradient(to_bottom,#00000026_1px,transparent_1px)] bg-size-[36px_36px] p-6 md:gap-6 md:border-r-4 md:border-b-0 md:p-10 xl:p-16">
        <h1 className="text-3xl leading-[1.05] font-bold uppercase text-shadow-[4px_4px_0_#FC7B5E] md:text-shadow-[6px_6px_0_#FC7B5E] md:text-4xl xl:text-6xl 2xl:text-7xl">
          Escuchá lo que te mueve y publicá lo tuyo
        </h1>

        <p className="max-w-md text-xs leading-relaxed md:text-sm xl:max-w-lg xl:text-base">
          Armá tus playlists, marcá tus favoritos y, si sos artista, publicá tus álbumes y canciones en un solo lugar.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/ingreso"
            className="flex items-center gap-2 border-2 border-black bg-green px-5 py-3 text-xs uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-sm"
          >
            Empezá a escuchar
            <i className="bi bi-arrow-up-right" aria-hidden="true" />
          </Link>
          <a
            href="#sobre-garsonic"
            className="flex items-center gap-2 border-2 border-black bg-button px-5 py-3 text-xs uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-sm"
          >
            Conocé más
            <i className="bi bi-arrow-down" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-center bg-coral p-6 md:p-10 xl:p-16">
        <div aria-hidden="true" className="relative aspect-square w-full max-w-sm md:max-w-md xl:max-w-lg">
          <div className="absolute top-[4%] left-[14%] size-[70%] border-4 border-black bg-green" />
          <div className="absolute top-[10%] left-[8%] size-[70%] border-4 border-black bg-background shadow-hard-lg">
            <div className="absolute top-[6%] left-[6%] w-[88%]">
              <Vinyl />
            </div>
          </div>
          <div className="absolute top-[2%] right-0 h-[22%] w-[30%] border-4 border-black bg-button p-[5%] shadow-hard">
            <div className="flex h-full items-end gap-[6%]">
              <span className="h-2/5 w-full bg-black" />
              <span className="h-full w-full bg-black" />
              <span className="h-3/5 w-full bg-black" />
              <span className="h-4/5 w-full bg-black" />
              <span className="h-1/3 w-full bg-black" />
            </div>
          </div>
          <div className="absolute right-0 bottom-[4%] left-[34%] flex flex-col gap-2 border-4 border-black bg-button p-2 text-xs shadow-hard-lg xl:gap-3 xl:p-4 xl:text-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate">Noche de verano</p>
                <p className="truncate">Los Cometas</p>
              </div>
              <span className="grid size-8 shrink-0 place-items-center border-2 border-black bg-green xl:size-11">
                <span className="ml-0.5 size-3 bg-black [clip-path:polygon(0_0,100%_50%,0_100%)] xl:size-4" />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>1:24</span>
              <span className="h-3 flex-1 overflow-hidden border-2 border-black">
                <span className="block h-full w-2/5 border-r-2 border-black bg-coral" />
              </span>
              <span>3:48</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
