"use client";

import type { ReactNode } from "react";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  form: ReactNode;
  footer: ReactNode;
  sideTitle?: string;
  sideDescription?: string;
  sideItems?: string[];
};

export default function AuthShell({
  badge,
  title,
  description,
  form,
  footer,
}: AuthShellProps) {
  return (
    <section className="relative flex min-h-[calc(100svh-73px)] items-center justify-center overflow-x-hidden bg-[linear-gradient(180deg,rgba(248,245,238,0.98)_0%,rgba(255,255,255,1)_100%)] px-4 py-10 dark:bg-[linear-gradient(180deg,rgba(12,10,7,1)_0%,rgba(17,14,11,1)_100%)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,132,61,0.12),transparent_28%)]"
      />

      <div className="relative w-full max-w-xl rounded-[2rem] border border-white/80 bg-white/88 p-6 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-white/6">
        <div className="mb-8 space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border border-amber-700/20 bg-amber-50/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-900 dark:border-amber-200/15 dark:bg-amber-300/10 dark:text-amber-200">
            {badge}
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-stone-950 dark:text-white">
              {title}
            </h1>
            <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">
              {description}
            </p>
          </div>
        </div>

        {form}

        <div className="mt-8 border-t border-black/6 pt-5 dark:border-white/10">
          {footer}
        </div>
      </div>
    </section>
  );
}
