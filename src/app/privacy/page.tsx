import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for TryEyeglasses AI glasses try-on.",
  alternates: { canonical: canonicalUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Privacy"
      title="Privacy policy."
      description="This MVP is designed to minimize sensitive image retention."
      sections={[
        {
          title: "Photo handling",
          body: "Source face photos are used to produce a try-on generation and then deleted. Generated results and metadata may be stored for account history, support, abuse prevention, and billing records.",
        },
        {
          title: "Generation providers",
          body: "Images and prompts may be sent to OpenAI for generation. Production deployments must use server-side secrets only and should rotate any credentials exposed outside the hosting secret store.",
        },
        {
          title: "Payments",
          body: "Payment processing is handled through PayPal. TryEyeglasses stores order status, credit grants, and idempotency metadata, not card details.",
        },
      ]}
    />
  );
}
