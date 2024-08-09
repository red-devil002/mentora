import { z } from "zod";

export const chapteraccessSchema = z.object({
    isFree: z.boolean().default(false),
}); 