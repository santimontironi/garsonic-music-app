import type { RegisterInput } from "../../../shared/schemas/auth.schema.js"

export interface RegisterPayload {
    data: RegisterInput
    photo?: File | null
}
