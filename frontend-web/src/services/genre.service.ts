import api from "./api";
import { genreSchema } from "shared/schemas/genre.schema";

export const getGenresService = async () => {
    const res = await api.get('/genres')
    return genreSchema.array().parse(res.data)
}
