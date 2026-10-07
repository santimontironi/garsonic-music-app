import { useQuery } from "@tanstack/react-query";
import { getMyAlbumsService } from "../../services/album.service";

export const useMyAlbums = () => {
    return useQuery({
        queryKey: ["my-albums"],
        queryFn: getMyAlbumsService,
    });
}
