import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Virtual Glasses Try-On",
  description:
    "Use a virtual glasses try-on to preview eyeglass frames on your face before choosing a pair online.",
  alternates: { canonical: canonicalUrl("/virtual-glasses-try-on") },
};

export default function VirtualGlassesTryOnPage() {
  return (
    <ContentPage
      eyebrow="Virtual glasses try-on"
      title="A simple virtual glasses try-on for real buying decisions."
      description="No long wizard and no fake makeover. Start with a photo, pick a frame, and compare realistic results."
      sections={[
        {
          title: "Built for fast comparison",
          body: "The workflow is intentionally direct: photo, frame style, generation, result. That keeps the app useful on mobile and desktop without making users scroll through a pitch first.",
        },
        {
          title: "Background stays the same",
          body: "The prompt strategy is built around preservation. It asks the model to keep the original environment, lighting, shadows, and face while editing only the eyewear.",
        },
        {
          title: "Privacy-minded by default",
          body: "Source uploads are used to create the result and then deleted. Account history stores the final generated preview, not the original face upload.",
        },
      ]}
    />
  );
}
