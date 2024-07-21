import { z } from "zod";

export const formimageSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),
}); 