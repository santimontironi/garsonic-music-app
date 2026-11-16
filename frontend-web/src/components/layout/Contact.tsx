import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactInput } from "shared/schemas/contact.schema"
import SectionLabel from "../ui/SectionLabel.tsx"
import { useSendContact } from "../../hooks/contact/useSendContact"

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const { mutate: sendContact, isPending, isError, isSuccess, error } = useSendContact()

  const formSubmit = (data: ContactInput) => sendContact(data, { onSuccess: () => reset() })

  return (
    <div className="grid border-t-4 border-black xl:grid-cols-[20rem_1fr]">
      <SectionLabel title="Contacto" accent="bg-coral" />

      <div className="flex flex-col gap-10 bg-background px-6 py-14 md:gap-14 md:px-10 md:py-20 xl:gap-16 xl:px-16 xl:py-28">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl leading-tight uppercase md:text-3xl xl:text-4xl">
            ¿Tenés algo para decirnos?
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed md:text-base">
            Escribinos por dudas, propuestas o si querés sumar tu música a Garsonic. Te respondemos en pocos días.
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(formSubmit)}
          className="grid gap-5 border-4 border-black bg-button p-5 shadow-hard-lg md:grid-cols-2 md:p-6 xl:p-8"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className="text-xs uppercase">Nombre</label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
              className="w-full border-2 border-black bg-button px-4 py-3 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
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
              className="w-full border-2 border-black bg-button px-4 py-3 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
            />
            {errors.email && <p className="w-fit bg-coral px-2 py-1 text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="contact-message" className="text-xs uppercase">Mensaje</label>
            <textarea
              id="contact-message"
              rows={4}
              aria-invalid={!!errors.message}
              {...register("message")}
              className="w-full resize-none border-2 border-black bg-button px-4 py-3 text-sm shadow-hard focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
            />
            {errors.message && <p className="w-fit bg-coral px-2 py-1 text-xs">{errors.message.message}</p>}
          </div>

          {isError && <p role="alert" className="w-fit bg-coral px-2 py-1 text-xs md:col-span-2">{error.message}</p>}
          {isSuccess && <p role="status" className="w-fit bg-green px-2 py-1 text-xs md:col-span-2">¡Mensaje enviado! Te respondemos en pocos días.</p>}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-fit cursor-pointer items-center gap-2 border-2 border-black bg-green px-6 py-3 text-xs uppercase press focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-60 md:text-sm"
          >
            {isPending ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact
