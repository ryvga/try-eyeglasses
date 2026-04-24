import { Badge } from "@/components/ui/badge";

export type ContentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{ title: string; body: string }>;
};

export function ContentPage({
  eyebrow,
  title,
  description,
  sections,
}: ContentPageProps) {
  return (
    <main className="flex-1">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col gap-4">
          <Badge className="w-fit rounded border-stone-600 bg-stone-50 font-mono uppercase text-stone-800">
            {eyebrow}
          </Badge>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] text-stone-950 md:text-6xl">
            {title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-stone-600">
            {description}
          </p>
        </div>
        <div className="grid gap-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-md border border-stone-300 bg-[#fffdf8] p-6"
            >
              <h2 className="text-2xl font-semibold text-stone-950">
                {section.title}
              </h2>
              <p className="mt-3 leading-7 text-stone-600">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
