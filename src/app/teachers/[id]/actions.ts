"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { boostSchema } from "@/lib/validation";

export async function boostTeacherAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const parsed = boostSchema.safeParse({
    teacherId: formData.get("teacherId"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    redirect(
      `/teachers/${formData.get("teacherId")}?error=${encodeURIComponent(
        parsed.error.issues[0].message,
      )}`,
    );
  }

  const { teacherId, amount } = parsed.data;
  const studentId = session.user.id;

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: studentId, starBalance: { gte: amount } },
        data: { starBalance: { decrement: amount } },
      }),
      prisma.teacher.update({
        where: { id: teacherId },
        data: { totalStars: { increment: amount } },
      }),
      prisma.boost.create({
        data: { studentId, teacherId, amount },
      }),
    ]);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      redirect(
        `/teachers/${teacherId}?error=${encodeURIComponent(
          "Not enough stars — buy more to keep boosting",
        )}`,
      );
    }
    throw err;
  }

  revalidatePath("/");
  revalidatePath(`/teachers/${teacherId}`);
  redirect(`/teachers/${teacherId}`);
}
