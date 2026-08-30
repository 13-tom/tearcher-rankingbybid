import Link from "next/link";

export default function BuyCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Checkout cancelled</h1>
      <p className="mt-2 text-zinc-500">No charge was made.</p>
      <Link href="/stars/buy" className="mt-6 inline-block font-medium underline">
        Try again
      </Link>
    </div>
  );
}
