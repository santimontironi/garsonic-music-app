import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePlaylistService } from "../../services/playlist.service";

export const useDeletePlaylist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePlaylistService,
        onSuccess: (_, playlistId) => {
            queryClient.removeQueries({ queryKey: ["playlist", playlistId] });
            queryClient.invalidateQueries({ queryKey: ["my-playlists"] });
        },
    });
}
