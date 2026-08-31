"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { teacherSchema } from "@/lib/validation";
import { TEACHER_LISTING_FEE_CENTS } from "@/lib/starPacks";

export async function createTeacherListingCheckoutAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const parsed = teacherSchema.safeParse({
    name: formData.get("name"),
    subject: formData.get("subject"),
    photoUrl: formData.get("photoUrl"),
  });

  if (!parsed.success) {
    redirect(`/teachers/add?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { name, subject, photoUrl } = parsed.data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: TEACHER_LISTING_FEE_CENTS,
          product_data: { name: `Add teacher: ${name}` },
        },
        quantity: 1,
      },
    ],
    client_reference_id: session.user.id,
    metadata: {
      kind: "teacher_listing",
      userId: session.user.id,
      name,
      subject: subject || "",
      photoUrl: photoUrl || "",
    },
    success_url: `${appUrl}/teachers/add/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/teachers/add/cancel`,
  });

  if (!checkoutSession.url) {
    redirect("/teachers/add?error=" + encodeURIComponent("Could not start checkout"));
  }

  redirect(checkoutSession.url);
}
