import { useQuery } from "@tanstack/react-query";
import { getMySongsService } from "../../services/song.service";

export const useMySongs = () => {
    return useQuery({
        queryKey: ["my-songs"],
        queryFn: getMySongsService,
    });
}
