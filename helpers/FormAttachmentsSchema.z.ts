import { z } from "zod";

export const formattachmentSchema = z.object({
    url: z.string().min(1),
}); 