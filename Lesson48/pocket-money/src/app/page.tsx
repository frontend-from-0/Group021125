import Image from "next/image";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const HOW_IT_WORKS = [
  {
    title: "Money in",
    body: "Log allowance, gifts, or cash you get.",
    icon: ArrowDownLeft,
    tone: "in",
  },
  {
    title: "Money out",
    body: "Log snacks, games, and other spends.",
    icon: ArrowUpRight,
    tone: "out",
  },
  {
    title: "Balance",
    body: "Always see what you’ve got left.",
    icon: Wallet,
    tone: "balance",
  },
] as const;

export default async function LandingPage() {
  const user = await getSessionUser();

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden lg:justify-center">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/hero-pocket.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="animate-hero-drift object-cover object-[68%_center]"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,oklch(0.97_0.02_95)_0%,oklch(0.97_0.02_95_/_0.92)_38%,oklch(0.97_0.02_95_/_0.35)_62%,transparent_78%)] lg:bg-[linear-gradient(105deg,oklch(0.97_0.02_95)_0%,oklch(0.97_0.02_95_/_0.94)_42%,oklch(0.97_0.02_95_/_0.2)_68%,transparent_82%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent lg:hidden"
        />

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-6 pb-14 pt-20 sm:px-8 lg:justify-center lg:pb-24 lg:pt-24">
          <div className="animate-rise-in max-w-xl">
            <h1 className="font-[family-name:var(--font-display)] text-4xl leading-none font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              PocketMoney
            </h1>
            <p className="mt-5 max-w-[16ch] font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight text-foreground sm:text-4xl">
              See what you’ve got.
            </p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-foreground/75 sm:text-xl">
              Log money in and money out. Check your balance any time — made for
              ages 10–15, in plain words.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              {user ? (
                <Link
                  href="/home"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-14 rounded-2xl px-7 text-base font-semibold shadow-[0_10px_24px_-12px_oklch(0.42_0.1_165_/_0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_oklch(0.42_0.1_165_/_0.6)]",
                  )}
                >
                  Open my money
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login?screen_hint=signup&returnTo=/home"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-14 rounded-2xl px-7 text-base font-semibold shadow-[0_10px_24px_-12px_oklch(0.42_0.1_165_/_0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_oklch(0.42_0.1_165_/_0.6)]",
                    )}
                  >
                    Start free
                  </Link>
                  <Link
                    href="/auth/login?returnTo=/home"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-14 rounded-2xl border-2 border-foreground/15 bg-background/70 px-7 text-base font-semibold backdrop-blur-sm transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-background",
                    )}
                  >
                    I already have an account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-background px-6 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Three easy steps
          </h2>
          <p className="mt-2 max-w-xl text-base text-muted-foreground sm:text-lg">
            No banks. No charts. Just your pocket money, clearly written down.
          </p>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex gap-4 sm:flex-col sm:gap-3">
                  <span
                    className={cn(
                      "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl",
                      item.tone === "in" &&
                        "bg-[color-mix(in_oklch,var(--money-in)_18%,white)] text-[var(--money-in)]",
                      item.tone === "out" &&
                        "bg-[color-mix(in_oklch,var(--money-out)_16%,white)] text-[var(--money-out)]",
                      item.tone === "balance" &&
                        "bg-[color-mix(in_oklch,var(--brand-accent)_16%,white)] text-[var(--brand-accent)]",
                    )}
                  >
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
