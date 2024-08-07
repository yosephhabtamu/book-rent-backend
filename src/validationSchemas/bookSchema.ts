import { z } from "zod";

const bookSchema = z.object({
    title: z.string(),
    author: z.string(),
  });

const bookStatusSchema = z.object({
    status: z.string()
})


export {bookSchema, bookStatusSchema} 