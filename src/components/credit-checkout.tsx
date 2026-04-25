"use client";

import { useState, useTransition } from "react";
import { CreditCardIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CREDIT_PACKS } from "@/lib/payments/paypal";

export function CreditCheckout() {
  const [selectedPackId, setSelectedPackId] = useState(CREDIT_PACKS[0].id);
  const [isPending, startTransition] = useTransition();

  function createOrder() {
    startTransition(async () => {
      const orderResponse = await fetch("/api/paypal/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: selectedPackId }),
      });
      const order = await orderResponse.json();

      if (!orderResponse.ok) {
        toast.error(order.message ?? "Could not create PayPal order.");
        return;
      }

      const captureResponse = await fetch("/api/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const capture = await captureResponse.json();

      if (!captureResponse.ok) {
        toast.error(capture.message ?? "Could not capture PayPal order.");
        return;
      }

      toast.success("Credits unlocked. PayPal JS buttons can replace this demo flow in production.");
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-3xl">
        <p className="font-mono text-[13px] uppercase tracking-[0.78px] text-muted-foreground">
          PayPal Standard Checkout
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground md:text-6xl">
          Add credits for more try-ons.
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          The server already creates and captures PayPal orders. Production can mount the PayPal JavaScript button with the same endpoints.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {CREDIT_PACKS.map((pack) => (
          <button
            key={pack.id}
            type="button"
            onClick={() => setSelectedPackId(pack.id)}
            data-selected={selectedPackId === pack.id}
            className="rounded-md border border-foreground/15 bg-card text-left transition hover:border-foreground/45 data-[selected=true]:border-foreground"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>{pack.label}</CardTitle>
                <CardDescription>{pack.credits} try-on credits</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">
                  ${(pack.amountCents / 100).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Button
        className="paper-button h-12 w-fit bg-foreground text-background hover:bg-foreground/90"
        onClick={createOrder}
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
        ) : (
          <CreditCardIcon data-icon="inline-start" />
        )}
        Continue with PayPal
      </Button>
    </main>
  );
}
