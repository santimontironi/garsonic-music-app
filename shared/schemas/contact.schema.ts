import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    email: z.string().email({ message: 'El email es inválido' }),
    message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres' }).max(1000, { message: 'El mensaje no puede superar los 1000 caracteres' }),
})

export type ContactInput = z.infer<typeof contactSchema>
