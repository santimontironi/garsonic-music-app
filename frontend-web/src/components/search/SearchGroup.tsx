import type { ReactNode } from "react"

interface SearchGroupProps {
  title: string
  icon: string
  children: ReactNode
}

const SearchGroup = ({ title, icon, children }: SearchGroupProps) => {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 text-lg font-bold uppercase md:text-xl">
        <i className={`bi ${icon}`} aria-hidden="true"></i>
        {title}
      </h3>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
        {children}
      </ul>
    </section>
  )
}

export default SearchGroup
