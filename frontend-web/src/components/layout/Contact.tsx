import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactInput } from "shared/schemas/contact.schema"
import { useSendContact } from "../../hooks/contact/useSendContact"

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const { mutate: sendContact, isPending, isError, isSuccess, error } = useSendContact()

  const formSubmit = (data: ContactInput) => sendContact(data, { onSuccess: () => reset() })

  const field = "w-full border-2 border-black bg-button px-4 py-3 text-sm shadow-hard transition-shadow focus:shadow-[6px_6px_0_0_#FC7B5E] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"

  return (
    <div className="grid gap-10 border-t-4 border-black bg-background px-6 py-14 md:gap-14 md:px-10 md:py-20 xl:grid-cols-[2fr_3fr] xl:gap-16 xl:px-16 xl:py-24">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl leading-tight uppercase md:text-3xl xl:text-4xl">
            ¿Tenés algo para <span className="bg-button px-1 shadow-hard-sm">decirnos</span>?
          </h2>
          <p className="max-w-xl text-xs leading-relaxed md:text-sm">
            Escribinos por dudas, propuestas o si querés sumar tu música a Garsonic.
          </p>

          <ul className="flex flex-col gap-3">
            {[
              { text: "Dudas sobre tu cuenta", icon: "bi-question-lg" },
              { text: "Propuestas e ideas", icon: "bi-lightbulb-fill" },
              { text: "Sumar tu música", icon: "bi-music-note-beamed" },
            ].map(({ text, icon }) => (
              <li key={text} className="flex items-center gap-3 text-xs uppercase md:text-sm">
                <span className="flex size-9 shrink-0 items-center justify-center border-2 border-black bg-green shadow-hard-sm">
                  <i className={`bi ${icon}`} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <p className="flex w-fit items-center gap-2 border-2 border-black bg-black px-3 py-2 text-xs text-green uppercase">
            <i className="bi bi-clock-fill" aria-hidden="true" />
            Respondemos en pocos días
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(formSubmit)}
          className="flex flex-col border-4 border-black bg-button shadow-hard-lg"
        >
          <div className="flex items-center justify-between gap-4 border-b-4 border-black bg-coral px-5 py-3 md:px-6">
            <span className="text-xs uppercase md:text-sm">Nuevo mensaje</span>
            <i className="bi bi-envelope-fill text-lg" aria-hidden="true" />
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6 xl:p-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-name" className="text-xs uppercase">Nombre</label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
                className={field}
              />
              {errors.name && <p className="w-fit bg-coral px-2 py-1 text-xs">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contact-email" className="text-xs uppercase">Email</label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
                className={field}
              />
              {errors.email && <p className="w-fit bg-coral px-2 py-1 text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="contact-message" className="text-xs uppercase">Mensaje</label>
              <textarea
                id="contact-message"
                rows={5}
                aria-invalid={!!errors.message}
                {...register("message")}
                className={`${field} resize-none`}
              />
              {errors.message && <p className="w-fit bg-coral px-2 py-1 text-xs">{errors.message.message}</p>}
            </div>

            {isError && <p role="alert" className="w-fit bg-coral px-2 py-1 text-xs md:col-span-2">{error.message}</p>}
            {isSuccess && <p role="status" className="w-fit bg-green px-2 py-1 text-xs md:col-span-2">¡Mensaje enviado! Te respondemos en pocos días.</p>}

            <button
              type="submit"
              disabled={isPending}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-black bg-green px-6 py-4 text-xs uppercase press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 md:col-span-2 md:w-fit md:text-sm"
            >
              {isPending ? "Enviando..." : "Enviar mensaje"}
            </button>
          </div>
        </form>
    </div>
  )
}

export default Contact
