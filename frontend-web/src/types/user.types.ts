import { userProfileSchema, type UpdateUserInput } from "shared/schemas/user.schema";
import { z } from "zod";

export type UserProfile = z.infer<typeof userProfileSchema>

export interface UpdateUserPayload extends UpdateUserInput {
    photo?: File
}
