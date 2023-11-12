import { z } from "zod";

export const RecipeValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be 3 characters long" })
    .max(128, { message: "Title must be less than 128 characters" }),
  cooktime: z
    .number()
    .max(180, { message: "The cook time should not exceed 180 minutes." }),
  ingredients: z.string(),
  instructions: z.string(),
  content: z.any(),
});

export type RecipeCreationRequest = z.infer<typeof RecipeValidator>;
