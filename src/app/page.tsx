import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPlatform } from "@/lib/format";

export default async function LeaderboardPage() {
  const teachers = await prisma.teacher.findMany({
    orderBy: { totalStars: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Teacher Leaderboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Boost your favorite teacher with stars to help them rank higher.
      </p>

      {teachers.length === 0 ? (
        <p className="mt-8 text-zinc-500">No teachers yet.</p>
      ) : (
        <ol className="mt-6 flex flex-col gap-2">
          {teachers.map((teacher, index) => (
            <li key={teacher.id}>
              <Link
                href={`/teachers/${teacher.id}`}
                className="flex items-center gap-4 rounded border border-zinc-200 px-4 py-3 hover:bg-zinc-50"
              >
                <span className="w-6 text-right font-bold text-zinc-400">
                  {index + 1}
                </span>
                {teacher.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-zinc-200" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{teacher.name}</p>
                  <p className="text-sm text-zinc-500">
                    {[teacher.subject, formatPlatform(teacher.platform)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <span className="font-bold">⭐ {teacher.totalStars}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
