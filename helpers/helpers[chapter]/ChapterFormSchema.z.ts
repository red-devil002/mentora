import { z } from "zod";

export const chapterformSchema = z.object({
    title: z.string().min(1),
});