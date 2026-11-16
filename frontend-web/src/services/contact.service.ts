import api from "./api";
import type { ContactInput } from "shared/schemas/contact.schema";

export const sendContactService = async (body: ContactInput) => {
    await api.post('/contact', body);
}
