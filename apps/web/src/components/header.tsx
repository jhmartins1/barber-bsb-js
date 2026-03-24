"use client";
import Link from "next/link";
import { Scissors } from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background/70 backdrop-blur-xl dark:border-white/10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold tracking-[0.24em] text-stone-950 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-stone-950 text-amber-200 dark:bg-amber-100 dark:text-stone-950">
              <Scissors className="size-4" />
            </span>
            BARBER BSB
          </Link>

          <nav className="hidden items-center gap-2 text-sm md:flex">
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-stone-700 transition-colors hover:bg-black/5 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              Inicio
            </Link>

            {session?.user && (
              <Link
                href="/dashboard"
                className="rounded-full px-3 py-2 text-stone-700 transition-colors hover:bg-black/5 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Agendamento
              </Link>
            )}

            {session?.user && (
              <Link
                href="/admin"
                className="rounded-full px-3 py-2 text-stone-700 transition-colors hover:bg-black/5 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
