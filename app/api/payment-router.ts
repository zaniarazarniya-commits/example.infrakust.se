import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

export const paymentRouter = createRouter({
  createIntent: publicQuery
    .input(
      z.object({
        amount: z.number().positive(),
        currency: z.string().default("EUR"),
      })
    )
    .mutation(async ({ input }) => {
      // Mock payment intent creation
      const mockIntentId = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const mockClientSecret = `${mockIntentId}_secret_${Math.random().toString(36).substring(2, 15)}`;

      return {
        intentId: mockIntentId,
        clientSecret: mockClientSecret,
        amount: input.amount,
        currency: input.currency,
        status: "requires_confirmation",
      };
    }),

  confirm: publicQuery
    .input(z.object({ intentId: z.string() }))
    .mutation(async ({ input }) => {
      // Mock payment confirmation
      return {
        intentId: input.intentId,
        status: "succeeded",
        message: "Payment processed successfully (demo mode)",
      };
    }),
});
