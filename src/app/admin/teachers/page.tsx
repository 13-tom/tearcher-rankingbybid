import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addTeacherAction, deleteTeacherAction } from "./actions";

export default async function AdminTeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/");
  }

  const { error } = await searchParams;
  const teachers = await prisma.teacher.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Manage teachers</h1>

      {error && (
        <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={addTeacherAction} className="mt-6 flex flex-col gap-3 rounded border border-zinc-200 p-4">
        <h2 className="font-medium">Add a teacher</h2>
        <input
          name="name"
          type="text"
          placeholder="Name"
          required
          className="rounded border border-zinc-300 px-3 py-2"
        />
        <input
          name="subject"
          type="text"
          placeholder="Subject (optional)"
          className="rounded border border-zinc-300 px-3 py-2"
        />
        <input
          name="photoUrl"
          type="url"
          placeholder="Photo URL (optional)"
          className="rounded border border-zinc-300 px-3 py-2"
        />
        <button
          type="submit"
          className="self-start rounded bg-black px-4 py-2 text-white hover:bg-zinc-800"
        >
          Add teacher
        </button>
      </form>

      <ul className="mt-8 flex flex-col gap-2">
        {teachers.map((teacher) => (
          <li
            key={teacher.id}
            className="flex items-center justify-between rounded border border-zinc-200 px-4 py-3"
          >
            <div>
              <p className="font-medium">{teacher.name}</p>
              {teacher.subject && (
                <p className="text-sm text-zinc-500">{teacher.subject}</p>
              )}
            </div>
            <form action={deleteTeacherAction}>
              <input type="hidden" name="id" value={teacher.id} />
              <button type="submit" className="text-sm font-medium text-red-600 underline">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
