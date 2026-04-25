import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";

export type ContentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  active?: "try-on" | "collections" | "how-it-works" | "faq" | "privacy";
  sections: Array<{ title: string; body: string }>;
};

export function ContentPage({
  eyebrow,
  title,
  description,
  active,
  sections,
}: ContentPageProps) {
  return (
    <SiteShell active={active}>
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col gap-4">
          <Badge className="w-fit rounded border-foreground/50 bg-card font-mono uppercase text-foreground">
            {eyebrow}
          </Badge>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] text-foreground md:text-6xl">
            {title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="grid gap-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-md border border-foreground/15 bg-card p-6"
            >
              <h2 className="text-2xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
