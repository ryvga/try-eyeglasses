import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using TryEyeglasses AI glasses try-on.",
  alternates: { canonical: canonicalUrl("/terms") },
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Terms"
      title="Terms of use."
      description="A practical starting point for the MVP. Have counsel review before production advertising or paid traffic."
      sections={[
        {
          title: "Generated previews",
          body: "Try-on images are previews and may not perfectly represent physical frame fit, prescription lenses, or retailer inventory.",
        },
        {
          title: "Acceptable use",
          body: "Users should only upload images they have the right to use and should not upload sensitive, illegal, or non-consensual content.",
        },
        {
          title: "Credits",
          body: "Paid credits unlock additional generations. Failed generations should not debit credits, and refunds or adjustments may be handled through support.",
        },
      ]}
    />
  );
}
