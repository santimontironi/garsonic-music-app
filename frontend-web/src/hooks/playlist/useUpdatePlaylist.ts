import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlaylistService } from "../../services/playlist.service";

export const useUpdatePlaylist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ playlistId, isPublic }: { playlistId: string, isPublic: boolean }) => updatePlaylistService(playlistId, { isPublic }),
        onSuccess: (_data, { playlistId }) => {
            queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
            queryClient.invalidateQueries({ queryKey: ["my-playlists"] });
            queryClient.invalidateQueries({ queryKey: ["user"] }); // el perfil público lista solo las públicas
        },
    });
}
