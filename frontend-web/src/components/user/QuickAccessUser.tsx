type Props = {
  title: string
  text: string
  icon: string
  onClick: () => void
}

const QuickAccessUser = ({ title, text, icon, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex cursor-pointer flex-col gap-4 border-4 border-black bg-coral p-5 text-left shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-12 items-center justify-center border-2 border-black bg-green text-xl text-black">
          <i className={`bi ${icon}`} aria-hidden="true" />
        </span>
        <i className="bi bi-arrow-right text-xl transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm uppercase md:text-base">{title}</span>
        <span className="text-xs leading-relaxed">{text}</span>
      </div>
    </button>
  )
}

export default QuickAccessUser
