type Props = {
  label: string
  value: number
  icon: string
  bg: string
}

const HomeArtistStats = ({ label, value, icon, bg }: Props) => {
  return (
    <div className={`flex items-center gap-4 border-4 border-black p-5 shadow-hard ${bg}`}>
      <span className="flex size-12 shrink-0 items-center justify-center border-2 border-black bg-button text-xl" aria-hidden="true">
        <i className={`bi ${icon}`} />
      </span>
      <div className="flex flex-col">
        <span className="text-2xl font-bold tabular-nums md:text-3xl">{value}</span>
        <span className="text-xs uppercase">{label}</span>
      </div>
    </div>
  )
}

export default HomeArtistStats
