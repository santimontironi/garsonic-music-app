import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSongService } from "../../services/song.service";

export const useDeleteSong = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSongService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-songs"] });
            queryClient.invalidateQueries({ queryKey: ["my-albums"] });
            queryClient.invalidateQueries({ queryKey: ["album"] });
        },
    });
}
