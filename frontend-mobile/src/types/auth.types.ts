import type { RegisterInput } from "shared/schemas/auth.schema"

// en React Native no existe File: la imagen se manda como { uri, name, type }
export interface PhotoFile {
    uri: string
    name: string
    type: string
}

export interface RegisterPayload {
    data: RegisterInput
    photo?: PhotoFile | null
}
