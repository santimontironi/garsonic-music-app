import { useQuery } from "@tanstack/react-query";
import { getAlbumByIdService } from "../../services/album.service";

export const useAlbum = (id: string) => {
    return useQuery({
        queryKey: ["album", id],
        queryFn: () => getAlbumByIdService(id),
    });
}
