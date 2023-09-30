import { z } from "zod";

export const SubbreaditValidator = z.object({
  name: z
    .string()
    .min(3)
    .max(21),
});

export const SubbreaditSubscriptionValidator = z.object({
  subbreaditId: z.string(),
});

export type CreateSubbreaditPayload = z.infer<typeof SubbreaditValidator>;
export type SubscribeToSubbreaditPayload = z.infer<
  typeof SubbreaditSubscriptionValidator
>;
