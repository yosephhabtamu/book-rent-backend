import { z } from "zod";

const loginSchema = z.object({
    email: z.string().min(3),
    password: z.string().min(6),
  });
const registerSchema = z.object({
    fullName: z.string(),
    location:z.string(),
})

export {loginSchema, registerSchema}