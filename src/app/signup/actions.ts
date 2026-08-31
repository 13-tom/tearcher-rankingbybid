"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect(`/signup?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { name, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: { name, email, passwordHash },
    });
  } catch {
    redirect("/signup?error=" + encodeURIComponent("An account with that email already exists"));
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect("/login");
    }
    throw err;
  }
}
