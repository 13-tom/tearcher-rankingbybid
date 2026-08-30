import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/logout-action";

export default async function Navbar() {
  const session = await auth();

  const balance = session?.user
    ? (await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { starBalance: true },
      }))?.starBalance ?? 0
    : null;

  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
      <Link href="/" className="font-bold">
        Teacher Rankings
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {session?.user ? (
          <>
            <span className="text-zinc-600">
              {session.user.name} &middot; ⭐ {balance}
            </span>
            <Link href="/stars/buy" className="font-medium underline">
              Buy stars
            </Link>
            {session.user.role === "ADMIN" && (
              <Link href="/admin/teachers" className="font-medium underline">
                Admin
              </Link>
            )}
            <form action={logoutAction}>
              <button type="submit" className="font-medium underline">
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="font-medium underline">
              Log in
            </Link>
            <Link href="/signup" className="font-medium underline">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
