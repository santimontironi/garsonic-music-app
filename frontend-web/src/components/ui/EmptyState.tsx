interface EmptyStateProps {
  icon: string
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

const EmptyState = ({ icon, title, message, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-6 border-4 border-black bg-green px-6 py-12 text-center shadow-hard-lg md:gap-8 md:px-12 md:py-16">
      <span className="flex size-24 -rotate-6 items-center justify-center border-4 border-black bg-coral text-5xl shadow-hard md:size-32 md:text-6xl" aria-hidden="true">
        <i className={`bi ${icon}`}></i>
      </span>

      <div className="flex max-w-md flex-col gap-3">
        <h3 className="text-lg font-bold uppercase md:text-2xl">{title}</h3>
        <p className="text-xs md:text-sm">{message}</p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="group flex cursor-pointer items-center gap-2 border-2 border-black bg-coral px-6 py-3 text-sm font-bold uppercase press transition-all duration-150 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:px-8 md:text-base"
        >
          <i className="bi bi-plus-lg" aria-hidden="true"></i>
          {actionLabel}
          <i className="bi bi-arrow-right transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true"></i>
        </button>
      )}
    </div>
  )
}

export default EmptyState
