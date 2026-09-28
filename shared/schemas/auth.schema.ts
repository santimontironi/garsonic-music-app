import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: 'El email es inválido' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
})

export const registerSchema = z.object({
    name: z.string().min(3),
    surname: z.string().min(3),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["USER", "ARTIST"]),
    bio: z.string().optional(),
})

export const userSchema = registerSchema.extend({
    id: z.uuid(),
    createdAt: z.date(),
    photo: z.string().optional()
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>