import { useQuery } from "@tanstack/react-query";
import { getPlaylistByIdService } from "../../services/playlist.service";

export const usePlaylist = (id: string) => {
    return useQuery({
        queryKey: ["playlist", id],
        queryFn: () => getPlaylistByIdService(id),
    });
}
