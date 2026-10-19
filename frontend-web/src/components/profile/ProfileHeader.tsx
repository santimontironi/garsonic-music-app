import type { ReactNode } from "react"
import type { UserProfile } from "../../types/user.types"

interface ProfileHeaderProps {
  user: Pick<UserProfile, "name" | "surname" | "username" | "photo" | "bio">
  photoAction?: ReactNode
  usernameSlot?: ReactNode
}

// photoAction va sobre la foto y usernameSlot reemplaza al @username: los usa MyProfile para editar
const ProfileHeader = ({ user, photoAction, usernameSlot }: ProfileHeaderProps) => (
  <header className="flex flex-col gap-6 border-4 border-black bg-coral p-6 pt-10 shadow-hard-lg md:flex-row md:items-end md:gap-8 md:p-8 md:pt-14 2xl:pt-20">
    <div className="relative w-fit shrink-0">
      {user.photo ? (
        <img
          src={user.photo}
          alt={`Foto de perfil de ${user.name}`}
          className="size-28 rounded-full border-4 border-black bg-button object-cover shadow-hard md:size-40 2xl:size-48"
        />
      ) : (
        <div
          role="img"
          aria-label={`Perfil de ${user.name}`}
          className="flex size-28 items-center justify-center rounded-full border-4 border-black bg-green text-3xl uppercase shadow-hard md:size-40 md:text-5xl 2xl:size-48"
        >
          {user.name[0]}{user.surname[0]}
        </div>
      )}

      {photoAction}
    </div>

    <div className="flex min-w-0 flex-col gap-3 md:pb-2">
      <h3 className="text-3xl leading-[0.95] wrap-break-word uppercase text-shadow-[3px_3px_0_#FFFEFD] md:text-5xl md:text-shadow-[5px_5px_0_#FFFEFD] 2xl:text-7xl">
        {user.name} {user.surname}
      </h3>

      {usernameSlot ?? (
        <span className="w-fit max-w-full truncate border-2 border-black bg-button px-3 py-1 text-sm md:text-base">@{user.username}</span>
      )}

      {user.bio && <p className="text-sm md:text-base">{user.bio}</p>}
    </div>
  </header>
)

export default ProfileHeader
