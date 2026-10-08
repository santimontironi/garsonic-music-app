import ProfileData from "./ProfileData"

type Props = {
  title: string
  icon: string
}

const HeaderPanel = ({ title, icon }: Props) => {
  return (
    <header className="flex min-w-0 flex-1 items-center self-stretch justify-between gap-3">
      <div className="flex min-w-0 -rotate-2 items-center gap-2 border-2 border-black bg-green py-1.5 pr-4 pl-1.5 shadow-hard md:gap-3 md:py-2 md:pr-5 md:pl-2">
        <span className="flex size-7 shrink-0 items-center justify-center border-2 border-black bg-coral text-sm md:size-8 md:text-base" aria-hidden="true">
          <i className={`bi ${icon}`} />
        </span>
        <p className="truncate text-sm font-bold uppercase md:text-lg">{title}</p>
      </div>
      <ProfileData />
    </header>
  )
}

export default HeaderPanel
