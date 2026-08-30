import { z } from "zod";
import { MAX_BOOST_PER_ACTION } from "./starPacks";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const boostSchema = z.object({
  teacherId: z.string().min(1),
  amount: z.coerce.number().int().min(1).max(MAX_BOOST_PER_ACTION),
});

export const teacherSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  photoUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
});
