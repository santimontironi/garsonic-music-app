import { useQuery } from "@tanstack/react-query";
import { getFavArtistsService } from "../../services/user.service";

export const useFavArtists = () => {
    return useQuery({
        queryKey: ["fav-artists"],
        queryFn: getFavArtistsService,
    });
}
