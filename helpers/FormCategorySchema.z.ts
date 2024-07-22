import { z } from "zod";

export const formcategorySchema = z.object({
    categoryId: z.string().min(1),
});