import { useMutation } from "@tanstack/react-query";
import { confirmAccountService } from "../../services/auth.service";

export const useConfirmAccount = () => useMutation({ mutationFn: confirmAccountService });
