interface SearchChipProps {
  icon: string
  label: string
}

const SearchChip = ({ icon, label }: SearchChipProps) => {
  return (
    <li className="flex items-center gap-2 border-2 border-black bg-button px-3 py-1.5 text-xs font-bold uppercase md:text-sm">
      <i className={`bi ${icon}`} aria-hidden="true"></i>
      {label}
    </li>
  )
}

export default SearchChip
