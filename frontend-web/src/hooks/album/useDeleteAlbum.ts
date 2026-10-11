import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAlbumService } from "../../services/album.service";

export const useDeleteAlbum = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAlbumService,
        onSuccess: (_, albumId) => {
            queryClient.removeQueries({ queryKey: ["album", albumId] });
            queryClient.invalidateQueries({ queryKey: ["my-albums"] });
            queryClient.invalidateQueries({ queryKey: ["my-songs"] });
        },
    });
}
