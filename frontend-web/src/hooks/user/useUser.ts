import { useQuery } from "@tanstack/react-query";
import { getUserByIdService } from "../../services/user.service";

export const useUser = (id: string) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserByIdService(id),
    });
}
