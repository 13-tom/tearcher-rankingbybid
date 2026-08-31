import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MAX_BOOST_PER_ACTION } from "@/lib/starPacks";
import { formatPlatform } from "@/lib/format";
import { boostTeacherAction } from "./actions";

export default async function TeacherPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) notFound();

  const session = await auth();
  const balance = session?.user
    ? (await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { starBalance: true },
      }))?.starBalance ?? 0
    : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link href="/" className="text-sm text-zinc-500 underline">
        &larr; Back to leaderboard
      </Link>

      <div className="mt-4 flex items-center gap-4">
        {teacher.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={teacher.photoUrl}
            alt={teacher.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-zinc-200" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{teacher.name}</h1>
          <p className="text-zinc-500">
            {[teacher.subject, formatPlatform(teacher.platform)].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      <p className="mt-4 font-bold">⭐ {teacher.totalStars} stars</p>

      {error && (
        <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 rounded border border-zinc-200 p-4">
        {!session?.user ? (
          <p>
            <Link href="/login" className="font-medium underline">
              Log in
            </Link>{" "}
            to boost this teacher.
          </p>
        ) : balance === 0 ? (
          <p>
            You need stars to boost a teacher.{" "}
            <Link href="/stars/buy" className="font-medium underline">
              Buy stars
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <form action={boostTeacherAction} className="flex items-end gap-3">
            <input type="hidden" name="teacherId" value={teacher.id} />
            <div>
              <label className="block text-sm font-medium">
                Boost with stars (you have {balance})
              </label>
              <select
                name="amount"
                defaultValue={1}
                className="mt-1 rounded border border-zinc-300 px-3 py-2"
              >
                {Array.from(
                  { length: Math.min(balance ?? 0, MAX_BOOST_PER_ACTION) },
                  (_, i) => i + 1,
                ).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800"
            >
              Boost
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
