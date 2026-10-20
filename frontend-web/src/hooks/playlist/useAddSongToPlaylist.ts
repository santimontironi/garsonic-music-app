import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSongToPlaylistService } from "../../services/playlist.service";

export const useAddSongToPlaylist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ playlistId, songId }: { playlistId: string, songId: string }) => addSongToPlaylistService(playlistId, { songId }),
        onSuccess: (_data, { playlistId }) => {
            queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
            queryClient.invalidateQueries({ queryKey: ["my-playlists"] });
        },
    });
}
