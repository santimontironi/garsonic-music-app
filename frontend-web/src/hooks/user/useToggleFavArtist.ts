import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavArtistService } from "../../services/user.service";

export const useToggleFavArtist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleFavArtistService,
        onSuccess: (_data, artistId) => {
            queryClient.invalidateQueries({ queryKey: ["user", artistId] }); 
            queryClient.invalidateQueries({ queryKey: ["fav-artists"] });
        },
    });
}
