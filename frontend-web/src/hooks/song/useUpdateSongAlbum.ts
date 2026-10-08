import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSongAlbumService } from "../../services/song.service";

export const useUpdateSongAlbum = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ songId, albumId }: { songId: string, albumId: string | null }) =>
            updateSongAlbumService(songId, { albumId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-songs"] });
            queryClient.invalidateQueries({ queryKey: ["my-albums"] });
            queryClient.invalidateQueries({ queryKey: ["album"] });
        },
    });
}
