import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserSchema, type UpdateUserInput } from "shared/schemas/user.schema"
import { useMe } from "../../hooks/auth/useMe"
import { useUpdateUser } from "../../hooks/user/useUpdateUser"
import Loader from "../ui/Loader"
import ProfileHeader from "./ProfileHeader"

const MyProfile = () => {
  const { data: user, isPending: isLoading } = useMe()
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const { mutate: updateUser, isPending, isError, error, reset: resetMutation } = useUpdateUser()

  const { register, handleSubmit, reset: resetForm, formState: { errors } } = useForm({
    resolver: zodResolver(updateUserSchema),
    values: { username: user?.username }
  })

  if (isLoading) return <div className="py-12"><Loader /></div>
  if (!user) return null

  const closeUsernameEdit = () => {
    setIsEditingUsername(false)
    resetForm()
    resetMutation()
  }

  const submitUsername = ({ username }: UpdateUserInput) => {
    if (username === user.username) return closeUsernameEdit()
    updateUser({ username }, { onSuccess: closeUsernameEdit })
  }

  const memberSince = user.createdAt.toLocaleDateString("es-AR", { month: "long", year: "numeric" })

  const details = [
    { icon: "bi-person-badge-fill", label: "Cuenta", value: user.role === "ARTIST" ? "Artista" : "Usuario" },
    { icon: "bi-calendar-heart-fill", label: "Miembro desde", value: memberSince }
  ]

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold uppercase md:text-3xl">Perfil</h2>

      <ProfileHeader
        user={user}
        photoAction={
          <label
            aria-label="Editar foto de perfil"
            className="absolute right-0 bottom-0 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-button press has-focus-visible:outline-4 has-focus-visible:outline-offset-2 has-focus-visible:outline-black has-disabled:pointer-events-none has-disabled:opacity-60 md:right-1 md:bottom-1 md:size-11"
          >
            <i className={`bi ${isPending ? "bi-hourglass-split" : "bi-camera-fill"}`} aria-hidden="true"></i>
            <input
              type="file"
              accept="image/*"
              disabled={isPending}
              className="sr-only"
              onChange={(e) => {
                const photo = e.target.files?.[0]
                if (photo) updateUser({ photo })
                e.target.value = ""
              }}
            />
          </label>
        }
        usernameSlot={
          <>
            {isEditingUsername ? (
              <form onSubmit={handleSubmit(submitUsername)} className="flex min-w-0 items-center gap-2">
                <label htmlFor="username" className="sr-only">Nombre de usuario</label>
                <input
                  id="username"
                  type="text"
                  autoFocus
                  {...register("username")}
                  className="min-w-0 border-2 border-black bg-button px-3 py-1 text-sm focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black md:text-base"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  aria-label="Guardar nombre de usuario"
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center border-2 border-black bg-green press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60"
                >
                  <i className="bi bi-check-lg" aria-hidden="true"></i>
                </button>
                <button
                  type="button"
                  onClick={closeUsernameEdit}
                  aria-label="Cancelar edición"
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center border-2 border-black bg-button press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  <i className="bi bi-x-lg" aria-hidden="true"></i>
                </button>
              </form>
            ) : (
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate border-2 border-black bg-button px-3 py-1 text-sm md:text-base">@{user.username}</span>
                <button
                  type="button"
                  onClick={() => setIsEditingUsername(true)}
                  aria-label="Editar nombre de usuario"
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center border-2 border-black bg-button press focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  <i className="bi bi-pencil-fill text-sm" aria-hidden="true"></i>
                </button>
              </div>
            )}

            {errors.username && <p className="text-xs text-red-600">{errors.username.message}</p>}
            {isError && <p className="text-xs text-red-600">{error.message}</p>}
          </>
        }
      />

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

export default MyProfile
