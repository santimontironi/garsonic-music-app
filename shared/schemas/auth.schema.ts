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

export const forgotPasswordSchema = loginSchema.pick({ email: true })

export const resetPasswordSchema = loginSchema.pick({ password: true })

// solo para el formulario del front: la confirmación no viaja a la API
export const resetPasswordFormSchema = resetPasswordSchema
    .extend({ confirmPassword: z.string() })
    .refine((data) => data.password === data.confirmPassword, { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] })

// campos sin refine: Zod 4 no deja hacer .extend sobre un schema con refinamientos
const changePasswordFields = z.object({
    currentPassword: z.string().min(1, { message: 'Ingresá tu contraseña actual' }),
    newPassword: registerSchema.shape.password,
})

const isDifferentPassword = (data: { currentPassword: string; newPassword: string }) => data.currentPassword !== data.newPassword
const samePasswordError = { message: 'La nueva contraseña tiene que ser distinta de la actual', path: ['newPassword'] }

export const changePasswordSchema = changePasswordFields.refine(isDifferentPassword, samePasswordError)

// solo para el formulario del front: la confirmación no viaja a la API
export const changePasswordFormSchema = changePasswordFields
    .extend({ confirmPassword: z.string() })
    .refine(isDifferentPassword, samePasswordError)
    .refine((data) => data.newPassword === data.confirmPassword, { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] })

// respuesta de POST /auth/mobile/login
export const mobileLoginResponseSchema = z.object({ user: userSchema, token: z.string() })

export const userRefSchema =z.object({ id: z.uuid(), username: z.string() })

export const userSummarySchema = userSchema.pick({ id: true, username: true, name: true, surname: true, photo: true })

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ChangePasswordFormInput = z.infer<typeof changePasswordFormSchema>