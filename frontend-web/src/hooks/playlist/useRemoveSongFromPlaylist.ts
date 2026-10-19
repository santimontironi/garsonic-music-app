import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeSongFromPlaylistService } from "../../services/playlist.service";

export const useRemoveSongFromPlaylist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ playlistId, songId }: { playlistId: string, songId: string }) => removeSongFromPlaylistService(playlistId, songId),
        onSuccess: (_data, { playlistId }) => {
            queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
            queryClient.invalidateQueries({ queryKey: ["my-playlists"] });
        },
    });
}
