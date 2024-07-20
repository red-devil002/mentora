import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title iss required",
    }),
});