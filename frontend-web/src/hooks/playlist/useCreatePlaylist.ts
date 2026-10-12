import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlaylistService } from "../../services/playlist.service";

export const useCreatePlaylist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPlaylistService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-playlists"] });
        },
    });
}
