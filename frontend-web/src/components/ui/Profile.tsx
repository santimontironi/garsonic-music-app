import Loader from "./Loader"
import { useMe } from "../../hooks/auth/useMe"

const Profile = () => {
  const { data: user, isPending } = useMe()

  if (isPending) return <div className="py-12"><Loader /></div>
  if (!user) return null

  const memberSince = user.createdAt.toLocaleDateString("es-AR", { month: "long", year: "numeric" })

  const details = [
    { icon: "bi-person-badge-fill", label: "Cuenta", value: user.role === "ARTIST" ? "Artista" : "Usuario" },
    { icon: "bi-calendar-heart-fill", label: "Miembro desde", value: memberSince }
  ]

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold uppercase md:text-3xl">Perfil</h2>

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

          <button
            type="button"
            aria-label="Editar foto de perfil"
            className="absolute right-0 bottom-0 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-button press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black md:right-1 md:bottom-1 md:size-11"
          >
            <i className="bi bi-camera-fill" aria-hidden="true"></i>
          </button>
        </div>

        <div className="flex min-w-0 flex-col gap-3 md:pb-2">
          <h3 className="text-3xl leading-[0.95] wrap-break-word uppercase text-shadow-[3px_3px_0_#FFFEFD] md:text-5xl md:text-shadow-[5px_5px_0_#FFFEFD] 2xl:text-7xl">
            {user.name} {user.surname}
          </h3>

          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate border-2 border-black bg-button px-3 py-1 text-sm md:text-base">@{user.username}</span>
            <button
              type="button"
              aria-label="Editar nombre de usuario"
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center border-2 border-black bg-button press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <i className="bi bi-pencil-fill text-sm" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </header>

      <dl className="grid gap-4 md:grid-cols-2 md:gap-6">
        {details.map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 border-4 border-black bg-button p-4 shadow-hard md:p-5">
            <span className="flex size-12 shrink-0 items-center justify-center border-2 border-black bg-green text-xl" aria-hidden="true">
              <i className={`bi ${icon}`}></i>
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs">{label}</dt>
              <dd className="truncate text-base first-letter:uppercase md:text-lg">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default Profile
