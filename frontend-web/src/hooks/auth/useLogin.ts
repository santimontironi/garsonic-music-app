import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginService } from "../../services/auth.service";

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginService,
        onSuccess: (user) => {
            queryClient.setQueryData(["me"], user);
        },
    });
}
