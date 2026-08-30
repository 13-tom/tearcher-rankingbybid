import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature ?? "",
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const starsGranted = Number(session.metadata?.starsGranted ?? 0);

    if (userId && starsGranted > 0) {
      try {
        await prisma.$transaction([
          prisma.starPurchase.create({
            data: {
              studentId: userId,
              stripeCheckoutSessionId: session.id,
              starsGranted,
              amountCents: session.amount_total ?? 0,
              currency: session.currency ?? "usd",
            },
          }),
          prisma.user.update({
            where: { id: userId },
            data: { starBalance: { increment: starsGranted } },
          }),
        ]);
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
          // Already processed this checkout session (Stripe retry) — no-op.
        } else {
          throw err;
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
