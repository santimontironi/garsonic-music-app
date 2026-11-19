import { useMutation } from "@tanstack/react-query";
import { changePasswordService } from "../../services/auth.service";

export const useChangePassword = () => useMutation({ mutationFn: changePasswordService });
