import { Link } from "react-router-dom"
import Logo from "../components/ui/Logo.tsx"
import InputImage from "../components/ui/InputImage.tsx"
import { useRegister } from "../hooks/auth/useRegister.ts"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "shared/schemas/auth.schema"
import { useState } from "react"

const Register = () => {

  const [photo, setPhoto] = useState<File | null>(null)

  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" }
  })

  const isArtist = useWatch({ control, name: "role" }) === "ARTIST"

  const { mutate: registerUser, isPending, isError, isSuccess, error } = useRegister()

  const formSubmit = (data: RegisterInput) => registerUser({ data, photo })


  return (
    <div className="flex min-h-svh flex-col gap-8 bg-green p-4 md:gap-12 md:p-8 xl:px-16 xl:py-10">
      <header className="flex items-center justify-center">
        <Link
          to="/"
          aria-label="Garsonic, ir al inicio"
          className="block size-10 rounded-full focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black md:size-12"
        >
          <Logo />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1">
        <form className="flex flex-col gap-6 rounded-3xl border-4 border-black bg-background p-6 shadow-hard-lg md:p-10" onSubmit={handleSubmit(formSubmit)}>
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-2xl font-bold md:text-3xl">Creá tu cuenta</h1>
            <p className="text-sm">Sumate a Garsonic para escuchar y publicar música</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold tracking-wide uppercase">Nombre</label>
              <input id="name" {...register("name")} type="text" autoComplete="given-name" className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="surname" className="text-xs font-bold tracking-wide uppercase">Apellido</label>
              <input id="surname" {...register("surname")} type="text" autoComplete="family-name" className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
              {errors.surname && <p className="text-xs text-red-600">{errors.surname.message}</p>}
            </div>

            <fieldset className="flex flex-col gap-1.5">
              <legend className="text-xs font-bold tracking-wide uppercase">Quiero ser</legend>
              <div className="flex overflow-hidden rounded-xl border-2 border-black bg-button shadow-hard">
                <label className="flex-1 cursor-pointer px-3 py-2.5 text-center text-sm has-checked:bg-coral">
                  <input type="radio" value="USER" {...register("role")} className="sr-only" />
                  Oyente
                </label>
                <label className="flex-1 cursor-pointer border-l-2 border-black px-3 py-2.5 text-center text-sm has-checked:bg-coral">
                  <input type="radio" value="ARTIST" {...register("role")} className="sr-only" />
                  Artista
                </label>
              </div>
            </fieldset>

            <InputImage id="photo" name="photo" label="Foto de perfil" onChange={setPhoto} />

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="username" className="text-xs font-bold tracking-wide uppercase">{isArtist ? "Nombre artistico" : "Usuario"}</label>
              <input id="username" type="text" autoComplete="username" {...register("username")} className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
              {errors.username && <p className="text-xs text-red-600">{errors.username.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="email" className="text-xs font-bold tracking-wide uppercase">Email</label>
              <input id="email" {...register("email")} type="email" autoComplete="email" className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="password" className="text-xs font-bold tracking-wide uppercase">Contraseña</label>
              <input id="password" {...register("password")} type="password" autoComplete="new-password" className="w-full rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="bio" className="text-xs font-bold tracking-wide uppercase">Bio (opcional)</label>
              <textarea id="bio" rows={3} {...register("bio")} className="w-full resize-none rounded-xl border-2 border-black bg-button px-4 py-2.5 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black" />
              {errors.bio && <p className="text-xs text-red-600">{errors.bio.message}</p>}
            </div>
          </div>

          {isError && <p className="text-center text-sm text-red-600">{error.message}</p>}
          {isSuccess && <p className="text-center text-sm font-bold">¡Listo! Revisá tu email para confirmar la cuenta.</p>}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-full border-2 cursor-pointer border-black bg-coral px-6 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 md:text-base"
          >
            {isPending ? "Creando..." : "Crear cuenta"}
          </button>

          <p className="text-center text-sm">
            ¿Ya tenés cuenta?{" "}
            <Link to="/ingreso" className="font-bold cursor-pointer underline underline-offset-2">
              Ingresá
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}

export default Register
