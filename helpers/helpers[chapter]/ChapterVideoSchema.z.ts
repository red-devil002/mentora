import { z } from "zod";

export const chaptervideoSchema = z.object({
    videoUrl: z.string().min(1),
}); 