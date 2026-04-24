import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about TryEyeglasses AI glasses try-on, privacy, generated images, free credits, and frame styles.",
  alternates: { canonical: canonicalUrl("/faq") },
};

export default function FaqPage() {
  return (
    <ContentPage
      eyebrow="FAQ"
      title="Questions about AI glasses try-on."
      description="Clear answers for users before they upload a photo or buy credits."
      sections={[
        {
          title: "Is the first try-on free?",
          body: "Yes. Anonymous visitors get one free generation. More generations require an account and paid credits.",
        },
        {
          title: "Do you change my face or background?",
          body: "No. The prompt is designed to preserve your face, identity, background, lighting, pose, and composition while changing only the eyewear.",
        },
        {
          title: "Do you keep my original photo?",
          body: "No. Source face uploads are deleted after generation. The app stores the generated result for account history when available.",
        },
        {
          title: "Can I use my own glasses reference?",
          body: "Yes. The MVP supports custom style notes, and the backend is prepared for user-uploaded reference extraction.",
        },
      ]}
    />
  );
}
