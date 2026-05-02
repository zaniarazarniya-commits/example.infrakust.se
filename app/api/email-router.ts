import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";

export const emailRouter = createRouter({
  sendBookingConfirmation: publicQuery
    .input(
      z.object({
        bookingId: z.number(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      // Mock email sending - in production, this would integrate with SendGrid/Mailgun
      console.log(`[MOCK EMAIL] Booking confirmation sent to ${input.email} for booking #${input.bookingId}`);
      return {
        sent: true,
        messageId: `msg_${Date.now()}`,
        recipient: input.email,
      };
    }),

  sendContactReply: adminQuery
    .input(
      z.object({
        contactId: z.number(),
        reply: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      console.log(`[MOCK EMAIL] Reply sent for contact #${input.contactId}: ${input.reply.substring(0, 100)}...`);
      return {
        sent: true,
        messageId: `msg_${Date.now()}`,
        contactId: input.contactId,
      };
    }),
});
