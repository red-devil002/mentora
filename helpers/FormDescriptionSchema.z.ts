import { z } from "zod";

export const formdescriptionSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required",
    }),
}); 