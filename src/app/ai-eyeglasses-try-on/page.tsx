import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Eyeglasses Try-On",
  description:
    "AI eyeglasses try-on powered by gpt-image-2 for realistic frame previews that preserve face, background, and lighting.",
  alternates: { canonical: canonicalUrl("/ai-eyeglasses-try-on") },
};

export default function AiEyeglassesTryOnPage() {
  return (
    <ContentPage
      eyebrow="AI eyeglasses try-on"
      title="AI eyeglasses try-on powered by gpt-image-2."
      description="The generation layer is designed for one strong result per request: realistic, budget-conscious, and specific to eyewear."
      sections={[
        {
          title: "One result, better prompt",
          body: "Instead of generating many weak options, TryEyeglasses creates one detailed edit with strong constraints around fit, scale, transparency, reflections, and preservation.",
        },
        {
          title: "Configurable model layer",
          body: "The app defaults to gpt-image-2, but model, quality, size, and endpoint details live behind a provider abstraction so the platform can improve without redesigning the app.",
        },
        {
          title: "Ready for paid credits",
          body: "The first try-on is free. After that, the app gates generation behind sign-up and PayPal-backed credits with idempotent capture handling.",
        },
      ]}
    />
  );
}
