import { z } from "zod";

const bookSchema = z.object({
    title: z.string(),
    author: z.string(),
    categoryId:z.string(),
    quantity: z.number().min(1),
    price:z.number().min(1)
  });

const bookStatusSchema = z.object({
    status: z.string()
})


export {bookSchema, bookStatusSchema} 