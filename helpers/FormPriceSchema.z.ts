import { z } from "zod";

export const formpriceSchema = z.object({
    price: z.coerce.number(),
});