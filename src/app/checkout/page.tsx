import type { Metadata } from "next";
import { CreditCheckout } from "@/components/credit-checkout";

export const metadata: Metadata = {
  title: "Buy Try-On Credits",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CreditCheckout />;
}
