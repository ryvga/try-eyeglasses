"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2Icon, CreditCardIcon, LoaderCircleIcon } from "lucide-react";
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
  const searchParams = useSearchParams();
  const [selectedPackId, setSelectedPackId] = useState(CREDIT_PACKS[0].id);
  const [captureStatus, setCaptureStatus] = useState<"idle" | "capturing" | "captured">("idle");
  const [isPending, startTransition] = useTransition();
  const capturedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const cancelled = searchParams.get("cancelled");

    if (cancelled) {
      toast.info("PayPal checkout was cancelled.");
      return;
    }

    if (!token || capturedTokenRef.current === token) {
      return;
    }

    capturedTokenRef.current = token;
    setCaptureStatus("capturing");

    async function captureApprovedOrder(orderId: string) {
      const response = await fetch("/api/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setCaptureStatus("idle");
        toast.error(payload.message ?? "Could not capture PayPal order.");
        return;
      }

      setCaptureStatus("captured");
      toast.success("Credits unlocked.");
    }

    void captureApprovedOrder(token);
  }, [searchParams]);

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

      if (!order.approveUrl) {
        toast.error("PayPal did not return an approval link.");
        return;
      }

      window.location.assign(order.approveUrl);
    });
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-3xl">
        <p className="font-mono text-[13px] uppercase tracking-[0.78px] text-muted-foreground">
          Optional support
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground md:text-6xl">
          Keep the student project running.
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          You can use your own OpenAI API key for unlimited generations. These sandbox PayPal credits are a tiny support path while testing.
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
        disabled={isPending || captureStatus === "capturing"}
      >
        {isPending || captureStatus === "capturing" ? (
          <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
        ) : captureStatus === "captured" ? (
          <CheckCircle2Icon data-icon="inline-start" />
        ) : (
          <CreditCardIcon data-icon="inline-start" />
        )}
        {captureStatus === "capturing"
          ? "Finalizing PayPal"
          : captureStatus === "captured"
            ? "Credits unlocked"
            : "Continue with PayPal"}
      </Button>
    </section>
  );
}
