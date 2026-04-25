import type { Metadata } from "next";
import { Suspense } from "react";
import { CreditCheckout } from "@/components/credit-checkout";

export const metadata: Metadata = {
  title: "Buy Try-On Credits",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CreditCheckout />
    </Suspense>
  );
}
