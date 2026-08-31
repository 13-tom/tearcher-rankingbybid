"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teacherSchema } from "@/lib/validation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}

export async function addTeacherAction(formData: FormData) {
  const session = await requireAdmin();

  const parsed = teacherSchema.safeParse({
    name: formData.get("name"),
    subject: formData.get("subject"),
    photoUrl: formData.get("photoUrl"),
  });

  if (!parsed.success) {
    redirect(`/admin/teachers?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { name, subject, photoUrl } = parsed.data;

  await prisma.teacher.create({
    data: {
      name,
      subject: subject || null,
      photoUrl: photoUrl || null,
      addedById: session.user.id,
    },
  });

  revalidatePath("/admin/teachers");
  revalidatePath("/");
}

export async function deleteTeacherAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.$transaction([
    prisma.boost.deleteMany({ where: { teacherId: id } }),
    prisma.teacher.delete({ where: { id } }),
  ]);

  revalidatePath("/admin/teachers");
  revalidatePath("/");
}
