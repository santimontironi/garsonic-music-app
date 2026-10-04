import { useMe } from "../../hooks/auth/useMe"

const ProfileData = () => {
  const { data: user } = useMe()

  if (!user) return null

  return (
    <div className="flex items-center gap-3 self-stretch border-l-4 border-black pl-4 md:pl-6">
      <div className="hidden flex-col items-end xl:flex">
        <p className="text-xs leading-tight">{user.name} {user.surname}</p>
        <p className="text-[10px]">@{user.username}</p>
      </div>

      {user.photo ? (
        <img
          src={user.photo}
          alt={`Foto de perfil de ${user.name}`}
          className="size-10 shrink-0 border-2 border-black object-cover"
        />
      ) : (
        <div
          className="flex size-10 shrink-0 items-center justify-center border-2 border-black bg-green text-xs uppercase"
          aria-label={`Perfil de ${user.name}`}
          role="img"
        >
          {user.name[0]}{user.surname[0]}
        </div>
      )}
    </div>
  )
}

export default ProfileData
