type Props = {
  number: string
  title: string
  icon: string
  accent: string
  items: string[]
}

const AudienceCard = ({ number, title, icon, accent, items }: Props) => {
  return (
    <article className="flex flex-col border-4 border-black bg-button shadow-hard-lg">
      <div className={`flex items-center justify-between gap-4 border-b-4 border-black p-5 md:p-6 ${accent}`}>
        <span className="flex size-12 items-center justify-center bg-black text-xl text-button md:size-14 md:text-2xl">
          <i className={`bi ${icon}`} aria-hidden="true" />
        </span>
        <span className="text-3xl font-bold md:text-4xl" aria-hidden="true">{number}</span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5 md:p-6">
        <h3 className="text-base uppercase md:text-lg xl:text-xl">{title}</h3>
        <ul className="flex flex-col">
          {items.map(item => (
            <li key={item} className="flex items-start gap-3 border-t-2 border-black py-3 text-xs leading-relaxed md:text-sm">
              <i className="bi bi-check-square-fill shrink-0 text-base" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default AudienceCard
