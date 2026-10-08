import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAlbumService } from "../../services/album.service";

export const useCreateAlbum = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAlbumService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-albums"] });
        },
    });
}
