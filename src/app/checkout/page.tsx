import type { Metadata } from "next";
import { Suspense } from "react";
import { CreditCheckout } from "@/components/credit-checkout";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Buy Try-On Credits",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <SiteShell>
      <Suspense fallback={null}>
        <CreditCheckout />
      </Suspense>
    </SiteShell>
  );
}
