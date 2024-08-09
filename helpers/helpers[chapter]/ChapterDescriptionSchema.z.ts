import { z } from "zod";

export const chapterdescriptionSchema = z.object({
    description: z.string().min(1),
}); 