import { useMutation } from "@tanstack/react-query";
import { resetPasswordService } from "../../services/auth.service";

export const useResetPassword = () => useMutation({ mutationFn: resetPasswordService });
