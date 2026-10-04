import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: 'El email es inválido' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
})

export const registerSchema = z.object({
    name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    surname: z.string().min(3, { message: 'El apellido debe tener al menos 3 caracteres' }),
    username: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' }),
    email: z.string().email({ message: 'El email es inválido' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    role: z.enum(["USER", "ARTIST"], { message: 'El rol es inválido' }),
    bio: z.string().optional(),
})

// lo que devuelve la API: sin password, con null de la DB y fechas como string JSON
export const userSchema = registerSchema.omit({ password: true }).extend({
    id: z.uuid(),
    createdAt: z.coerce.date(),
    bio: z.string().nullish(),
    photo: z.string().nullish()
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>