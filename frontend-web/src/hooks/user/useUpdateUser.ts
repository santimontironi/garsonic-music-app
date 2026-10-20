import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserService } from "../../services/user.service";

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUserService,
        onSuccess: (user) => {
            queryClient.setQueryData(["me"], user);
            queryClient.invalidateQueries({ queryKey: ["user", user.id] });
        },
    });
}
