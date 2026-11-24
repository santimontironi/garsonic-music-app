import { useQuery } from "@tanstack/react-query";
import { meService } from "../../services/auth.service";

export const useMe = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: meService,
        retry: false,
    });
}
