import { useQuery } from "@tanstack/react-query";
import { getGenresService } from "../../services/genre.service";

export const useGenres = () => {
    return useQuery({
        queryKey: ["genres"],
        queryFn: getGenresService,
        staleTime: Infinity,
    });
}
