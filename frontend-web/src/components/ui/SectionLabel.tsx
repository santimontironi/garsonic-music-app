type Props = {
  title: string
  accent: string
}

const SectionLabel = ({ title, accent }: Props) => {
  return (
    <div className={`flex items-center justify-between gap-4 border-b-4 border-black p-6 md:p-8 xl:flex-col xl:items-start xl:justify-center xl:border-r-4 xl:border-b-0 ${accent}`}>
      <h2 className="text-xl uppercase md:text-2xl xl:text-3xl">{title}</h2>
      <i className="bi bi-arrow-down text-xl xl:hidden" aria-hidden="true" />
      <i className="bi bi-arrow-right hidden text-2xl xl:block" aria-hidden="true" />
    </div>
  )
}

export default SectionLabel
