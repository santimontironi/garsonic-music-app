import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutService } from "../../services/auth.service";

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutService,
        onSuccess: () => {
            queryClient.setQueryData(["me"], null);
            // borra la cache del usuario anterior (playlists, favoritos...) para que otro login no la vea;
            // "me" se deja en null en vez de borrarlo porque el guard escucha esa query
            queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "me" });
        },
    });
}
