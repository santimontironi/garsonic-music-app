import { useQuery } from "@tanstack/react-query";
import { getArtistStatsService } from "../../services/user.service";

export const useArtistStats = () => {
    return useQuery({
        queryKey: ["artist-stats"],
        queryFn: getArtistStatsService,
    });
}
