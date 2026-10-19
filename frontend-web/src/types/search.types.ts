import { searchResultSchema } from "shared/schemas/search.schema";
import { z } from "zod";

export type SearchUser = z.infer<typeof searchResultSchema>["users"][number]
