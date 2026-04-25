import { ShieldCheckIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { TryOnStudio } from "@/components/try-on-studio";
import { Badge } from "@/components/ui/badge";
import { canonicalUrl, jsonLd } from "@/lib/seo";

export const metadata = {
  alternates: {
    canonical: canonicalUrl("/"),
  },
};

export default function Home() {
  return (
    <SiteShell active="try-on">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />

      <div id="studio">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4 px-4 pt-5 md:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.72px] text-muted-foreground"
          >
            <Link href="/">Home</Link>
            <span>/</span>
            <a href="#studio" className="text-foreground">
              Try on glasses
            </a>
          </nav>
          <div className="grid gap-4 border-b border-foreground/15 pb-5 md:grid-cols-[1fr_auto] md:items-end">
            <div className="flex max-w-4xl flex-col gap-3">
              <Badge className="w-fit rounded border-foreground/50 bg-card font-mono uppercase text-foreground">
                Student-built AI virtual try-on
              </Badge>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal text-foreground md:text-6xl">
                Try glasses on. In seconds.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Upload a face photo, select up to eight real-world frame references, and generate one detailed gpt-image-2 try-on board without fake overlays.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground md:justify-end">
              <span className="inline-flex items-center gap-2 rounded-md border border-foreground/15 bg-card px-3 py-2">
                <ShieldCheckIcon className="size-4" aria-hidden />
                One free generation daily
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-foreground/15 bg-card px-3 py-2">
                <SparklesIcon className="size-4" aria-hidden />
                Bring your own API key
              </span>
            </div>
          </div>
        </div>
        <TryOnStudio />
      </div>

      <section className="border-t border-foreground/15 bg-card">
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
    </SiteShell>
  );
}

function SeoBlock({ title, body }: { title: string; body: string }) {
  return (
    <article className="border-l border-foreground/20 pl-4">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
    </article>
  );
}
