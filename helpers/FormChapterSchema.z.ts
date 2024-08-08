import { z } from "zod";

export const formchapterSchema = z.object({
        title: z.string().min(1),
})