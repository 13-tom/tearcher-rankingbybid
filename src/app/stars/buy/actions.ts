"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getStarPack } from "@/lib/starPacks";

export async function createCheckoutSessionAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const packId = String(formData.get("packId") ?? "");
  const pack = getStarPack(packId);
  if (!pack) {
    redirect("/stars/buy?error=" + encodeURIComponent("Invalid star pack"));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: pack.priceCents,
          product_data: { name: `${pack.stars} stars` },
        },
        quantity: 1,
      },
    ],
    client_reference_id: session.user.id,
    metadata: {
      kind: "star_purchase",
      userId: session.user.id,
      starsGranted: String(pack.stars),
    },
    success_url: `${appUrl}/stars/buy/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/stars/buy/cancel`,
  });

  if (!checkoutSession.url) {
    redirect("/stars/buy?error=" + encodeURIComponent("Could not start checkout"));
  }

  redirect(checkoutSession.url);
}
