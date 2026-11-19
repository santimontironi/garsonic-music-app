import type { SearchUser } from "../../types/search.types"

interface UserResultProps {
  user: SearchUser
  onClick: () => void
}

const UserResult = ({ user, onClick }: UserResultProps) => {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full cursor-pointer flex-col items-center gap-2 border-4 border-black bg-button p-4 text-center shadow-hard transition-[translate,box-shadow] duration-150 ease-out hover:-translate-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-1 active:shadow-none motion-reduce:transition-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        <div className="size-20 overflow-hidden rounded-full border-2 border-black md:size-24">
          {user.photo ? (
            <img src={user.photo} alt="" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" />
          ) : (
            <div className="flex size-full items-center justify-center bg-green text-3xl" aria-hidden="true">
              <i className="bi bi-person-fill"></i>
            </div>
          )}
        </div>
        <p className="w-full truncate text-sm md:text-base">{user.name} {user.surname}</p>
        <p className="w-full truncate text-sm">@{user.username}</p>
      </button>
    </li>
  )
}

export default UserResult
