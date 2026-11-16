import { useQuery } from "@tanstack/react-query";
import { getFavSongsService } from "../../services/song.service";

export const useFavSongs = () => {
    return useQuery({
        queryKey: ["fav-songs"],
        queryFn: getFavSongsService,
    });
}
