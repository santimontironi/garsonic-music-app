import { useQuery } from "@tanstack/react-query";
import { getMyPlaylistsService } from "../../services/playlist.service";

export const useMyPlaylists = () => {
    return useQuery({
        queryKey: ["my-playlists"],
        queryFn: getMyPlaylistsService,
    });
}
