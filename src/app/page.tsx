import { ArrowRightIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { TryOnStudio } from "@/components/try-on-studio";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { canonicalUrl, jsonLd } from "@/lib/seo";

export const metadata = {
  alternates: {
    canonical: canonicalUrl("/"),
  },
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <header className="sticky top-0 z-30 border-b border-stone-300 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1480px] items-center justify-between px-4 md:px-6">
          <Link href="/" className="font-mono text-sm font-bold uppercase tracking-[0.84px]">
            TryEyeglasses
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-stone-600 md:flex">
            <a href="/try-on-glasses">Try on glasses</a>
            <a href="/virtual-glasses-try-on">Virtual try-on</a>
            <a href="/faq">FAQ</a>
          </nav>
          <a
            href="#studio"
            className={cn(buttonVariants({ variant: "outline" }), "paper-button")}
          >
            Start free
            <ArrowRightIcon data-icon="inline-end" />
          </a>
        </div>
      </header>

      <div id="studio">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4 px-4 pt-5 md:px-6">
          <div className="grid gap-4 border-b border-stone-300 pb-5 md:grid-cols-[1fr_auto] md:items-end">
            <div className="flex max-w-4xl flex-col gap-3">
              <Badge className="w-fit rounded border-stone-600 bg-stone-50 font-mono uppercase text-stone-800">
                First AI try-on is free
              </Badge>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal text-stone-950 md:text-6xl">
                Try on glasses online before you buy.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
                Upload a face photo, choose a frame, and preview realistic AI eyeglasses while keeping your background, lighting, expression, and face untouched.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-stone-600 md:justify-end">
              <span className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-stone-50 px-3 py-2">
                <ShieldCheckIcon className="size-4" aria-hidden />
                Source deleted after generation
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-stone-50 px-3 py-2">
                <SparklesIcon className="size-4" aria-hidden />
                Powered by gpt-image-2
              </span>
            </div>
          </div>
        </div>
        <TryOnStudio />
      </div>

      <section className="border-t border-stone-300 bg-[#fffdf8]">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-4 py-14 md:grid-cols-3 md:px-6">
          <SeoBlock
            title="AI glasses try-on"
            body="Preview eyeglasses on your own photo with a single realistic edit designed to preserve your face, background, and lighting."
          />
          <SeoBlock
            title="Virtual glasses try-on"
            body="Compare frame shapes like round, square, aviator, cat-eye, and acetate styles before buying online."
          />
          <SeoBlock
            title="Privacy-first preview"
            body="Your source face photo is used for the generation and then deleted; only the final result is saved for history."
          />
        </div>
      </section>
      <footer className="border-t border-stone-300 bg-stone-950 text-stone-300">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.72px]">
            TryEyeglasses / AI eyeglasses preview
          </p>
          <div className="flex gap-4 text-sm">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/faq">FAQ</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SeoBlock({ title, body }: { title: string; body: string }) {
  return (
    <article className="border-l border-stone-300 pl-4">
      <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
      <p className="mt-3 leading-7 text-stone-600">{body}</p>
    </article>
  );
}
