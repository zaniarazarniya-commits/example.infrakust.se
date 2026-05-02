import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { roomRouter } from "./room-router";
import { bookingRouter } from "./booking-router";
import { favoriteRouter } from "./favorite-router";
import { reviewRouter } from "./review-router";
import { contactRouter } from "./contact-router";
import { paymentRouter } from "./payment-router";
import { emailRouter } from "./email-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  room: roomRouter,
  booking: bookingRouter,
  favorite: favoriteRouter,
  review: reviewRouter,
  contact: contactRouter,
  payment: paymentRouter,
  email: emailRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
