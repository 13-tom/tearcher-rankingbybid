import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { STAR_PACKS } from "@/lib/starPacks";
import { createCheckoutSessionAction } from "./actions";

export default async function BuyStarsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">Buy stars</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Use stars to boost your favorite teacher up the leaderboard.
      </p>

      {error && (
        <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STAR_PACKS.map((pack) => (
          <form key={pack.id} action={createCheckoutSessionAction}>
            <input type="hidden" name="packId" value={pack.id} />
            <button
              type="submit"
              className="flex w-full flex-col items-center gap-2 rounded border border-zinc-200 p-6 hover:bg-zinc-50"
            >
              <span className="text-2xl font-bold">⭐ {pack.stars}</span>
              <span className="text-zinc-500">${(pack.priceCents / 100).toFixed(2)}</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
