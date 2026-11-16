import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavSongService } from "../../services/song.service";

export const useToggleFavSong = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleFavSongService,
        // devuelve la promesa: la mutación sigue pendiente hasta que llega la lista nueva
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fav-songs"] }),
    });
}
