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
        className="flex w-full cursor-pointer flex-col items-center gap-2 border-4 border-black bg-button p-4 text-center press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        {user.photo ? (
          <img src={user.photo} alt="" className="size-20 rounded-full border-2 border-black object-cover md:size-24" />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-black bg-green text-3xl md:size-24" aria-hidden="true">
            <i className="bi bi-person-fill"></i>
          </div>
        )}
        <p className="w-full truncate text-sm font-bold md:text-base">{user.name} {user.surname}</p>
        <p className="w-full truncate text-xs">@{user.username}</p>
      </button>
    </li>
  )
}

export default UserResult
