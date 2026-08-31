import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TEACHER_LISTING_FEE_CENTS } from "@/lib/starPacks";
import { createTeacherListingCheckoutAction } from "./actions";

export default async function AddTeacherPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { error } = await searchParams;
  const fee = (TEACHER_LISTING_FEE_CENTS / 100).toFixed(2);

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Add a teacher</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Pay a one-time ${fee} fee to add a teacher to the leaderboard.
      </p>

      {error && (
        <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={createTeacherListingCheckoutAction} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Subject (optional)</label>
          <input
            name="subject"
            type="text"
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Photo URL (optional)</label>
          <input
            name="photoUrl"
            type="url"
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Platform (optional)</label>
          <select
            name="platform"
            defaultValue=""
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          >
            <option value="">Not specified</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="BOTH">Online &amp; Offline</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-2 rounded bg-black px-4 py-2 text-white hover:bg-zinc-800"
        >
          Pay ${fee} and add teacher
        </button>
      </form>
    </div>
  );
}
