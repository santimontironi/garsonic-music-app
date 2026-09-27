import { Link } from "react-router-dom"
import Header from "../components/ui/Header.tsx"
import Vinyl from "../components/ui/Logo.tsx"

const Home = () => {
  return (
    <div className="flex min-h-svh flex-col gap-8 p-4 md:gap-12 md:p-8 xl:px-16 xl:py-10">
      <Header />
      <main className="grid flex-1 items-center gap-10 md:grid-cols-2 md:gap-8 xl:grid-cols-[auto_auto] xl:justify-center xl:gap-16">
        <div className="flex flex-col items-start gap-4 md:gap-6">
          <h1 className="text-3xl leading-[1.1] font-bold md:text-4xl xl:max-w-180 xl:text-5xl 2xl:max-w-240 2xl:text-7xl">
            Escuchá lo que te mueve y publicá lo tuyo
          </h1>
          <p className="max-w-xl text-sm xl:max-w-180 xl:text-base">
            Armá tus playlists, marcá tus favoritos y, si sos artista, publicá tus álbumes y canciones en un solo lugar.
          </p>
          <Link
            to="/ingreso"
            className="rounded-full border-2 border-black bg-button px-6 py-3 text-sm shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:text-base"
          >
            Empezá a escuchar
          </Link>
        </div>
        <div
          aria-hidden="true"
          className="relative mx-auto aspect-square w-full max-w-sm md:order-first md:max-w-none xl:w-lg 2xl:w-xl"
        >
          <div className="absolute top-[16%] left-[6%] size-[72%] rounded-3xl border-4 border-black bg-coral" />
          <div className="absolute top-[10%] left-[12%] size-[72%] rounded-3xl border-4 border-black bg-green">
            <div className="absolute top-[6%] left-[6%] w-[84%]">
              <Vinyl />
            </div>
          </div>
          <div className="absolute top-[3%] right-0 h-[22%] w-[32%] rounded-2xl border-4 border-black bg-coral p-[5%] shadow-hard">
            <div className="flex h-full items-end gap-[6%]">
              <span className="h-2/5 w-full rounded-full bg-black" />
              <span className="h-full w-full rounded-full bg-black" />
              <span className="h-3/5 w-full rounded-full bg-black" />
              <span className="h-4/5 w-full rounded-full bg-black" />
              <span className="h-1/3 w-full rounded-full bg-black" />
            </div>
          </div>
          <div className="absolute right-0 bottom-[6%] left-[34%] flex flex-col gap-2 rounded-2xl border-2 border-black bg-button p-2 text-xs shadow-hard xl:gap-3 xl:p-4 xl:text-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate">Noche de verano</p>
                <p className="truncate">Los Cometas</p>
              </div>
              <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-black bg-green xl:size-11">
                <span className="ml-0.5 size-3 bg-black [clip-path:polygon(0_0,100%_50%,0_100%)] xl:size-4" />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>1:24</span>
              <span className="h-3 flex-1 overflow-hidden rounded-full border-2 border-black">
                <span className="block h-full w-2/5 border-r-2 border-black bg-coral" />
              </span>
              <span>3:48</span>
            </div>
          </div>
          <i className="bi bi-triangle-fill absolute top-0 left-[4%] text-5xl leading-none text-coral xl:text-7xl"></i>
          <i className="bi bi-star-fill absolute bottom-0 left-0 text-5xl leading-none text-green xl:text-7xl"></i>
        </div>
      </main>
    </div>
  )
}

export default Home
