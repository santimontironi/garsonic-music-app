import ProfileData from "./ProfileData"

type Props = {
  title: string
}

const HeaderPanel = ({ title }: Props) => {
  return (
    <header className="flex min-w-0 flex-1 items-center self-stretch justify-between gap-3">
      <p className="truncate text-sm uppercase md:text-lg">{title}</p>
      <ProfileData />
    </header>
  )
}

export default HeaderPanel
