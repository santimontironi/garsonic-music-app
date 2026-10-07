import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSongService } from "../../services/song.service";

export const useCreateSong = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSongService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-songs"] });
            queryClient.invalidateQueries({ queryKey: ["my-albums"] });
        },
    });
}
