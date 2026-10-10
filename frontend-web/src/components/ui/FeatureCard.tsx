type Props = {
  icon: string
  title: string
  text: string
  accent: string
}

const FeatureCard = ({ icon, title, text, accent }: Props) => {
  return (
    <article className="flex flex-col border-4 border-black bg-button shadow-hard-lg">
      <div className={`border-b-4 border-black p-4 ${accent}`}>
        <span className="flex size-10 items-center justify-center bg-black text-lg text-button md:size-12 md:text-xl">
          <i className={`bi ${icon}`} aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4 md:p-5">
        <h3 className="text-sm uppercase md:text-base">{title}</h3>
        <p className="text-xs leading-relaxed md:text-sm">{text}</p>
      </div>
    </article>
  )
}

export default FeatureCard
