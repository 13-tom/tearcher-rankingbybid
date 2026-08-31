import Link from "next/link";

export default function AddTeacherSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Payment received</h1>
      <p className="mt-2 text-zinc-500">
        Your teacher will appear on the leaderboard in a few seconds.
      </p>
      <Link href="/" className="mt-6 inline-block font-medium underline">
        Back to leaderboard
      </Link>
    </div>
  );
}
