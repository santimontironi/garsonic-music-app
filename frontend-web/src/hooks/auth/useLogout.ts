import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutService } from "../../services/auth.service";

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutService,
        onSuccess: () => {
            queryClient.setQueryData(["me"], null);
        },
    });
}
