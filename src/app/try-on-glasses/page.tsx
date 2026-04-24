import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Try On Glasses Online",
  description:
    "Try on glasses online with AI using your own photo. Preview realistic frames while preserving your background, lighting, and face.",
  alternates: { canonical: canonicalUrl("/try-on-glasses") },
};

export default function TryOnGlassesPage() {
  return (
    <ContentPage
      eyebrow="Try on glasses"
      title="Try on glasses online with one realistic AI preview."
      description="TryEyeglasses helps you compare frame shapes before buying online. Upload a clear photo, choose a style, and get a realistic eyeglasses preview."
      sections={[
        {
          title: "How the AI try-on works",
          body: "The app uses your source photo as the visual reference, adds the selected eyewear, and instructs the image model to preserve identity, lighting, camera angle, background, expression, and composition.",
        },
        {
          title: "Best photos for accurate fit",
          body: "Use a front-facing or lightly angled photo with visible eyes, nose bridge, and ears. Natural daylight or soft indoor light usually gives the most believable lens reflections and shadows.",
        },
        {
          title: "Frame styles included",
          body: "The first catalog includes round titanium, rectangular acetate, soft square honey, tortoise panto, aviator metal, and cat-eye styles, with user reference notes for more control.",
        },
      ]}
    />
  );
}
