import api from "./api";
import { searchResultSchema } from "shared/schemas/search.schema";

export const searchService = async (q: string) => {
    const res = await api.get('/search', { params: { q } })
    return searchResultSchema.parse(res.data)
}
