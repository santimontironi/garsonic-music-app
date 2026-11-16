import { useMutation } from "@tanstack/react-query";
import { sendContactService } from "../../services/contact.service";

export const useSendContact = () => useMutation({ mutationFn: sendContactService });
