import type { RegisterInput } from "shared/schemas/auth.schema"

export interface RegisterPayload {
    data: RegisterInput
    photo?: File | null
}
